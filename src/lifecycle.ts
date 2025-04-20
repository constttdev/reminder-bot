import fs from "fs/promises";
import client from "./index";
import { EmbedBuilder } from "discord.js";
import { db } from "./services/db";

async function repeatWithTimingControl(fn) {
    while (true) {
        const start = Date.now();
        await fn();
        const duration = Date.now() - start;
        const delay = 1000 - duration;
        if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    }
}

async function reminderTask() {
    const jsonText = await fs.readFile("reminders.json", "utf-8");

    const jsonData = JSON.parse(jsonText) as {
        reminders: {
            [userId: string]: {
                [reminderId: string]: {
                    id: string;
                    reminder: string;
                    remindAt: number;
                    createdTime: number;
                    userId: string;
                };
            };
        };
    };

    if (!jsonData.reminders) return;

    const usersIDs = Object.keys(jsonData.reminders);

    usersIDs.forEach((userId) => {
        const userReminderIDs = Object.keys(jsonData.reminders[userId]);

        const expiredReminders = userReminderIDs.map((reminderID) => {
            const reminder = jsonData.reminders[userId][reminderID];
            const currentTime = Date.now();
            const reminderTime = reminder.remindAt;

            if (reminderTime < currentTime) {
                return reminder;
            }
        });

        expiredReminders.forEach(async (expiredReminder) => {
            const userId = expiredReminder?.userId;
            if (!userId) return;

            const embed = new EmbedBuilder().setTitle("Reminder").addFields({
                name: "Its time to remind you of",
                value: expiredReminder.reminder,
                inline: false,
            });

            await client.users.send(userId, { embeds: [embed] });
            await db.delete(`/reminders/${expiredReminder.userId}/${expiredReminder.id}`);
        });
    });
}

export function startReminderLoop() {
    repeatWithTimingControl(reminderTask);
}

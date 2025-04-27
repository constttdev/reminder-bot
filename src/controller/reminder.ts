import * as chrono from "chrono-node";
import { ulid } from "ulid";
import { sendServerEmbed } from "./embed";
import { ChatInputCommandInteraction } from "discord.js";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://reminder-bot.db.constt.de");

/**
 * ## Creates an Reminder
 * @param userId The ID of the discord user
 * @param reminder The reminder to send the user
 * @param remindAt The Time when the user should be reminded in unix time
 */
export async function createReminder(
    interaction: ChatInputCommandInteraction,
    userId: number,
    reminder: string,
    remindAt: string
) {
    const reminderId = ulid();

    if (!remindAt) {
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "Please provide an Time",
                value: "Without an Time the bot doesnt know when to remind you. (/addreminder <abc> <in 10m>",
                inline: false,
            },
        ]);
    }

    try {
        const chronoTime = chrono.parseDate(remindAt);

        if (!chronoTime) {
            return await sendServerEmbed(interaction, "Error", undefined, [
                {
                    name: "Please provide an valid time",
                    value: "e.g. /addreminder <bake bread> <in 10m>",
                    inline: false,
                },
            ]);
        }

        const reminderData = {
            id: reminderId,
            reminder,
            remindAt: Number(new Date(chronoTime).getTime()),
            createdAt: Date.now(),
            userId: interaction.user.id,
        };

        console.log(`data: ${JSON.stringify(reminderData)}`);

        await pb.collection("reminders").create(reminderData);

        return await sendServerEmbed(interaction, "Added reminder", undefined, [
            {
                name: "Sucesfully added an reminder",
                value: `${reminder} | ${remindAt}`,
                inline: false,
            },
        ]);
    } catch (error) {
        console.log(error);
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "An error occurred",
                value: "Failed to add reminder",
                inline: false,
            },
        ]);
    }
}

/**
 * ## Removes an specified reminder from a user
 * @param interaction The chat Interaction
 * @param reminderId The ID of the reminder to remove
 * @returns Returns the promise for the send message
 */
export async function removeReminder(interaction: ChatInputCommandInteraction, reminderId: string) {
    try {
        await pb.collection("reminders").delete(reminderId);
        return await sendServerEmbed(interaction, "Removed Reminder", undefined, [
            {
                name: "Sucesfully removed an reminders",
                value: `- ${reminderId}`,
                inline: false,
            },
        ]);
    } catch (error) {
        console.log(error);
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "An error occurred",
                value: "Failed to remove reminder or the bot cant find the reminder via id",
                inline: false,
            },
        ]);
    }
}

/**
 * ## Removes all reminders from a user
 * @param interaction The chat interaction
 * @returns The promise for the send message
 */
export async function removeAllReminders(interaction: ChatInputCommandInteraction) {
    try {
        const resultList = await pb.collection("reminders").getList(1, 500, {
            filter: `userId = ${interaction.user.id}`,
        });

        resultList.items.forEach(async (item) => {
            await pb.collection("reminders").delete(item.id);
        });

        return await sendServerEmbed(interaction, "Removed all reminders", undefined, [
            {
                name: "Sucesfully removed all your reminders",
                value: "Removed all your reminders from our database",
                inline: false,
            },
        ]);
    } catch (error) {
        console.log(error);
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "An error occurred",
                value: "Failed to remove all reminders",
                inline: false,
            },
        ]);
    }
}

export async function getAllReminders(interaction: ChatInputCommandInteraction) {
    try {
        const resultList = await pb.collection("reminders").getList(1, 500, {
            filter: `userId = ${interaction.user.id}`,
        });

        if (!resultList.items) {
            return await sendServerEmbed(interaction, "No reminders", undefined, [
                {
                    name: "You currently got no reminders",
                    value: "Add reminders by using /addreminder <reminder> <time>",
                    inline: false,
                },
            ]);
        }

        const embedFields = resultList.items.map((reminder) => ({
            name: `${reminder.reminder}`,
            value: `<t:${(reminder.remindAt / 1000).toFixed(0)}:R> | \`${reminder.id}\``,
            inline: false,
        }));

        return await sendServerEmbed(interaction, "Your reminders", undefined, embedFields);
    } catch (error) {
        console.error(error);
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "An error occurred",
                value: "Failed to load reminders",
                inline: false,
            },
        ]);
    }
}

export async function getNearestReminder(interaction: ChatInputCommandInteraction) {
    try {
        const resultList = await pb.collection("reminders").getList(1, 500, {
            filter: `userId = ${interaction.user.id}`,
        });

        if (!resultList.items || resultList.items.length === 0) {
            return await sendServerEmbed(interaction, "No reminders", undefined, [
                {
                    name: "You currently got no reminders",
                    value: "Add reminders by using /addreminder <reminder> <time>",
                    inline: false,
                },
            ]);
        }

        let nearestReminder = resultList.items[0];

        resultList.items.forEach((reminder) => {
            if (reminder.remindAt < nearestReminder.remindAt) {
                nearestReminder = reminder;
            }
        });

        return await sendServerEmbed(interaction, "Nearest Reminder", undefined, [
            {
                name: `${nearestReminder.reminder}`,
                value: `<t:${(nearestReminder.remindAt / 1000).toFixed(0)}:R> | \`${nearestReminder.id}\``,
                inline: false,
            },
        ]);
    } catch (error) {
        console.error(error);
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "An error occurred",
                value: "Failed to load reminders",
                inline: false,
            },
        ]);
    }
}

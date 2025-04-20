import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";

export const data = new SlashCommandBuilder().setName("allreminders").setDescription("Displays all your reminders");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
        const userId = interaction.user.id;

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

        const userReminders = jsonData.reminders[userId];
        if (!userReminders) {
            const embed = new EmbedBuilder().setTitle("No reminders").addFields({
                name: "You currently got no reminders",
                value: "Add reminders by using /addreminder <reminder> <time>",
                inline: false,
            });
            return await interaction.editReply({ embeds: [embed] });
        }

        const reminderKeys = Object.keys(userReminders);

        const reminderEmbed = new EmbedBuilder().setTitle("Your reminders");
        reminderKeys.forEach((reminderKey) => {
            const reminder = userReminders[reminderKey];

            reminderEmbed.addFields({
                name: `${reminder.reminder}`,
                value: `<t:${(reminder.remindAt / 1000).toFixed(0)}:R> | \`${reminder.id}\``,
                inline: false,
            });
        });

        await interaction.editReply({ embeds: [reminderEmbed] });
    } catch (error) {
        const embed = new EmbedBuilder().setTitle("Error").addFields({
            name: "An error occurred",
            value: "Failed to load reminders",
            inline: false,
        });
        console.error(error);
        await interaction.editReply({ embeds: [embed] });
    }
}

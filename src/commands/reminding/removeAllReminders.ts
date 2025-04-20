import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { db } from "../../db";

export const data = new SlashCommandBuilder()
    .setName("removeallreminders")
    .setDescription("Removes all your reminders");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
        await db.delete(`/reminders/${interaction.user.id}`);

        const embed = new EmbedBuilder()
            .setTitle("Removed reminders")
            .addFields({
                name: "Sucesfully added an reminder",
                value: `Removed all your reminders from the database`,
                inline: false,
            });
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        const embed = new EmbedBuilder().setTitle("Error").addFields({
            name: "An error occurred",
            value: "Failed to remove all reminders",
            inline: false,
        });
        console.log(error);
        await interaction.reply({ embeds: [embed] });
    }
}

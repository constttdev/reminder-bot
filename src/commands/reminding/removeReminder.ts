import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "discord.js";
import { db } from "../../db";

export const data = new SlashCommandBuilder()
    .setName("removereminder")
    .setDescription("Removes an specific reminder")
    .addStringOption((option: SlashCommandStringOption) => {
        return option
            .setName("id")
            .setDescription("The reminder to remove")
            .setRequired(true)
            .setMinLength(1);
    });

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const reminderId = interaction.options.getString("id");

    try {
        await db.delete(`/reminders/${interaction.user.id}/${reminderId}`);
        console.log(`removed /reminders/${interaction.user.id}/${reminderId}`);
        const embed = new EmbedBuilder()
            .setTitle("Removed reminder")
            .addFields({
                name: "Sucesfully removed an reminders",
                value: `- ${reminderId}`,
                inline: false,
            });
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        const embed = new EmbedBuilder().setTitle("Error").addFields({
            name: "An error occurred",
            value: "Failed to remove reminder or the bot cant find the reminder via id",
            inline: false,
        });
        console.log(error);
        await interaction.reply({ embeds: [embed] });
    }
}

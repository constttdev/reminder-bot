import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getNearestReminder } from "../../controller/reminder";

export const data = new SlashCommandBuilder()
    .setName("nearesttreminder")
    .setDescription("Displays the nearest reminder");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    getNearestReminder(interaction);
}

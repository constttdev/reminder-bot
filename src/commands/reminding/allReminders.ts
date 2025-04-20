import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getAllReminders } from "../../controller/reminder";

export const data = new SlashCommandBuilder().setName("allreminders").setDescription("Displays all your reminders");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    getAllReminders(interaction);
}

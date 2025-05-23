import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { removeAllReminders } from "../../controller/reminder";

export const data = new SlashCommandBuilder()
    .setName("removeallreminders")
    .setDescription("Removes all your reminders");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    removeAllReminders(interaction);
}

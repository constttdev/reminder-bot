import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { removeReminder } from "../../controller/reminder";

export const data = new SlashCommandBuilder()
    .setName("removereminder")
    .setDescription("Removes an specific reminder")
    .addStringOption((option: SlashCommandStringOption) => {
        return option.setName("id").setDescription("The reminder to remove").setRequired(true).setMinLength(1);
    });

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const reminderId = interaction.options.getString("id");
    removeReminder(interaction, String(reminderId));
}

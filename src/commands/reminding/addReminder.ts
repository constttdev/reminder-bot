import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("addreminder")
    .setDescription("Adds an specific reminder")
    .addStringOption((option: SlashCommandStringOption) => {
        return option
            .setName("reminder")
            .setDescription("The reminder to add")
            .setRequired(true)
            .setMinLength(1);
    });

export async function execute(interaction: ChatInputCommandInteraction) {
    const reminder = interaction.options.getString("reminder");
    try {
    } catch (error) {
        const embed = new EmbedBuilder().setTitle("Error").addFields({
            name: "An error occurred",
            value: "Failed to add reminder",
            inline: false,
        });
        await interaction.reply({ embeds: [embed] });
    }
}

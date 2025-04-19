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
    })
    .addStringOption((option: SlashCommandStringOption) => {
        return option
            .setName("time")
            .setDescription("When to remind you")
            .setRequired(true)
            .setMinLength(1);
    });

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const reminder = interaction.options.getString("reminder");
    const time = interaction.options.getString("time");

    try {
        const embed = new EmbedBuilder().setTitle("Added reminder").addFields({
            name: "Sucesfully added an reminder",
            value: `${reminder} | ${time}`,
            inline: false,
        });
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        const embed = new EmbedBuilder().setTitle("Error").addFields({
            name: "An error occurred",
            value: "Failed to add reminder",
            inline: false,
        });
        console.log(error);
        await interaction.reply({ embeds: [embed] });
    }
}

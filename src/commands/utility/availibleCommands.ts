import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("availiblecommands")
    .setDescription("Replies with the avalible commands");

const embed = new EmbedBuilder()
    .setTitle("Currently availible commands")
    .addFields(
        {
            name: "`/allreminders`",
            value: "Displays all your reminders",
            inline: false,
        },
        {
            name: "`/addreminder <time> <reminder (e.g. in 10m)>`",
            value: "Adds an reminder",
            inline: false,
        },
        {
            name: "`/removereminder <id>`",
            value: "Removes an specific reminder",
            inline: false,
        },
        {
            name: "`/removeallreminders`",
            value: "Removes all your reminders",
            inline: false,
        },
        {
            name: "`/exportreminder <id>`",
            value: "Exports an specific reminder",
            inline: false,
        },
        {
            name: "`/exportallreminder`",
            value: "Exports all your reminders",
            inline: false,
        },
        {
            name: "`/nextreminder`",
            value: "Displays your next reminder ( Optionally you can dispaly multiple next Timers using the <timers> argument )",
            inline: false,
        }
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({ embeds: [embed] });
}

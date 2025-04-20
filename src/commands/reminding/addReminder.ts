import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { createReminder } from "../../controller/reminder";
import { sendServerEmbed } from "../../controller/embed";

export const data = new SlashCommandBuilder()
    .setName("addreminder")
    .setDescription("Adds an specific reminder")
    .addStringOption((option: SlashCommandStringOption) => {
        return option.setName("reminder").setDescription("The reminder to add").setRequired(true).setMinLength(1);
    })
    .addStringOption((option: SlashCommandStringOption) => {
        return option.setName("time").setDescription("When to remind you").setRequired(true).setMinLength(1);
    });

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const reminder = interaction.options.getString("reminder");
    const time = interaction.options.getString("time");

    if (!time) {
        return await sendServerEmbed(interaction, "Error", undefined, [
            {
                name: "Please provide an Time",
                value: "Without an Time the bot doesnt know when to remind you. (/addreminder <abc> <in 10m>",
                inline: false,
            },
        ]);
    }

    createReminder(interaction, Number(interaction.user.id), String(reminder), time);
}

import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { db } from "../../db";
import { v4 as uuidv4 } from "uuid";
import * as chrono from "chrono-node";

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
    const reminderId = uuidv4();

    if (!time) {
        const embed = new EmbedBuilder().setTitle("Error").addFields({
            name: "Please provide an Time",
            value: "Without an Time the bot doesnt know when to remind you. (/addreminder <abc> <in 10m>",
            inline: false,
        });
        return await interaction.editReply({ embeds: [embed] });
    }

    try {
        const chronoTime = chrono.parseDate(time);

        if (!chronoTime) {
            const embed = new EmbedBuilder().setTitle("Error").addFields({
                name: "Please provide an valid time",
                value: "e.g. /addreminder <bake bread> <in 10m>",
                inline: false,
            });
            return await interaction.editReply({ embeds: [embed] });
        }

        const reminderData = {
            id: reminderId,
            reminder,
            remindAt: Number(new Date(chronoTime).getTime()),
            createdTime: Date.now(),
            userId: interaction.user.id,
        };

        await db.push(`/reminders/${interaction.user.id}/${reminderId}`, reminderData);

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
        await interaction.editReply({ embeds: [embed] });
    }
}

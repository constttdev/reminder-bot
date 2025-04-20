import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, EmbedField } from "discord.js";

/**
 * ## Sends an embed to an specific channel
 * @param interaction The chat interaction
 * @param channelID The ID of the channel to send the embed to
 * @param title The title of the embed
 * @param color The color of the embed (optional)
 * @param fields All fields in the embed
 * @returns Returns the promise for the send message
 */
export async function sendServerEmbed(
    interaction: ChatInputCommandInteraction,
    title: string,
    color: ColorResolvable = "#000000",
    fields: EmbedField[]
) {
    const embed = new EmbedBuilder().setTitle(title).setColor(color);
    fields.forEach((field) => {
        embed.addFields(field);
    });
    return await interaction.editReply({ embeds: [embed] });
}

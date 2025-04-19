import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("helloworld")
  .setDescription("Replies with an example embed");

const embed = new EmbedBuilder()
  .setTitle("Example Command")
  .setDescription("This is an example command");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

import { Events } from "discord.js";

export const name = Events.ClientReady;

export const execute = async (client) => {
    console.log(`Logged in as ${client.user.tag}`);
    // client.user.setActivity("Example Status", {
    //   type: ActivityType.Playing,
    // });
};

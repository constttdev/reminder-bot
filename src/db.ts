import { JsonDB, Config } from "node-json-db";
import fs from "fs/promises";

export async function tryCatchFile() {
    try {
        await fs.access("./reminders.json");
    } catch {
        await fs.writeFile("./reminders.json", "{}", "utf-8");
    }
}
export const db = new JsonDB(new Config("reminders", true));

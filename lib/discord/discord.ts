import { Client, GatewayIntentBits, Partials } from 'discord.js';

const token = process.env.BOT_TOKEN as string;

class Singleton {
    private static _instance: Singleton;
    private client: Client;
    private constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        });
        this.client.login(token);
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new Singleton();
        }
        return this._instance.client;
    }
}
const client = Singleton.instance;

export default client;

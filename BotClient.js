const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { Kazagumo } = require('kazagumo');
const { Connectors } = require('shoukaku');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const { delay, randomRange } = require('./utils');
const { staggeredForEach, globalLimiter } = require('./antiratelimit');

class BotClient extends Client {
    static allBots = []; // MADE BY ϻᴀχ </>

    constructor(token, index, nodes) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.token = token;
        this.index = index;

        
        this.kazagumo = new Kazagumo({
            defaultSearchEngine: "youtube",
            send: (guildId, payload) => {
                const guild = this.guilds.cache.get(guildId);
                if (guild) guild.shard.send(payload);
            }
        }, new Connectors.DiscordJS(this), nodes, {
            moveOnDisconnect: true,
            resume: true,
            resumeTimeout: 30,
            reconnectTries: 10,
            restTimeout: 15000
        });

        // MADE BY ϻᴀχ </>
        this.commands = new Map();
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if ('name' in command && 'execute' in command) {
                this.commands.set(command.name, command);
                
                if (command.aliases && Array.isArray(command.aliases)) {
                    for (const alias of command.aliases) {
                        this.commands.set(alias, command);
                    }
                }
            } else {
                console.warn(`[WARNING] Command file ${file} missing "name" or "execute"`);
            }
        }

        this.setupEvents();

        
        BotClient.allBots.push(this);
    }

    setupEvents() {
        this.on('ready', () => {
            console.log(`[Bot #${this.index + 1} | ${this.user.tag}] Online`);
            this.user.setPresence({
                afk: true,
                activities: [{ name: 'ᴿᴬᴳᴱ † F🇦🇹🇭🇪🇷', type: ActivityType.Listening }],
                status: 'idle'
            });
        });

this.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();

    if (!cmdName) return;

    // MADE BY ϻᴀχ </>)
    let command = this.commands.get(cmdName);
    if (!command) {
        command = [...this.commands.values()].find(c => c.aliases?.includes(cmdName));
    }

    if (!command) return;

    try {
        const authorId = message.author.id;
        const isOwner = config.owners.includes(authorId);

        
        console.log(`[CMD] ${cmdName} by ${authorId} (${message.author.tag}) → owner? ${isOwner ? 'YES' : 'NO'}`);

      
        if (!isOwner) {
            return message.reply("i Only Listen To Owner").catch(() => {});
        }

        // If we reach here → it's owner → execute
        await command.execute(this, message, args);
    } catch (err) {
        console.error(`Command ${cmdName} failed on ${this.user.tag}:`, err);
        message.reply("Something broke inside me...").catch(() => {});
    }
});

        
        this.kazagumo.shoukaku.on('error', (name, error) => {
            console.error(`[${this.user?.tag}] Node ${name} error:`, error);
        });

        this.kazagumo.shoukaku.on('ready', (name) => {
            console.log(`[${this.user?.tag}] Connected to Lavalink node: ${name}`);
        });

        this.kazagumo.shoukaku.on('close', (name, code, reason) => {
            console.log(`[${this.user?.tag}] Node ${name} closed: ${code} - ${reason}`);
        });

        this.kazagumo.on('playerStart', (player, track) => {
            console.log(`[${this.user.tag}] Now playing: ${track.title}`);
        });
    }

    // ────────────────────────────────────────────────
    // Made By ϻᴀχ </>
    // ────────────────────────────────────────────────

    static async changeAllAvatars(url) {
        let success = 0;
        await staggeredForEach(BotClient.allBots, async (bot) => {
            await globalLimiter.wait('avatar_change', 1800);
            await bot.user.setAvatar(url);
            success++;
            console.log(`[${bot.user.tag}] Avatar updated`);
        }, {
            minDelay: 400,
            maxDelay: 1100,
            log: true
        });
        return success;
    }

    static async changeAllBanners(url) {
        let success = 0;
        await staggeredForEach(BotClient.allBots, async (bot) => {
            await globalLimiter.wait('banner_change', 2200);
            await bot.user.setBanner(url);
            success++;
            console.log(`[${bot.user.tag}] Banner updated`);
        }, {
            minDelay: 500,
            maxDelay: 1400,
            log: true
        });
        return success;
    }

    async start() {
        try {
            await this.login(this.token);
        } catch (e) {
            console.error(`[Bot #${this.index + 1}] Login failed: ${e.message}`);
        }
    }
}

module.exports = BotClient;
// MADE BY ϻᴀχ </>
const BotClient = require('../BotClient');
const { staggeredForEach, globalLimiter } = require('../antiratelimit');

module.exports = {
    name: 'chb',
    aliases: ['banner', 'setbanner', 'changebanner'],
    description: 'Change banner of **all** bots at once',
    ownerOnly: true,

    async execute(client, message, args) {
        if (!args.length) {
            return message.reply('Usage: `!chb <direct image URL>`\nExample: `!chb https://i.imgur.com/abc123.jpg`');
        }

        const url = args[0].trim();

        
        if (!url.match(/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i)) {
            return message.reply('Please provide a **direct link** to an image (png, jpg, jpeg, gif, webp).');
        }

        const totalBots = BotClient.allBots.length;

        if (totalBots === 0) {
            return message.reply('No bots are currently running.');
        }

        await message.reply(`Starting banner update for **${totalBots}** bot${totalBots === 1 ? '' : 's'}...\n(This may take some time)`);

        let success = 0;
        let failed = 0;

        try {
            await staggeredForEach(
                BotClient.allBots,
                async (bot, idx) => {
                    try {
                        
                        await globalLimiter.wait('banner_change', 2200); 

                        await bot.user.setBanner(url);
                        success++;
                        console.log(`[${bot.user.tag}] Banner updated`);
                    } catch (err) {
                        failed++;
                        console.error(`[${bot.user?.tag || `Bot #${idx+1}`}] Banner set failed: ${err.message}`);
                    }
                },
                {
                    minDelay: 500,
                    maxDelay: 1400,
                    log: true
                }
            );

            const result = [
                `Banner update finished.`,
                `✅ Success: **${success}**`,
                `❌ Failed: **${failed}**`,
                `Total: **${totalBots}**`
            ].join('\n');

            await message.channel.send(result);

        } catch (err) {
            console.error('Mass banner change crashed:', err);
            await message.channel.send('Something went wrong during the banner update process.');
        }
    }
};
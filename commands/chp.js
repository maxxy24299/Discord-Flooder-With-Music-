// MADE BY ϻᴀχ </>
const BotClient = require('../BotClient');
const { staggeredForEach, globalLimiter } = require('../antiratelimit');

module.exports = {
    name: 'chp',
    ownerOnly: true,
    async execute(client, message, args) {
        if (!args.length) return message.reply('Usage: !chp <direct image URL>');

        const url = args[0].trim();
        if (!url.match(/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i)) {
            return message.reply('Direct image link required (png/jpg/gif/webp)');
        }

        const total = BotClient.allBots.length;
        if (!total) return message.reply('No active bots.');

        await message.reply(`Updating avatar for ${total} bot${total === 1 ? '' : 's'}...`);

        let success = 0, failed = 0;

        await staggeredForEach(
            BotClient.allBots,
            async (bot) => {
                try {
                    await globalLimiter.wait('avatar_change', 1800);
                    await bot.user.setAvatar(url);
                    success++;
                } catch (err) {
                    failed++;
                    console.error(`Avatar fail for ${bot.user?.tag}: ${err.message}`);
                }
            },
            { minDelay: 400, maxDelay: 1100, log: true }
        );

        await message.channel.send(
            `Avatar update done\n` +
            `Success: **${success}**\n` +
            `Failed: **${failed}**\n` +
            `Total: **${total}**`
        );
    }
};
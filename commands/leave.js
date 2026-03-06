// MADE BY ϻᴀχ </>

module.exports = {
    name: 'leave',
    aliases: ['dc', 'disconnect', 'dcme', 'gtfo', 'fuckoff'],  
    description: 'Makes the bot leave the voice channel and clear the queue',
    async execute(client, message, args) {
        
        const player = client.kazagumo.players.get(message.guild.id);

        if (!player) {
            return message.reply("I'm not in a voice channel right now.");
        }

        const voiceChannel = message.guild.members.me.voice.channel;

        if (!voiceChannel) {
            return message.reply("I'm not connected to any voice channel.");
        }

        
        if (message.member.voice.channelId !== voiceChannel.id) {
            return message.reply("You need to be in the same voice channel as me to make me leave.");
        }

        try {
            
            player.destroy();

            
            if (message.guild.members.me.voice?.connection) {
                message.guild.members.me.voice.disconnect().catch(() => {});
            }

            message.react('👋').catch(() => {});
            return message.reply("👋 Left the voice channel.");
        } catch (error) {
            console.error(`[${client.user.tag}] Error leaving voice:`, error);
            return message.reply("Couldn't leave properly... something went wrong.");
        }
    }
};
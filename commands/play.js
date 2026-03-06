const { delay, randomRange } = require('../utils');
const config = require('../config');

module.exports = {
    name: 'play',
    async execute(client, message, args) {
        if (!message.member.voice.channelId) return message.channel.send("Join a voice channel first!");
        const search = args.join(' ');
        if (!search) return message.channel.send("Usage: !play <song>");

        
        await delay(randomRange(config.jitterDelay.min, config.jitterDelay.max));

        
        const player = await client.kazagumo.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: message.member.voice.channelId,
            shardId: message.guild.shardId,
            deaf: true,
            loadBalancer: true
        });

        
        let result;
        try {
            result = await player.search(search, { requester: message.author });
        } catch (e) {
            console.log(`[${client.user.tag}] Search Failed: ${e.message}`);
            return message.channel.send("Search failed.");
        }

        if (!result.tracks.length) return message.channel.send("No results found.");

        
        if (result.type === "PLAYLIST") {
            for (let track of result.tracks) player.queue.add(track);
            message.channel.send(`Added **${result.tracks.length}** tracks from playlist **${result.playlistName}**`);
        } else {
            const track = result.tracks[0];
            player.queue.add(track);
            message.channel.send(`Added to queue: **${track.title}**`);
        }

        
        if (!player.playing && !player.paused) player.play();
    }
};
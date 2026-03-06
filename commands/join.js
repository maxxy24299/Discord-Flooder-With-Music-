module.exports = {
    name: 'join',
    async execute(client, message, args) {
        if (!message.member.voice.channelId) return message.channel.send("Join a voice channel first!");

        await client.kazagumo.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: message.member.voice.channelId,
            shardId: message.guild.shardId,
            deaf: true,
            loadBalancer: true
        });

        message.channel.send(`Joined <#${message.member.voice.channelId}>`);
    }
};
module.exports = {
    name: 'volume',
    async execute(client, message, args) {
        const player = client.kazagumo.players.get(message.guild.id);
        if (!player) return message.channel.send("No music playing.");

        const vol = parseInt(args[0]);
        if (isNaN(vol)) return message.channel.send("Usage: !volume <number>");

        player.setVolume(vol);
        message.channel.send(`Volume set to **${vol}%**`);
    }
};
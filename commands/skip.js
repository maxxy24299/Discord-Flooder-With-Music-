module.exports = {
    name: 'skip',
    async execute(client, message, args) {
        const player = client.kazagumo.players.get(message.guild.id);
        if (!player) return;
        player.skip();
        message.channel.send("Skipped.");
    }
};
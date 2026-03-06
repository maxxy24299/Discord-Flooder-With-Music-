module.exports = {
    name: 'stop',
    async execute(client, message, args) {
        const player = client.kazagumo.players.get(message.guild.id);
        if (!player) return;
        player.destroy();
        message.channel.send("Disconnected.");
    }
};
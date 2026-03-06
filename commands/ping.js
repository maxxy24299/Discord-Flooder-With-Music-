// MADE BY ϻᴀχ </>

module.exports = {
    name: 'ping',
    aliases: ['latency', 'ms', 'pong'],
    description: 'Check the bot\'s ping/latency',

    async execute(client, message, args) {
        
        const sent = await message.reply('Pinging...');

        
        const wsPing = Math.round(client.ws.ping);                    
        const roundTrip = sent.createdTimestamp - message.createdTimestamp; 
        const uptime = formatUptime(client.uptime);                   

        
        await sent.edit({
            content: null,
            embeds: [{
                color: 0x00ff00, 
                title: '🏓 Pong!',
                fields: [
                    {
                        name: 'WebSocket Ping',
                        value: `${wsPing} ms`,
                        inline: true
                    },
                    {
                        name: 'API Latency',
                        value: `${roundTrip} ms`,
                        inline: true
                    },
                    {
                        name: 'Uptime',
                        value: uptime,
                        inline: false
                    }
                ],
                footer: {
                    text: `Requested by ${message.author.tag}`
                },
                timestamp: new Date()
            }]
        });
    }
};

/**
 * 
 * @param {number} ms 
 * @returns {string}
 */
function formatUptime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours   = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days    = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days)    parts.push(`${days}d`);
    if (hours)   parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
}
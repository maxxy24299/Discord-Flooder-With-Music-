const fs = require('fs');
const BotClient = require('./BotClient');
const config = require('./config');
const { delay, randomRange } = require('./utils');
// MADE BY ϻᴀχ </>
async function main() {
    try {
        console.log("Starting up music bot swarm...");
        const tokenData = fs.readFileSync('tokens.txt', 'utf-8');
        const tokens = tokenData.split('\n').map(t => t.trim()).filter(t => t.length > 5);

        console.log(`Loaded ${tokens.length} tokens.`);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            
            const waitTime = randomRange(config.staggerDelay.min, config.staggerDelay.max);
            if (i > 0) {
                console.log(`Waiting ${(waitTime / 1000).toFixed(1)}s before starting Bot #${i + 1}...`);
                await delay(waitTime);
            }

            
             // MADE BY ϻᴀχ </>
            
            const bot = new BotClient(token, i, config.nodes);
            bot.start();
        }

    } catch (e) {
        console.error("Critical Startup Error:", e);
    }
}

main();
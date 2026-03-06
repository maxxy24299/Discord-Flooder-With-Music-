// MADE BY ϻᴀχ </>

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */ // MADE BY ϻᴀχ </>
function randomJitter(min = 80, max = 450) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * MADE BY ϻᴀχ </>
 * @param {Array} items 
 * @param {Function} action 
 * @param {Object} [options]
 * @param {number} [options.minDelay=150] ms
 * @param {number} [options.maxDelay=800] ms
 * @param {boolean} [options.log=true]
 */
async function staggeredForEach(items, action, options = {}) {
    const {
        minDelay = 150,
        maxDelay = 800,
        log = true
    } = options;

    for (let i = 0; i < items.length; i++) {
        try {
            await action(items[i], i);

            if (log) {
                console.log(`[${i + 1}/${items.length}] Action done`);
            }
        } catch (err) {
            console.error(`Error on item ${i + 1}:`, err.message || err);
        }

        // MADE BY ϻᴀχ </>
        if (i < items.length - 1) {
            const wait = randomJitter(minDelay, maxDelay);
            if (log) console.log(`  → waiting ${wait} ms`);
            await new Promise(r => setTimeout(r, wait));
        }
    }
}

/**  MADE BY ϻᴀχ </>
 
 */
class SimpleRateLimiter {
    constructor() {
        this.lastAction = new Map(); 
    }

    /**         MADE BY ϻᴀχ </>
     
     * @param {string} key - 
     * @param {number} minGapMs - 
     */
    async wait(key, minGapMs = 1200) {
        const now = Date.now();
        const last = this.lastAction.get(key) || 0;
        const elapsed = now - last;

        if (elapsed < minGapMs) {
            const toWait = minGapMs - elapsed;
            console.log(`Rate-limit guard → waiting ${toWait} ms for ${key}`);
            await new Promise(r => setTimeout(r, toWait));
        }

        this.lastAction.set(key, Date.now());
    }

    reset(key = null) {
        if (key) {
            this.lastAction.delete(key);
        } else {
            this.lastAction.clear();
        }
    }
}

//  MADE BY ϻᴀχ </>
const globalLimiter = new SimpleRateLimiter();

module.exports = {
    randomJitter,
    staggeredForEach,
    SimpleRateLimiter,
    globalLimiter
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const randomRange = (min, max) => Math.random() * (max - min) + min;

module.exports = { delay, randomRange };
import chalk from 'chalk';

export default class TokenBucket {
  constructor(capacity, refillAmount, refillTime) {
    this.capacity = capacity;
    this.refillTime = refillTime; // amount of time between refills (in sec)
    this.refillAmount = refillAmount; // number of tokens to add per refill cycle
    this.db = {};
  }

  refillBucket(key) {
    if (this.db[key] === undefined) return null;

    const { tokens, ts } = this.db[key];
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - ts) / (this.refillTime * 1000)); // convert to seconds

    if (elapsedTime > 0) {
      // Calculate how many tokens to add based on elapsed time
      const newTokens = elapsedTime * this.refillAmount;

      // Update the bucket tokens, ensuring we don't exceed the capacity
      this.db[key] = {
        tokens: Math.min(this.capacity, tokens + newTokens),
        ts: currentTime,
      };
    }

    return this.db[key];
  }

  createBucket(key) {
    if (this.db[key] === undefined) {
      this.db[key] = {
        tokens: this.capacity, // start with full tokens
        ts: Date.now(),
      };
    }
    return this.db[key];
  }

  handleRequest(key) {
    let bucket = this.createBucket(key);
    const currentTime = Date.now();

    // Calculate the elapsed time since the last refill
    const elapsedTime = Math.floor((currentTime - bucket.ts) / 1000);

    // Refill the bucket if necessary
    if (elapsedTime >= this.refillTime) {
      bucket = this.refillBucket(key);
    }

    // Check if the bucket has tokens available
    if (bucket.tokens <= 0) {
      console.log(
        chalk.red(
          `Request[REJECTED] for ${key} (tokens: ${bucket.tokens}) -- ${new Date().toLocaleTimeString()}`
        )
      );
      return false;
    }

    // Log successful request and reduce tokens
    console.log(
      chalk.green(
        `Request[ACCEPTED] for ${key} (tokens: ${bucket.tokens}) -- ${new Date().toLocaleTimeString()}`
      )
    );
    bucket.tokens -= 1;
    return true;
  }
}

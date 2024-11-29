import TokenBucket from './TokenBucket.js';

// capacity, refillAmount, refillTime (sec)
// token bucket with 2 token every 1 min
// const bucket = new TokenBucket(4, 2, 60);

// token bucket with capacity 4 and ading 4 tokens every 5 sec
// const bucket = new TokenBucket(4, 4, 5);

// token bucket with capacity 4 and ading 4 tokens every 2 sec
const bucket = new TokenBucket(4, 4, 2);

bucket.handleRequest('user1');
bucket.handleRequest('user1');
bucket.handleRequest('user1');
bucket.handleRequest('user1');
bucket.handleRequest('user1');

setTimeout(() => {
  bucket.handleRequest('user1');
  bucket.handleRequest('user1');
  bucket.handleRequest('user1');
  bucket.handleRequest('user1');
  bucket.handleRequest('user1');
  bucket.handleRequest('user1');

  setTimeout(() => {
    bucket.handleRequest('user1');
  }, 3000);
}, 3000);
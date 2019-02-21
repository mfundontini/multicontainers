// Import required modules
const redis = require('redis');
const credentials = require('./credentilas.js');

// Set up redis client
const redisClient = redis.createClient(
    {
        host: credentials.REDIS_HOST,
        port: credentials.REDIS_PORT,
        retry_strategy: () => 1000
    }
);


// Set up redis client subscriber
const redisClientSubscriber = redisClient.duplicate()


// Set up task
function fibonacci(index) {
    if(index < 2) return 1
    return fibonacci(index - 1) + fibonacci(index - 2);
}


// Set up task trigger, redisClient insert in this case
redisClientSubscriber.on("message", (channel, message) => {
    redisClient.hset("values", message, fibonacci(parseInt(message)));
});

// Set up subscription
redisClientSubscriber.subscribe("insert");


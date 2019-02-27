const express = require('express');
const credentials = require('./consts.js');
const redis = require('redis');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// Set up express app to recieve/send HTTP connections
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create redis client
const redisClient = redis.createClient(
    {
        host: credentials.REDIS_HOST,
        port: credentials.REDIS_PORT,
        retry_strategy: () => 1000
    }
);

// Redis publisher that will send signal when something happens i.e an INSERT message
const redisPublisher = redisClient.duplicate( )

// Set up postgres client
const postgresClient = new Pool(
    {
        host: credentials.PG_HOST,
        user: credentials.PG_USER,
        port: credentials.PG_PORT,
        password: credentials.PG_PASSWORD,
        database: credentials.PG_DATABASE

    }
);

// Catch postgres connection errors
postgresClient.on('error', () => { console.log('Lost connection to PG client')});

// To use postgres on express we need to create a table in the DB
postgresClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((error) => console.log(error)); 

app.get('/', (request, response) => {
    response.send("Hey there world, Hello world too cliche.")
});

// Indices are stored in Postgres
app.get('/values/indices', async(request, response) => {
    let indices = await postgresClient.query("SELECT * FROM values");
    response.send(indices.rows);
});

// The full subset of hashvalues
app.get('/values/all', async(request, response) => {
    redisClient.hgetall('values', (error, values) => {
        response.send(values);
    });
});

// Posts to the server, creating the indices and answers
app.post('/values/set', async(request, response) => {
    let index = parseInt(request.body.index);

    if(index > 40) {
        response.status(422).send("Index too high")
    }
    else {
        redisClient.hset('values', index, 'Received value');
        redisPublisher.publish('insert', index);
        postgresClient.query("INSERT INTO values (number) VALUES ($1)", [index]);
        response.status(200).send({working: true});
    }
});

app.listen(5000, error => console.log("Listening on port 5000"));


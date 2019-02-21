const express = require('express');
const credentials = require('./consts.js');
const redis = require('redis');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// Set up app
const app = express();
app.use(bodyParser.json());
app.use(cors());

const redisClient = redis.createClient(
    {
        host: credentials.REDIS_HOST,
        port: REDIS_PORT,
        retry_strategy: () => 1000
    }
);

const postgresClient = new Pool(
    {
        host: credentials.PG_HOST,
        user: credentials.PG_USER,
        port: credentials.PG_PORT,
        password: credentials.PG_PASSWORD,
        database: credentials.PG_DATABASE

    }
)


const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default; // Import default export
const redis = require('redis');

const app = express();
const port = 8080;

// Create a Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

// Configure session to use Redis
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'akshita',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // Session expiry (1 hour)
    }
}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes and other middleware here

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require ('massive')
const {CONNECTION_STRING, SESSION_SECRET, SERVER_PORT} = process.env
const authController = require('./controllers/authController')
const treasureController = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware');


const app = express();

app.use(express.json())

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db is connected')
})

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}));

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/logout', authController.logout);

app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureController.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureController.getAllTreasure);



app.listen(SERVER_PORT, () => console.log(`server is listening on port ${SERVER_PORT}`));
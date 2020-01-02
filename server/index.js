const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const keys = require('./config/keys');

const app = express();

require('./models/user.js');    // schema
require('./models/resource.js');    // schema
require('./services/passport.js');  // passport

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: '500mb'
}));
app.use(session({
    secret: "verysecretsecret"
}))
app.use(passport.initialize())
app.use(passport.session());    // persistent login session


app.use(cors());
app.use(require('./routes'))


mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    keepAlive: 1,
    reconnectTries: 30,
    useUnifiedTopology: true
}).then(() => {
    console.log("successfully connected to mongo")
}).catch((err) => {
    console.error("error connecting to mongo");
    console.error(err);
})


const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'dev'

if (environment === "dev"){
    console.log("\x1b[31m", "ENVIRONMENT IS DEV - ENSURE THAT THIS IS NOT SHOWING WHEN DEPLOYED", "\x1b[0m");
} else if (environment === "production") {
    console.log("\x1b[34m", "RUNNING IN PRODUCTION", "\x1b[0m");
    app.use(express.static('../client/dist'));    // make sure express serves production assets
    // make sure express serves index.html if it doesn't know the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
    });
}

app.listen(PORT);
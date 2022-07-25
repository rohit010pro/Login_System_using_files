const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// set static files location
app.use('/static', express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

// load routers
app.use('/', require('./router'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

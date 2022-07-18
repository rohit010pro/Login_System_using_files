const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// set static files location
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: "Home", user: req.session.user });
});

// Login route
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login', { title: "Login" });
});

// Get user information
function getUserInfo(email, password) {
    return new Promise((resolve, reject) => {
        fs.readFile('./users.json', (err, data) => {
            if (err) reject(err);

            let userDetails = null;
            const users = JSON.parse(data);
            users.forEach(user => {
                if (email == user.email && password == user.password) {
                    userDetails = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    };
                    resolve(userDetails);
                }
            });
            reject("No Data found");
        });
    });
}

// Get all users information
function getUserAll(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);

            reject("No Data found");
        });
    });
}

// POST Login route
app.post('/login', (req, res) => {
    // console.log(req.body.email + " " + req.body.password);

    getUserInfo(req.body.email, req.body.password)
        .then(userDetails => {
            console.log(userDetails);
            req.session.userId = userDetails.id;
            req.session.userName = userDetails.name;
            req.session.userEmail = userDetails.email;
            res.redirect('/dashboard');
        })
        .catch(err => {
            // console.log("Error: " + err);
            res.end("Error: " + err);
        })
});

// Register route
app.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
        return;
    }
    res.render('register', { title: "Register" });
});

// Add Users
function addUsers(users) {
    return new Promise((resolve, rejects) => {
        fs.writeFile('./users.json', err => {
            if (err) rejects(err);
            resolve(1);
        });
    });
}

// POST Register route
app.post('/register', (req, res) => {
    const file = './users.json';
    getUserAll(file)
        .then(data => {
            const users = JSON.parse(data);
            const newUser = {
                _id: users.length + 1,
                name: req.body.fullName,
                email: req.body.email,
                password: req.body.password
            }
            const updatedUsers = JSON.stringify([...users, newUser]);
            addUsers(updatedUsers)
                .then(status => { })
                .catch(err => console.log(errr))
        })
        .catch(err => { console.log(err); })
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.user)
        res.render('dashboard', { title: "Dashboard", user: req.session.user });
    else
        res.redirect('/login');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.redirect('/');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

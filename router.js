const express = require('express');
const route = express.Router();
const users = require('./function');

// Home route
route.get('/', (req, res) => {
    res.render('index', { title: "Home", user: req.session.user });
});

// Login route
route.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login', { title: "Login" });
});

// POST Login route
route.post('/login', (req, res) => {
    // console.log(req.body.email + " " + req.body.password);
    
    users.getUserInfo(req.body.email, req.body.password)
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
route.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
        return;
    }
    res.render('register', { title: "Register" });
});

// POST Register route
route.post('/register', (req, res) => {
    const file = './users.json';
    users.getUserAll(file)
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
route.get('/dashboard', (req, res) => {
    if (req.session.user)
        res.render('dashboard', { title: "Dashboard", user: req.session.user });
    else
        res.redirect('/login');
});

// Logout route
route.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.redirect('/');
        }
    });
});


module.exports = route;
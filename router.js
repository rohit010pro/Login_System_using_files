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
    users.getUserInfo(req.body.email, req.body.password)
        .then(userDetails => {
            const user = {
                userId: userDetails.id,
                userName: userDetails.name,
                userEmail: userDetails.email
            }
            req.session.user = user;
            res.redirect('/dashboard');
        })
        .catch(err => {
            res.end(err);
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
            let updatedData;
            // if no users found
            if (data.trim() === "") {
                const newUser = {
                    _id: 1,
                    name: req.body.fullName,
                    email: req.body.email,
                    password: req.body.password
                }
                updatedData = JSON.stringify([newUser], null, 4);
            }
            // if one of more users found
            else {
                const allUsers = JSON.parse(data);
                const newUser = {
                    _id: allUsers.length + 1,
                    name: req.body.fullName,
                    email: req.body.email,
                    password: req.body.password
                }
                updatedData = JSON.stringify([...allUsers, newUser], null, 4);
            }

            users.updateUsers(updatedData)
                .then(status => {
                    if (status == 1)
                        res.redirect('/login');
                })
                .catch(err => console.log(err));
        })
        .catch(err => { console.log(err); });
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
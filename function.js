const fs = require('fs');

// Get user information
exports.getUserInfo = (email, password) => {
    return new Promise((resolve, reject) => {
        fs.readFile('./users.json', 'utf8', (err, data) => {
            if (err) reject(err);

            // console.log(data , typeof data);
            if (data.trim() === "")
                reject("Email not registered");
            else {
                let userDetails = null;
                const users = JSON.parse(data);
                let isEmailFound = false;

                users.forEach(user => {
                    if (email == user.email && password == user.password) {
                        userDetails = {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        };
                        resolve(userDetails);
                    }
                    if (email == user.email) {
                        isEmailFound = true;
                        return;
                    }
                });
                if (!isEmailFound)
                    reject("Email not registered");
                else
                    reject("Incorrect Passoword");
            }
        });
    });
}

// Get all users information
exports.getUserAll = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

// Add Users
exports.updateUsers = (users) => {
    return new Promise((resolve, rejects) => {
        fs.writeFile('./users.json', users, err => {
            if (err) rejects(err);
            resolve(1);
        });
    });
}
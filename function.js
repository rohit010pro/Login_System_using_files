const fs = require('fs');

// Get user information
exports.getUserInfo = (email, password) => {
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
exports.getUserAll = (file) => {
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

// Add Users
exports.updateUsers = (users) => {
    return new Promise((resolve, rejects) => {
        fs.writeFile('./users.json',users, err => {
            if (err) rejects(err);
            resolve(1);
        });
    });
}

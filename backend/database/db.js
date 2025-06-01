const mongoose = require('mongoose');

const mongodb = () => {
    mongoose.connect(process.env.databaseurl)
        .then(() => { console.log("Connection Successfully!") })
        .catch((err) =>{console.log("Not Connected")})
}

module.exports = mongodb;
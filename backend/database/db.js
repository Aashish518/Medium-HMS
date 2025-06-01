const mongoose = require('mongoose');

const mongodb = () => {
    mongoose.connect(process.env.databaseurl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => { console.log("Connection Successfully!") })
        .catch((err) =>{console.log("Not Connected")})
}

module.exports = mongodb;
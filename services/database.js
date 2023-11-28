const mongoose = require("mongoose");
const keys = require("../config/keys");
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const db = mongoose.createConnection(keys.mongoDbUri, dbOptions);

db.once('open', () => console.log('Mongodb connection established successfully!'));
db.on('error', (err) => console.error('Some error has occurred while trying to connect: ', err));

module.exports = { db };

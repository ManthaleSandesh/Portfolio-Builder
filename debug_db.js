const mongoose = require('mongoose');

const uri = 'mongodb+srv://sandesh:sandesh789@fwd.7nqhsee.mongodb.net/?appName=FWD';

console.log("Attempting to connect to MongoDB...");

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: MongoDB Connected!");
        process.exit(0);
    })
    .catch(err => {
        console.log("FAILURE: Connection breakdown:");
        console.log("Name:", err.name);
        console.log("Message:", err.message);
        console.log("Code:", err.code);
        console.log("CodeName:", err.codeName);
        process.exit(1);
    });

const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB 연결됨: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB 연결 실패:", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;
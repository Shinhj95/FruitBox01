const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결됨"))
    .catch(err => console.log("MongoDB 연결 실패:", err));

// user jwt
app.use((req, res, next) => {

    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }

    next();
});

// routes
app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

// main
app.get("/", (req, res) => {
    res.render("index");
});

// fruits
const Fruit = require("./models/Fruit");

app.get("/fruits", async (req, res) => {
    try {
        const fruits = await Fruit.find();
        res.render("fruits", { fruits });
    } catch (err) {
        console.log(err);
        res.status(500).send("서버 오류");
    }
});

// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
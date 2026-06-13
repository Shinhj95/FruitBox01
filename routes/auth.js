const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 로그인 페이지
router.get("/login", (req, res) => {
    res.render("login", { error: null, success: req.query.success === "1"});
});

// 회원가입 페이지
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// 회원가입 처리
router.post("/register", async (req, res) => {

    const { username, password, passwordConfirm } = req.body;

    if (!username?.trim()) {
        return res.render("register", { error: "아이디를 입력하세요" });
    }

    if (!password) {
        return res.render("register", { error: "비밀번호를 입력하세요" });
    }

    if (password !== passwordConfirm) {
        return res.render("register", { error: "비밀번호가 일치하지 않습니다" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
        return res.render("register", { error: "이미 존재하는 아이디입니다" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
        username: username.trim(),
        password: hash
    });

    res.redirect("/auth/login?success=1");
});

// 로그인 처리
router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("login", { error: "아이디/비밀번호를 입력하세요" });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.render("login", { error: "계정이 존재하지 않습니다" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.render("login", { error: "비밀번호가 틀렸습니다" });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    });

    res.redirect("/admin");
});

// 로그아웃
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});


module.exports = router;

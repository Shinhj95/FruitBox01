const router = require("express").Router();
const Fruit = require("../models/Fruit");
const auth = require("../middlewares/auth");

router.use(auth);

// 목록
router.get("/", async (req, res) => {
    const fruits = await Fruit.find();

    res.render("admin", {
        fruits,
        error: null
    });
});


// 추가
router.post("/add", async (req, res) => {

    const { image, name, price, description } = req.body;

    if (!image) {
        const fruits = await Fruit.find();
        return res.render("admin", {
            fruits,
            error: "카테고리를 선택하세요!"
        });
    }

    if (!name?.trim()) {
        const fruits = await Fruit.find();
        return res.render("admin", {
            fruits,
            error: "이름을 입력하세요!"
        });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice)) {
        const fruits = await Fruit.find();
        return res.render("admin", {
            fruits,
            error: "가격은 숫자여야 합니다!"
        });
    }

    if (!description?.trim()) {
        const fruits = await Fruit.find();
        return res.render("admin", {
            fruits,
            error: "설명을 입력하세요!"
        });
    }

    await Fruit.create({
        image,
        name: name.trim(),
        price: numPrice,
        description: description.trim()
    });

    res.redirect("/admin");
});


// 삭제
router.post("/delete/:id", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

module.exports = router;
const express = require("express");
const router = express.Router();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const path = require("path");
const bcrypt = require("bcrypt");

const User = require("../models/user");  // need two dots cause it's within routes subfolder

router.use(cors());
router.use(express.urlencoded({ extended: true }));
let csrfProtection = csrf({cookie: true});
router.use(cookieParser());
router.use(express.static(path.join(__dirname, "public")));


router.get("/", csrfProtection, (req, res) => {
    res.render("login", {csrfToken: req.csrfToken()});
});

router.post("/", csrfProtection, async (req, res) => {
    console.log(req.body.loginEmail);
    let existingUser = await User.findOne({email: req.body.loginEmail});
    let doesUserExist = true;
    let isCorrectPassword = false;
    try {
        if(existingUser) {
            const passwordsCompared = await bcrypt.compare(req.body.loginPassword, existingUser.password);
            if(passwordsCompared) {
                isCorrectPassword = true;
            }
        } else {
            doesUserExist = false;   
        } 
        res.json({doesUserExist: doesUserExist, isCorrectPassword: isCorrectPassword});
    } catch(error) {
        console.error("Error during login:", error);
        return res.status(500).send("An error occurred, please try again.");
    }    
})

module.exports = router;

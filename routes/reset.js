const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const path = require("path");
const nodemailer = require("nodemailer");
let session = require("express-session");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");
router.use(cors());
router.use(express.urlencoded({ extended: true }));
let csrfProtection = csrf({cookie: true});
router.use(cookieParser());
router.use(express.static(path.join(__dirname, "public")));
router.get("/", csrfProtection, (req, res) => {
    res.render('reset', {csrfToken: req.csrfToken()});
})

const sendEmail = async function(emailRecipient, token) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

        const resetLink = `https://localhost:5000/reset/createPassword/${token}`
        const info = await transporter.sendMail({
            from: "Ben Kupersmit <benkupersmit@gmail.com>",
            to: `${emailRecipient}`,
            subject: "Reset Password",
            text: `Click this link to change your password: ${resetLink}`, 
            html: `<p>Click this link to change your password:</p><a href="${resetLink}">${resetLink}</a>` 
        })
        console.log("sent");
    }


router.post("/", csrfProtection, async (req, res) => {
    console.log(req.body);
    try {
        let doesUserExist = true;
        let existingUser = await User.findOne({email: req.body.resetFromEmail}); 
        if(!existingUser) {
            doesUserExist = false;
        } else {
            console.log("User found");
            emailRecipient = req.body.resetFromEmail;
            token = crypto.randomBytes(20).toString('hex');
            await sendEmail(emailRecipient, token);
            let DateOfExpiration = Date.now() + 3600000; //hour
            existingUser.resetPasswordToken = token;
            existingUser.resetPasswordExpire = DateOfExpiration;
            await existingUser.save();
            console.log("user modified");
        }
        res.json({doesUserExist: doesUserExist});
    } catch(error) {
        console.log(error);
        res.send("Error sending email, please try again.");
    }

    //text 
    
})

router.get("/createPassword/:token", csrfProtection, async (req, res) => {
    let token = req.params.token;
    req.session.registerToken = token;
    try {
        let existingUser = await User.findOne({resetPasswordToken: token});
        if(!existingUser) {
            console.log("not found");
        }
        if(existingUser.resetPasswordExpire > Date.now()) {
            res.render('createp', {csrfToken: req.csrfToken()});
        } else {
            res.status(400).send("Time expired or invalid token");
        }
    } catch(error) {
        console.log(error, "error");
    }
})

function validatePassword(p) {
    return /^(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(p);
}


router.post("/createPassword", csrfProtection, async (req, res) => {
    let isValidPassword = true;
    let isMatchingPassword = true;
    try {
      console.log("reset password token is:", req.session.registerToken);
      if (!req.session.registerToken) {
        return res.status(400).send("Session expired. Please restart the reset process.");
      }
      if (req.body.enterPassword !== req.body.reenterPassword) {
        isMatchingPassword = false;
      }
      if (!validatePassword(req.body.enterPassword)) {
        isValidPassword = false;
      }
      if (!isMatchingPassword || !isValidPassword) {
        return res.json({ isMatchingPassword, isValidPassword });
      }
      const foundUser = await User.findOne({ resetPasswordToken: req.session.registerToken });
      if (!foundUser || foundUser.resetPasswordExpire < Date.now()) {
        return res.status(400).send("Token expired or invalid.");
      }
      const hashPassword = await bcrypt.hash(req.body.enterPassword, 10);
      foundUser.password = hashPassword;
      await foundUser.save();
      req.session.destroy();
      res.redirect("https://localhost:5000/login");
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send("An error occurred, please try again.");
    }
  });
  

module.exports = router;
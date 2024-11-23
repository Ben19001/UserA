//main landing page for register

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const path = require("path");
const https = require("https");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const fs = require("fs");
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const loginRoute = require("./routes/login");
const resetPasswordRoute = require("./routes/reset");
const User = require("./models/user");
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json());
let csrfProtection = csrf({cookie: true});
app.use(cookieParser());

const options = https.createServer({
    key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH)),
    cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH)) 
});


mongoose.connect(process.env.MONGO_URI);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
     maxAge: 1000*60*60,
    }
 }));
 app.use("/login", loginRoute);
app.use("/reset", resetPasswordRoute);
app.use(express.static(path.join(__dirname, "public")));


  
//const addedUser = mongoose.model('user', newUser);
app.get("/register", csrfProtection, (req, res) => {
    //const csrfToken = generateToken(req, res);
    console.log('CSRF token:', req.csrfToken());
    res.render("register", {csrfToken: req.csrfToken()});
})

function validatePassword(p) {
    return /^(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(p);
}

app.post("/register", csrfProtection, async (req, res) => {    
    let isValidPassword = true;
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        let isAdded = false;
        if (existingUser) {
            console.log("User already added"); //return account already exists
            isAdded = true;
            res.json({ isAdded: isAdded, isValidPassword: isValidPassword });
        } else if (!validatePassword(req.body.Password)) {
            isValidPassword = false; //returns not a valid password
            res.json({ isAdded: isAdded, isValidPassword: isValidPassword  });
        } else {
            req.session.userData = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                username: req.body.Username,
                password: await bcrypt.hash(req.body.Password, 10)
         };
            req.session.registerToken = crypto.randomBytes(20).toString('hex'); // Store token in session
            await sendToConfirmAccount(req.body.email, req.session.registerToken);
            res.json({ isAdded: isAdded, isValidPassword: isValidPassword }); //success
        }

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).send("An error occurred, please try again.");
    }
});

  
app.get("/register/:registerToken", async (req, res) => {
    console.log("Session userData:", req.session.userData); // req.session.registerToken always holds true until destroyed
    if (req.params.registerToken === req.session.registerToken && req.session.userData) {
        const newUserInstance = new User(req.session.userData);
        await newUserInstance.save();
        console.log("User successfully registered");
        res.redirect("/login");
        //res.render("login");
        //res.send("User registration confirmed.");
    } else {
        res.send("Invalid or expired token.");
    }
});




async function helper(transporter, email, registerToken) {
    const resetLink = `https://localhost:5000/register/${registerToken}`; // This should match the one in the GET route
    const info = await transporter.sendMail({
        from: "Ben Kupersmit <benkupersmit@gmail.com>",
        to: email,
        subject: "Confirm Account",
        text: `Click this link to confirm your account: ${resetLink}`, 
        html: `<p>Click this link to confirm your account:</p><a href="${resetLink}">${resetLink}</a>` 
    });
    console.log("Email sent:", info.messageId);
}


async function sendToConfirmAccount(email, registerToken) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    //const registerToken = req.session.registerToken;

    try {
        await helper(transporter, email, registerToken);
        dateBeforeReset = Date.now() + 3600000;
        return true;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

const sslServer = https.createServer(options, app);
sslServer.listen(5000, () => {
    console.log("Server listening");
})





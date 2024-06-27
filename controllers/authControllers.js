const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        const { fullname, password, email } = req.body;

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect("/")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed password during registration:", hashedPassword);

        const newUser = await userModel.create({
            fullname,
            password: hashedPassword,
            email,
        });

        const token = generateToken(newUser);
        res.cookie("token", token);
        req.flash("error", "User account created successfully, please login.");
        return res.redirect("/")
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send(err.message);
        req.flash("error", "You already have an account, please login.");
        return res.redirect("/")
    }
};

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash("error", "Email or Password incorrect.")
        return res.redirect("/");
    }
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            req.flash("success", "You are successfully login")
            res.redirect("/shop");
        } else {
            req.flash("error", "Email or Password incorrect.")
            return res.redirect("/");
        }
    });
};


module.exports.logoutUser = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
}


//registerUser review code
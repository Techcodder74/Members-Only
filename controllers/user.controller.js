import db from "../db/queries.js";
import asyncHandler from "../utils/asyncHandler.js";
import passport from "passport";


const getSignup = asyncHandler(async (req, res) => {
    res.render("signup");
})


const postSignup = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const user = await db.createUser(name, username, password);

        res.redirect("/");

    }

    catch (err) {
        res.render('signup', {err : err.message});
    }

})


const getlogin = asyncHandler(async (req, res) => {
    return res.render("login", { message: req.query.message });
})


const postlogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render("login", { message: info?.message || "Invalid credentials" });

        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
};


const getjoinClub = asyncHandler(async (req, res) => {
    return res.render("joinClub");
})

const postjoinClub = asyncHandler(async (req, res) => {
    const { passcode } = req.body;
    const user = req.user;
    try {
        
        if (!user) throw new Error("User not found");
        let us = await db.giveMembership(user.id, passcode);
        return res.redirect("/");
    }
    catch (err) {
        return res.render("joinClub", {message: err.message || "Some error occured"});
    }
})

const logout = async (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/");
    });
}

const Uc = { getSignup, postSignup, getlogin, postlogin, logout, getjoinClub, postjoinClub };


export default Uc;
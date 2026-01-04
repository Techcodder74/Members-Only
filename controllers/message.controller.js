import db from "../db/queries.js";
import asyncHandler from "../utils/asyncHandler.js";


const getMessages = asyncHandler(async (req, res) => {
    const isMember = req.isAuthenticated() && req.user.is_member;

    let messages;
    if (isMember) {
        messages = await db.getAllMessages();

    }
    else {
        messages = await db.nonMemeberMsgs();
    }
    return res.render('home', { isMember, messages, user: req.user });



})

const getCreatePage = (req, res) => {
    return res.render("createMsg");
}



const createNewMessage = asyncHandler(async (req, res) => {
    const create = await db.createMessage(req.body.title, req.body.content, req.user.id);
    return res.redirect("/");
});




const msgCont = { getMessages, getCreatePage, createNewMessage };


export default msgCont;

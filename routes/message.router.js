import { Router } from "express";
import msgCont from "../controllers/message.controller.js";
import authenticate from "../middleware/authenticated.middleware.js";
const router = Router();


router.get("/getMessages", msgCont.getMessages);
router.get("/", msgCont.getMessages)
router.route("/newMessage")
       .get(msgCont.getCreatePage)
       .post(authenticate, msgCont.createNewMessage);

// router.get("/deleteMsg")

export default router;

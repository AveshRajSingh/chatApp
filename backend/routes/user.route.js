import express from "express";

import { Router } from "express";
import { checkAuth, createUser, loginUser, logoutUser } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controller/message.controlle.js";

const router = Router();


router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/logout", verifyUser, logoutUser);
router.get("/check-auth", verifyUser, checkAuth);


router.get("/getUsersForSidebar", verifyUser, getUsersForSidebar);
router.get("/getMessages/:id", verifyUser, getMessages);
router.post("/sendMessage/:id", verifyUser, sendMessage);

export default router;

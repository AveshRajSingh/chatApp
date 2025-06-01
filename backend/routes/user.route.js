import express from "express";

import { Router } from "express";
import { createUser, loginUser } from "../controller/user.controller.js";

const router = Router();


router.post("/create",createUser);
router.post("/login",loginUser);

export default router;

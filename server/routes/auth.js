import express from "express";
import { login } from "../controllers/auth.js";
import getUser from "../middlewares/getUser.js";

const router = express.Router();

router.get("/me", getUser);
router.post("/login", login);

export default router;

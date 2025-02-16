import express from "express";
const router=express.Router()
import { getallevents, saveemail } from "../controller/getallevents.js";
import { recommendEvent } from "../controller/recommendationController.js";

router.get("/event",getallevents);
router.post("/email/:eventid",saveemail)
// API route for LLM-based event recommendation
router.post("/recommend-event", recommendEvent);

export default router
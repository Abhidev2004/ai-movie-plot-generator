import { Router } from "express";
import { analyzeIdea, generatePlot } from "../controllers/plotController.js";

const router = Router();

router.post("/analyze-idea", analyzeIdea);
router.post("/generate-plot", generatePlot);

export default router;

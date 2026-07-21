from fastapi import APIRouter

from controllers.plot_controller import analyze_idea, generate_plot


router = APIRouter()


router.post("/analyze-idea")(analyze_idea)
router.post("/generate-plot")(generate_plot)

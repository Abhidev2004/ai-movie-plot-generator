import express from "express";
import cors from "cors";
import "dotenv/config";
import plotRoutes from "./routes/plotRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
	cors({
		origin: process.env.FRONTEND_ORIGIN,
	})
);
app.use(express.json());

app.get("/health", (req, res) => {
	return res.json({ status: "ok" });
});

app.use("/api", plotRoutes);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

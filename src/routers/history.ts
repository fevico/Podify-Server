import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { UpdateHistorySchema } from "#/utiles/validationSchema";
import { Router } from "express";
import { getHistories, getRecentlyPlayed, removeHistory, updateHistory } from "#/controller/history";

const router = Router()

router.post("/", mustAuth, validate(UpdateHistorySchema), updateHistory)
router.delete("/", mustAuth, removeHistory)
router.get("/", mustAuth, getHistories)
router.get("/recently-played", mustAuth, getRecentlyPlayed) 

export default router 
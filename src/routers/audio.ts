import { createaudio, getLastesUploads, updateAdio } from "#/controller/audio";
import { isVerified, mustAuth } from "#/middleware/auth";
import fileParser from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import { AudioValidationSchema } from "#/utiles/validationSchema";
import { Router } from "express";

const router = Router()

router.post("/create", mustAuth, isVerified, fileParser, validate(AudioValidationSchema), createaudio) 
router.patch("/:audioId", mustAuth, isVerified, fileParser, validate(AudioValidationSchema), updateAdio) 
router.get("/latest", getLastesUploads) 

export default router
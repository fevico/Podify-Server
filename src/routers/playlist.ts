import { UpdatePlaylist, createPlaylist, getAudios, getPlaylistByProfile, removePlaylist } from "#/controller/playlist";
import { isVerified, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { NewPlaylistValidationSchema, OldPlaylistValidationSchema } from "#/utiles/validationSchema";
import { Router } from "express";

const router = Router()

router.post("/create", mustAuth, isVerified, validate(NewPlaylistValidationSchema), createPlaylist);
router.patch("/", mustAuth, validate(OldPlaylistValidationSchema), UpdatePlaylist);
router.delete("/", mustAuth, removePlaylist);
router.get("/by-profile", mustAuth, getPlaylistByProfile);
router.get("/:playlistId", mustAuth, getAudios); 

export default router 
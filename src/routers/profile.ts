import { getAutoGeneratedPlaylist, getRecommendByProfile, getFollowerProfile, getFollowerProfilePublic, getFollowingsProfile, getIsFollowing, getPlaylistAudios, getPrivateplaylistAudios, getPublicPlaylist, getPublicProfile, getPublicUploads, getRecommendedByprofile, getUploads, updateFollower } from "#/controller/profile";
import { isAuth, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router()

router.post("/update-follower/:profileId", mustAuth, updateFollower);
router.get("/uploads", mustAuth, getUploads)
router.get("/uploads/:profileId", getPublicUploads)
router.get("/info/:profileId", getPublicProfile)
router.get("/playlist/:profileId", getPublicPlaylist)
router.get("/recomended", isAuth, getRecommendByProfile)
router.get("/auto-generated-playlist", mustAuth, getAutoGeneratedPlaylist) 
router.get("/followers", mustAuth, getFollowerProfile)
router.get("/followers/:profileId", mustAuth, getFollowerProfilePublic)
router.get("/followings", mustAuth, getFollowingsProfile)
router.get("/playlist-audios/:playlistId", getPlaylistAudios)
router.get("/private-playlist-audios/:playlistId", mustAuth, getPrivateplaylistAudios)
router.get("/is-following/:playlistId", mustAuth, getIsFollowing)

export default router;
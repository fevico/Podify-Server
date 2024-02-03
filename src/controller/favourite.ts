import { pageinationQuery } from "#/@types/misc";
import Audio from "#/models/audio";
import Favourite from "#/models/favourite";
import { RequestHandler } from "express-serve-static-core";
import { isValidObjectId } from "mongoose";

export const toggleFavourite: RequestHandler = async (req, res) => {
    // audio already in favorite list 
    const audioId = req.query.audioId as string
    let status: "added" | "removed";

    if (!isValidObjectId(audioId)) return res.status(422).json({ error: "Audio id is invalid!" });

    const audio = await Audio.findById(audioId);
    if (!audio) return res.status(404).json({ error: "Resource not found!" })

    // audio already in the list 
    const alreadyExist = await Favourite.findOne({ owner: req.user.id, items: audioId });
    if (alreadyExist) {
        // we want to remove from old list 
        await Favourite.updateOne({ owner: req.user.id }, {
            $pull: { items: audioId }
        })
        status = "removed"
    } else {
        const favorite = await Favourite.findOne({ owner: req.user.id })
        if (favorite) {
            // trying to add new audio to old list
            await Favourite.updateOne({ owner: req.user.id }, {
                $addToSet: { items: audioId }
            })
        } else {
            // tring to create fresh fav list 
            await Favourite.create({ owner: req.user.id, items: [audioId] })
        }
        status = "added"
    }

    if (status === "added") {
        await Audio.findByIdAndUpdate(audioId, {
            $addToSet: { likes: req.user.id }
        })
    }

    if (status === "removed") {
        await Audio.findByIdAndUpdate(audioId, {
            $pull: { likes: req.user.id }
        })
    }
    res.json({ status });
}

export const getFavourites: RequestHandler = async (req, res) => {
    const userID = req.user.id;

    const {limit="20", pageNo="0"} = req.query as pageinationQuery;

    const favorites = await Favourite.aggregate([
        {$match: {owner: userID}},
        {
            $project: {
                audioIds: {
                    $slice: ["$items", parseInt(limit) * parseInt(pageNo), parseInt(limit)]
                }
            }
        },
        {$unwind: "$audioIds"},
        {
            $lookup: {
                from: "audios",
                localField: "audioIds",
                foreignField: "_id",
                as: "audioInfo",
            }
        },
        {$unwind: "$audioInfo"},
        {
            $lookup: {
                from: "users",
                localField: "audioInfo.owner",
                foreignField: "_id",
                as: "ownerInfo",
            }
        },
        {$unwind: "$ownerInfo"},
        { 
            $project: {
                _id: 0,
                id: "$audioInfo._id",
                title: "$audioInfo.title",
                about: "$audioInfo.about",
                category: "$audioInfo.category",
                file: "$audioInfo.file.url",
                poster: "$audioInfo.poster.url",
                owner: {name: "$ownerInfo.name", id: "$ownerInfo._id"},
            }
        }
    ]);

 res.json({ audios: favorites });
}

export const getIsFavourite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string

    if(!isValidObjectId(audioId)) return res.json({error: "invalid error id!"})

    const favourite = await Favourite.findOne({ owner: req.user.id, items: audioId })
        
    res.json({ result: favourite ? true : false });
}
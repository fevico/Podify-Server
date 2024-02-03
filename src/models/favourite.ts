import { Model, ObjectId, Schema, model, models } from "mongoose";

interface FavouriteDocument {
    owner: ObjectId;
    items: ObjectId[];
}

const favouriteSchema = new Schema<FavouriteDocument>({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
    items:[{type: Schema.Types.ObjectId, ref: "Audio"}]
},{
    timestamps:true
})

const Favourite = models.Favourite || model("Favourite", favouriteSchema)
 export default Favourite as Model<FavouriteDocument>;
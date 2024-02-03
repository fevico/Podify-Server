import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

// creating interface 
interface EmailVerificationTokenDocument {
    owner: ObjectId;
    token: String;
    createdAt: Date;
}
 
interface Methods{
    compareToken(token: string): Promise<boolean>   
}

// expire token after 1 hour
const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, {}, Methods>({
        owner:{
            type: Schema.Types.ObjectId,
            required:true,
            ref: "User"
        },
        token:{
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            expires: 3600,
            default: Date.now()
        }
    });

    emailVerificationTokenSchema.pre('save', async function(next){
        // hash the token
        if(this.isModified("token")){
            this.token = await hash(this.token, 10); 
        }
        next();
    }); 

    emailVerificationTokenSchema.methods.compareToken = async function(token){
     const result = await compare(token, this.token)
     return result
    }

export default model("EmailVerificationTokenSchema", emailVerificationTokenSchema) as 
Model<EmailVerificationTokenDocument, {}, Methods> 
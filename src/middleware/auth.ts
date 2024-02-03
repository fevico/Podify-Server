import passwordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { JWT_SECRET } from "#/utiles/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";


export const isValidPasswordResetToken: RequestHandler = async(req, res, next)=>{
   
    const { token, userId } = req.body;

   const resetToken = await passwordResetToken.findOne({owner: userId})
   if(!resetToken) return res.status(403).json({error: "Unauthorized acccess, invalid token"});

   const matched = await resetToken.compareToken(token)
   if(!matched) return res.status(403).json({error: "Unauthorized acccess, invalid token"});
    
   next()
}

export const mustAuth: RequestHandler = async(req, res, next)=>{
    const {authorization} = req.headers;

    const token = authorization?.split("Bearer ")[1];

    if(!token) return res.status(403).json({error: "Unauthorized request"});
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;
    const user = await User.findOne({_id: id, tokens: token});
    if(!user) return res.status(403).json({error: "Unauthoried request! "});
     
    req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avater?.url,
        followers: user.followers.length,
        followings: user.followings.length,
      },    
      
      req.token = token;

    next()
};

export const isAuth: RequestHandler = async(req, res, next)=>{
    const {authorization} = req.headers
    const token = authorization?.split("Bearer ")[1];

    if(token){
      const payload = verify(token, JWT_SECRET) as JwtPayload;
      const id = payload.userId;

      const user = await User.findOne({_id: id, tokens: token})
      if(!user) return res.status(403).json({error: "Unauthoried request! "});
       
      req.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified,
          avatar: user.avater?.url,
          followers: user.followers.length,
          followings: user.followings.length,
        },    
        
        req.token = token;  
    }

    next()
};

export const isVerified: RequestHandler=(req, res, next) =>{
  if(!req.user.verified) return res.status(403).json({error: "please verify your email account!"});
  
  next();
}
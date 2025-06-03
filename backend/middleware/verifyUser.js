import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';


const verifyUser =async (req,res,next) => {
   try {
     const { accessToken } = req.cookies;
     if (!accessToken) {
         return res.status(401).json({ message: "Access token is missing" });
     }
     const decodedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
     if (!decodedToken) {
         return res.status(401).json({ message: "Invalid access token" });
     }
     const user = await User.findById(decodedToken.id).select("-password");
     if (!user) {
         return res.status(404).json({ message: "User not found" });
     }
     req.user = user; // Attach user to request object
     next(); // Proceed to the next middleware or route handler
   } catch (error) {
     console.error("Error in verifyUser middleware:", error.message);
     res.status(500).json({ message: "Internal server error from verifyUser" });
   }
}

export {verifyUser};
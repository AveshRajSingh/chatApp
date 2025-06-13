import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';


const verifyUser =async (req,res,next) => {
   try {
     // Check for token in cookies first, then in Authorization header
     let token = req.cookies.accessToken;
     
     // If no cookie, check authorization header
     if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       token = req.headers.authorization.split(' ')[1];
     }
     
     if (!token) {
         return res.status(401).json({ message: "Access token is missing" });
     }     const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     if (!decodedToken) {
         return res.status(401).json({ message: "Invalid access token" });
     }
     const user = await User.findById(decodedToken._id).select("-password");
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
import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    }
}, { timestamps: true });



const User = mongoose.model("User",userSchema);

userSchema.pre("save", function(next) {
    // You can add pre-save hooks here if needed
    if(this.isModified("password")) {
        // Hash the password before saving
        bcrypt.hash(this.password,10,(err,hash) => {
            if(err) {
                return next(err);
            }
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});


export default User;

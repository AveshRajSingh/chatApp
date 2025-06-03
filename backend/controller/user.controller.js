import User from "../model/user.model.js";

const createUser = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    if (!username || !email || !password || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    const user = new User({  username,
      email,
      password,
      gender,
      profilePicture:
        req?.file?.path ||
        (gender === "male"
          ? "/public/avatarmale.png"
          : "/public/avatarfemale.jpg"),
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal server error from createUser" });
  }
};

const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
    
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
        }
    
        const accessToken = user.generateAccessToken();
        if (!accessToken) {
            return res.status(500).json({ message: "Failed to generate access token" });
        }
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ message: "Internal server error from loginUser" });
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error.message);
        res.status(500).json({ message: "Internal server error from logoutUser" });
    }
}

const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ message: "User is authenticated", user });
  } catch (error) {
    console.error("Error checking authentication:", error.message);
    res.status(500).json({ message: "Internal server error from checkAuth" });
  }
}



export { createUser,loginUser,logoutUser,checkAuth };

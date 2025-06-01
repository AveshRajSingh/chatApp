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
    const user = await User.create({
      username,
      email,
      password,
      gender,
      profilePicture:
        req?.file?.path ||
        (gender === "male"
          ? "/public/avatarmale.png"
          : "/public/avatarfemale.jpg"),
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal server error from createUser" });
  }
};



export { createUser };

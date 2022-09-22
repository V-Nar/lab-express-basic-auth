const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");

const salt = 10;

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `Please provide complete informations` });
  }

  try {
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ message: `Username already exists` });
    }
    const generatedSalt = bcrypt.genSaltSync(salt);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);

    const newUser = { username, password: hashedPassword };
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `please provide all required information` });
  }

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: `wrong username or password` });
    }

    const matchingPwd = bcrypt.compareSync(password, foundUser.password);
    if (!matchingPwd) {
      return res.status(400).json({ message: `wrong username or password` });
    }

    const payload = { username };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

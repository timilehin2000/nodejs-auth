const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation");
exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const saveUser = await user.save();
    res.status(200).json({
      saveUser,
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.login = async (req, res) => {
  //lets validate the user before we login a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the email exists in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong");

  //password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
};

exports.post = (req, res) => {
  res.json({
    message: "A privte route you cant access except you have a token",
  });
};

// server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const uri = "mongodb+srv://wissenskill:hOODUfqG4BZO49Ct@usermanagement.glmti.mongodb.net/myapp?retryWrites=true&w=majority&appName=UserManagement";
// mongoose.connect(uri);

// const User = mongoose.model('User', new mongoose.Schema({
//   username: { type: String, unique: true },
//   password: String
// }));

// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword =  bcrypt.hash(password, 10);
//   const user = new User({ username, password: hashedPassword });
//   await user.save();
//   res.json({ message: 'User registered successfully' });
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user) {
//     return res.status(400).json({ message: 'Invalid username or password' });
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(400).json({ message: 'Invalid username or password' });
//   }
//   const token = jwt.sign({ id: user._id }, 'secret');
//   res.json({ token });
// });

// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const User = require('./userSchema');

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.status(201).send({ status: true, message: "User Registered" });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send({ status: false, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ status: false, message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, "secret", { expiresIn: '1h' });
  res.json({ token });
});

const uri = "mongodb+srv://wissenskill:hOODUfqG4BZO49Ct@usermanagement.glmti.mongodb.net/myapp?retryWrites=true&w=majority&appName=UserManagement";

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
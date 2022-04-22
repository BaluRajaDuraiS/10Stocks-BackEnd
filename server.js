const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/10stocks-backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo is ready !"))
  .catch((err) => console.log(err));

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  console.log(user);
  if (!user) {
    return { status: "error", error: "Invalid login" };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    return res.json({ status: "ok", value: user });
  } else {
    return res.json({ status: "error" });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ email: id });
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.json({ status: "error" });
  }
});

app.listen(5000, () => {
  console.log(`Server Started at ${new Date()}, Running`);
});

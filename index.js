const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const hbs = require("hbs");
const port = 3500;

//CONNECTING DATABASE
const conn =
  "mongodb+srv://aritra850:Aritra1998@cluster0.3rnuz.mongodb.net/user?retryWrites=true&w=majority";
mongoose
  .connect(conn, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("BACKEND SUCCESSFULLY CONNECTED");
  })
  .catch((err) => console.log(err));

//CONFIGURING SCHEMA
const dbs = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Account = new mongoose.model("Account", dbs);

//CONFIGURATIN & MIDDLEWARE
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/templates/views"));
hbs.registerPartials(path.join(__dirname, "/templates/partials"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//GET REQUESTS
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//POST REQUESTS
app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, cpassword } = req.body;

    await Account.findOne({ email: email })
      .then(async (exist) => {
        if (exist) {
          return res.status(422).json("USER ALREADY EXIST");
        }

        const user = new Account({ name, email, password });
        await user.save().then(res.status(201).render("login"));
      })
      .catch((err) => {
        return res.status(422).json("ERROR OCCOURED");
      });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    await Account.findOne({ email: email, password:password })
      .then((exist) => {
        if (exist) {
          console.log(exist);
          return res.status(201).render("content",{userid:exist.name});
        }
        return res.status(422).json("USER DOES NO EXIST");
        
      })
      .catch((err) => {
        return res.status(422).json("ERROR OCCOURED");
      });
  } catch (err) {
    res.status(400).send(err);
  }
});
//STARTING SERVER
app.listen(port, () => {
  console.log("connected :" + port);
});

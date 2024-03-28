// imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const exists = require("./exists.js");
const exportModel = require("./exportModel.js");

// setting modules
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connect to data base
mongoose
  .connect(
    "mongodb+srv://rhanida718:uAFjkJSfZ7gbNmmd@azizcluster.gr0bt6u.mongodb.net/todolistDB"
  )
  .then(() => {
    console.log("connected to data base");
  })
  .catch((error) => {
    console.log(`connection error: ${error}`);
  });

// create schema
const itemsSchema = new mongoose.Schema({
  value: { type: String, required: [true, "Name is required"] },
});

// create model for home route
const Item = mongoose.model("Item", itemsSchema);

// global reference of custom route model
let ListNameItem = "";

//! home route ------------------------------------------------------------------------------------------------
//? get ------------------------------------------------------------------------------------------------

app.get("/", async (req, res) => {
  // find items
  const getItems = await Item.find({}).catch((error) => {
    console.log(`find error: ${error}`);
  });

  if (getItems.length === 0) {
    //create default items
    const defaultItems = [
      new Item({ value: "Take shower" }),
      new Item({ value: "Get haircut" }),
      new Item({ value: "Do homework" }),
    ];

    //insert default items
    (async () => {
      await Item.insertMany(defaultItems).catch((error) => {
        console.log(`insertMany error: ${error}`);
      });
    })();

    res.redirect("/");
  } else {
    res.render("list", { listTitle: "Today", newListItems: getItems });
  }
});

//? post ------------------------------------------------------------------------------------------------
app.post("/", async function (req, res) {
  const item = new Item({ value: req.body.newItem });

  await item.save().catch((error) => {
    console.log(`save error: ${error}`);
  });

  res.redirect("/");
});

//! /delete route post ------------------------------------------------------------------------------------------------
app.post("/delete", async function (req, res) {
  let model = Item;
  let route = "/";

  // check if form triggered from custom or home route
  if (!(req.body.listTitle === "Today")) {
    model = ListNameItem;
    route = route + req.body.listTitle;
  }

  // delete item based on id
  await model
    .findByIdAndDelete(req.body.checkboxId)
    .then(console.log("deleted item successfully"))
    .catch((error) => {
      console.log(`findByIdAndDelete error: ${error}`);
    });

  res.redirect(route);
});

//! about route ------------------------------------------------------------------------------------------------
app.get("/about", function (req, res) {
  res.render("about");
});

//! custom route ------------------------------------------------------------------------------------------------
//? get ------------------------------------------------------------------------------------------------
app.get("/:listName", async function (req, res) {
  // storing list name
  const listName = req.params.listName;

  // create local model for custom route
  const localModel = mongoose.model(listName + "item", itemsSchema);

  //check if model has been created
  if (
    !(
      localModel.modelName === ListNameItem.modelName ||
      listName === "favicon.ico"
    )
  ) {
    // export model to global scope
    ListNameItem = exportModel(localModel, ListNameItem);
  }

  //get data base collections
  let collections = await mongoose.connection.listCollections();

  // check if a collection with name of custom route exists in data base
  const existsResult = exists(collections, listName + "items");

  if (existsResult) {
    // find items
    const getItems = await localModel.find({}).catch((error) => {
      console.log(`find error: ${error}`);
    });

    // render list
    res.render("list", {
      listTitle: listName,
      newListItems: getItems,
    });
  } else {
    res.render("list", {
      listTitle: listName,
      newListItems: [],
    });
  }
});

//? post ------------------------------------------------------------------------------------------------
app.post("/:listName", async function (req, res) {
  //* insert new document
  await new ListNameItem({ value: req.body.newItem })
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(`save error: ${error}`);
    });

  //render list
  res.redirect("/" + req.params.listName);
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

const express = require("express")
const router = express.Router()
const UsersFood = require("../db/models/user")
const Meal = require("../db/models/meal");

router.get("/", (req, res) => {
  res.render("home",{ name: req.session.name, msg:" " });
});
  
router.get("/placeorder", async (req,res) =>{
  var obj = await UsersFood.findOne({Name:req.session.name})
  res.render("placeorder", { name: req.session.name, id: obj._id, msg:" " })
});
  

router.post("/placeorder", async (req, res) => {
  var id = req.body.id;
  var food = req.body.food;
  var address = req.body.address;
  var date = new Date().toJSON().slice(0,10).split('-').reverse().join('-')
  var time = new Date().toLocaleTimeString()
  const data = {
    Name: req.session.name,
    Meal: food,
    Address: address,
    Date: date,
    Time: time,
    Cost: Math.floor(Math.random() * 90 + 10)
  };
  const newMeal = await new Meal(data);
  newMeal
    .save()
    .then((response) => {
      res.redirect("/home/placeorder/details")
    })
    .catch((err) => {
      console.log("Error inside post",err);
    });
});

router.get("/placeorder/details", (req,res)=>{
  Meal.find({ Name: req.session.name })
        .then((response) => {
          res.render("final", {name: req.session.name, response: response,msg:"Congratulations! Order is Placed Successfully"});
        })
        .catch((err) => {
          console.log(err);
        });
});



module.exports = router
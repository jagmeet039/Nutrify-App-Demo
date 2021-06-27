const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs");
const UsersFood = require("../db/models/user")
const Meal = require("../db/models/meal");
const History = require("../db/models/history")
const {isAuthorized, isSignIn} = require("../controllers/controller")
var Publishable_Key = 'pk_test_51J56jpSFMNnlBsL2u0NqAKmLqCrud8MEwaybapgunLE9nwPmffZbqvFnNCkNNll7LAdI0U4e93dAkT5Pu8wi3EEV00cRgXFBd5'
// var Secret_Key = 'sk_test_51J56jpSFMNnlBsL2ESgdi9y8YJoFDwK65zcMFADYYoDZQJz54wNbfd5HWBSIyeGxHfTqrXMA57esdNlbyE0uZ1N400IzvBEilJ'

router.get("/", (req, res) => {
  if(req.headers.cookie) return res.redirect("/home");
  	res.render("start");
});

router.get("/signup", (req, res) => {
  if(req.headers.cookie) return res.redirect("/home");

	res.render("signup");
});

router.post("/signup", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  const data = {
    Name: name,
    Email: email,
    Password: hash,
  };
  const newUser = new UsersFood(data);
  newUser.save();
  res.redirect("/signin");
});

router.get("/signin", (req, res) => {
  if(req.headers.cookie) return res.redirect("/home");
	res.render("signin", { msg: " " });
});

router.post("/signin", isSignIn,(req, res) => {
  res.redirect("/home");
});

router.get("/signout", isAuthorized, (req, res) => {
	res.clearCookie('token');
	res.clearCookie('connect.sid');
	req.session.destroy(() => {
		res.render('signin', { msg: "Logged out sucessfully" },)
	});
});

router.get("/logout", (req, res) => {
	res.clearCookie('token');
	res.clearCookie('connect.sid');
	req.session.destroy(() => {
		res.render('signin', { msg: "Time Expiered! Logged out sucessfully" },)
	});
});

router.get("/update/:id", isAuthorized, (req, res) => {
  res.render("update", { name: req.session.name, idd: req.params.id,msg:" "});
});


router.post("/update/:id", isAuthorized, async (req, res) => {
  await Meal.findOneAndUpdate({ _id: req.params.id }, { Meal: req.body.food })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log("err");
    });
  Meal.find({ Name: req.session.name })
    .then((response) => {
      res.render("final", {name: req.session.name, response: response ,msg:"Meal Order Updated successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/pay",async (req,res)=>{
  var objects = await Meal.find({Name:req.session.name});
     var len =  objects.length;
     var price = 0;
     for(i = 0 ; i < len ; i++){
       price = price + objects[i].Cost;
     }
     console.log("Total price :"+price);
 
  res.render('payment',{key: Publishable_Key,name: req.session.name,pay:price*100});
})


router.post('/payment', async function(req, res){
  const backup =await Meal.find({Name:req.session.name});
  for(i=0;i<backup.length;i++){
   const data = {
     Name: backup[i].Name,
     Meal: backup[i].Meal,
     Address: backup[i].Address,
     Date: backup[i].Date,
     Time: backup[i].Time,
     Cost: backup[i].Cost
   };
   const newHistory = await new History(data);
   newHistory
     .save()
     .then((response) => {
       console.log("Backup done")   
  }).catch(()=>{
    console.log("Error");
  })
 }
  Meal.deleteMany({Name:req.session.name}).then(()=>{
   res.render('home',{msg:"Payment is Successful!",name:req.session.name});
  }).catch(()=>{
    res.send("Payment failed")
  })
 
})

router.get("/delete/:id", isAuthorized, async (req, res) => {
  await Meal.findOneAndRemove({ _id: req.params.id })
    .then((response) => {
      console.log("Successfull");
    })
    .catch((err) => {
      console.log("err");
    });
  Meal.find({ Name: req.session.name })
    .then((response) => {
      res.render("final", { name: req.session.name, response: response ,msg : "Order Deleted Successfully"});
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router

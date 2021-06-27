const express = require("express")
const router = express.Router()
const History = require("../db/models/history");
const {isAuthorized} = require("../controllers/controller")


router.get("/",async function(req,res){
    await History.find({Name:req.session.name}).then((response)=>{
      res.render('history',{response:response,msg:""})
    }).catch((err)=>{
      console.log("Cannot fetch history");
    })
   
  })

router.get("/clearhistory", isAuthorized, async (req, res) => {
    await History.collection.drop()
      .then((response) => {
        console.log("Successfull");
      })
      .catch((err) => {
        console.log("err");
      });
      History.find()
      .then((response) => {
        res.render("history", {response: response, msg : "Deleted Successfully"});
      })
      .catch((err) => {
        console.log(err);
      });
  });

  module.exports = router
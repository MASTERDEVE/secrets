require("dotenv").config(); 
const express= require("express");
const app= express();
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs= require("ejs");
const encrypt= require("mongoose-encryption");



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


/////////Level 1 security (set username and password)///////
const userSchema= new mongoose.Schema ({
    email:String,
    password:String,
});
/////////////////////////


///////Level 2 secuirty(encryption)////////


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
///////////////////////////////

async function main(){
    try{
    await mongoose.connect("mongodb://localhost:27017/userDB");
    }catch(err){
        console.log(err);
    }
    const User= new mongoose.model("User",userSchema);

    app.get("/",async function(req,res){
        try{
            res.render("home");
        }catch(err){
            console.log(err)
        }
    })

    app.get("/login",async function(req,res){
        try{
            res.render("login");
        }catch(err){
            console.log(err)
        }
    })

    app.get("/register",async function(req,res){
        try{
            res.render("register");
        }catch(err){
            console.log(err)
        }
    })

    app.post("/register",async function(req,res){
        try{
           const user= new User({
            email: req.body.username,
            password:req.body.password,
        })
        await user.save()
        res.render("secrets")
        }catch(err){
            console.log(err)
        }
    })

    app.post("/login",async function(req,res){
        try{
         const username=req.body.username;
        const password= req.body.password;

        foundUser= await User.findOne({email:username})
        if(foundUser){
            if(foundUser.password=== password){
                res.render("secrets")
            }
        }else{console.log("Invalid password");
            res.redirect("/login");
        }
        }   catch(err){
            console.log(err)
        }
    })
}

main();

app.listen(3000,function(req,res){
    console.log("Server is running on port 3000")
});
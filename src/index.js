require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const path = require("path");
const app = express();
const dbconn = require("./db/conn");
const User = require("./models/user");
const Exam_Data = require("./models/exam");
const Question_Data = require("./models/question");

app.use(express.urlencoded({
    extended:true
}))

const PORT = process.env.PORT;
app.set("view engine", "ejs");

const view_path = path.join(__dirname,"/views");
const css_path = path.join(__dirname,"/public");

app.set("views", view_path);
app.use(express.static(css_path));


app.get("/", async (req, res) => {
    try {
        res.render("login");  
    } catch (err) {
        res.send(err);
    }
})


// Register Router
// view register page
app.get("/register", async (req, res) => {
    try {
        res.render("register");
        
    } catch (err) {
        res.send(err);
    }
})

// to Store Data
app.post("/register_create", async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password,10);
        req.body.password = password;
        const UserData = new User(req.body);
        console.log(UserData);
        await UserData.save();
        res.redirect("/");
        
    } catch (err) {
        console.log(err);
        res.send(err);
    }

})

//End Register Router



// start login router

app.post("/login_create", async (req, res) => {
    try {
        const user_login = await User.findOne({ email:req.body.email });
        if (!user_login) {
            res.redirect("/");
        }
       
        const password_match = await bcrypt.compare(req.body.password, user_login.password);
        if (!password_match) {
            res.redirect("/");
        }
        res.redirect("/exam_select");
    }
    catch (err) {
        console.log(err)
        res.send(err);
    }
})

app.get("/exam_select", async (req, res) => {
    try {
        const exams =  await Exam_Data.find();
        res.render("exam_select", { exams });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})


app.post("/index_create", async (req, res) => {
    try {
        let all_exam = {};
        if (req.body.select_subject) {
            all_exam.select_subject = req.body.select_subject;
        }
        const exam_all_question = await Question_Data.find(all_exam);
        const preeee_data = await Question_Data.find(all_exam);
        preeee_data.pop();
        console.log(preeee_data);
        const first_questons = exam_all_question[0];
        res.render("index", {exam_all_question,first_questons,preeee_data});
        
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})


// app.get("/save_next_data", async (req, res) => {
//     try {
//         console.log("dww");
        
//     } catch (err) {
        
//     }
// })


app.get("/question_count_data/:id", async (req, res) => {
    try {
        const count_question = await Question_Data.findOne({ _id:req.params.id });
        res.send(count_question); 
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

app.get("/prev_all_data/:id", async (req, res) => {
    try {
        const prev_data = await Question_Data.findOne({ _id: req.params.id })
        
        res.send(prev_data);

    } catch (err) {
        
    }
})





app.get("/logout", async (req, res) => {
    try {
        res.redirect("/");
    } catch (err) {
        res.send(err);
    }    
})

// Server Port Number
app.listen(PORT, () => {
    console.log(`Server run on Port no ${PORT}`);
})
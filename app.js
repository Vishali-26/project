// function print(){
//     console.log("express")
// }
// print()

// const express = require("express");
// const mongoose = require("mongoose")
// const app = express();
// const port=3001;

// const mongourl="mongodb://localhost:27"

// const data=[
//     {id:1,name:"vishali",address:"TVM"},
//     {id:2,name:"sangeetha",address:"KPR"},
//     {id:3,name:"vimal",address:"CBE"},
// ];

// app.get('/student/details',(req,res)=>{
//     res.json(data);
// });

// app.listen(port,()=>{
//     console.log(`Server is running on http://localhost:${port}`);
// });

// app.get('/api/singledata',(req,res)=>{
//     const{name,id}=req.query;

//     if(name,id){
//         const result = data.find(item=> item.name===String(name) && item.id===Number(id));
//         if(result){
//             res.json(result)
//         }else{
//             res.status(400).json({error:"Data not found "})
//         }
//     } else {
//         res.json(data);
//     }
// });

const express=require("express");
const mongoose=require("mongoose")
const app=express();
const port=5500;



const mongoUrl="mongodb://localhost:27017"
mongoose.connect(mongoUrl)
.then(()=>{
    console.log("Database Connected Successfully")
    app.listen(port,()=>{
        console.log(`Server is running at port ${port}`)
    })
})
.catch((err)=>console.log(err))

const expenseSchema=new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,rrequired:true},
});

const expenseModel=mongoose.model("expense-tracker",expenseSchema)

app.get("/api/expenses/:id",async(req,res)=>{
    try{
        const{id}=req.params;
        const expense = await expenseModel.findOne({id});
        if(!expense){
            return res.status(404).json({message:"Expense not found"})
        }
        res.status(200).json(expense);
    }catch(error){
        res.status(500).json({message:"Error in fetching Expenses"});
    }
});
const{v4:uuidv4}=require("uuid");
app.post("/api/expenses",async(req,res)=>{
    let body="";
   // const{title,amount}=req.body;
   req.on("data",(chunk)=>{
    body+=chunk;//collect request data
   
});
req.on("end",async()=>{
    const data = JSON.parse(body);//parse data
    const newExpense=new expenseModel({
        id:uuidv4(),
        title:data.title,
        amount:data.amount,
    });
    const savedExpense=await newExpense.save();//save to database
    res.status(200).json(savedExpense);//send response
});
});

app.use(express.json);
app.put("/api/expenses/:id", async (req,res)=>{
    const {id} = req.params;
    const {title,amount} = req.body;
    console.log({title})
    try{
        const updateExpense = await expenseModel.findOneAndUpdate(
            {id},
            {title,amount}
        );
        if(!updateExpense){
            return res.status(400).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount});
    }
    
catch(error){
        res.status(500).json({message:"Error in updating expense"});
    }
});
////////////////////////////////////////////////////////////
// Server initialization
////////////////////////////////////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const { send } = require('express/lib/response');
const app = express();
const PORT = 5000;

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

// GET & POST Routes go here


app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})
////////////////////////////////////////////////////////////
//Variables
////////////////////////////////////////////////////////////
let history=[]
let numString1;
let numString2;
let op;


////////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////////
function caluculate(x,y,z){
  let newString = (x + y + z).toString();
  console.log(newString);
  a = eval(newString);
  console.log(a);
  return a
}


function caluculateMD(x,y,z){
  if (y === '%'){
      console.log('in division');
      return (Number(x) / Number(z));
  }
  else if (y === '*'){
    return (Number(x) * Number(z));
  }

}
////////////////////////////////////////////////////////////
//POST
////////////////////////////////////////////////////////////
app.post('/custom',(req,res)=>{
  console.log('IN POST /custom')
  let a = req.body;
  numString1 = a.num1;
  numString2 = a.num2;
  op = a.operator;
  let solution;

if(op === '+' || op === '-'){
  solution = caluculate(numString1, op, numString2)
}
else{
  solution = caluculateMD(numString1, op, numString2)
}
  let historyObject = {
    num1: numString1  ,
    operator: op  ,
    num2:  numString2 ,
  }
  history.push(historyObject);

  let objectToSend ={
      num1: numString1 ,
      operator: op  ,
      num2: numString2  ,
      solution: solution  ,
      history: history
  }

  res.send(objectToSend)
})
////////////////////////////////////////////////////////////
//GET
////////////////////////////////////////////////////////////
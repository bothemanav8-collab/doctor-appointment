const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

const usersFile = path.join(__dirname,"data","users.json");
const appointmentsFile = path.join(__dirname,"data","appointments.json");

function readJSON(file){ return JSON.parse(fs.readFileSync(file)); }
function writeJSON(file,data){ fs.writeFileSync(file,JSON.stringify(data,null,2)); }

// SIGN UP
app.post("/signup", (req,res)=>{
  let users = readJSON(usersFile);
  const {username,email,password} = req.body;
  if(users.find(u=>u.email===email)) return res.json({success:false,message:"Email already registered!"});
  users.push({username,email,password});
  writeJSON(usersFile,users);
  res.json({success:true,message:"Signup successful!"});
});

// LOGIN
app.post("/login", (req,res)=>{
  let users = readJSON(usersFile);
  const {email,password} = req.body;
  const user = users.find(u=>u.email===email && u.password===password);
  if(user) res.json({success:true,message:"Login successful!", username:user.username});
  else res.json({success:false,message:"Invalid email or password!"});
});

// BOOK APPOINTMENT
app.post("/book", (req,res)=>{
  let appointments = readJSON(appointmentsFile);
  const {email,username,doctor,slot,date,phone} = req.body;
  const conflict = appointments.find(a=>a.doctor===doctor && a.date===date && a.slot===slot);
  if(conflict) return res.json({success:false,message:"Slot already booked"});
  const newAppointment = {id: Date.now(), userEmail:email, userName:username, doctor, slot, date, phone, time:new Date().toLocaleString()};
  appointments.push(newAppointment);
  writeJSON(appointmentsFile,appointments);
  res.json({success:true,message:`Appointment booked with ${doctor}`});
});

// GET appointments
app.get("/appointments/:email",(req,res)=>{
  let appointments = readJSON(appointmentsFile);
  const userAppointments = appointments.filter(a=>a.userEmail===req.params.email);
  res.json(userAppointments);
});

// DELETE appointment
app.delete("/appointments/:id",(req,res)=>{
  let appointments = readJSON(appointmentsFile);
  appointments = appointments.filter(a=>a.id != req.params.id);
  writeJSON(appointmentsFile,appointments);
  res.json({success:true,message:"Appointment cancelled"});
});

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

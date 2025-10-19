const doctors = [
  { name: "Dr. Sharma", specialization: "Cardiologist" },
  { name: "Dr. Mehta", specialization: "Dermatologist" },
  { name: "Dr. Patel", specialization: "Pediatrician" },
  { name: "Dr. Singh", specialization: "Neurologist" }
];

const doctorSelect = document.getElementById("doctor");
const doctorListDiv = document.getElementById("doctor-list");
const form = document.getElementById("appointmentForm");
const msg = document.getElementById("msg");

// Populate doctor select dropdown
doctors.forEach(doc=>{
  const option = document.createElement("option");
  option.value = doc.name;
  option.textContent = `${doc.name} (${doc.specialization})`;
  doctorSelect.appendChild(option);
});

// Show doctors list
doctors.forEach(doc=>{
  const div = document.createElement("div");
  div.classList.add("doctor");
  div.innerHTML = `<h3>${doc.name}</h3><p>${doc.specialization}</p>`;
  doctorListDiv.appendChild(div);
});

// Form submit
form.addEventListener("submit", async e=>{
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const doctor = doctorSelect.value;
  const date = document.getElementById("date").value;
  const slot = document.getElementById("slot").value;

  const res = await fetch("/book",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:name,email,phone,doctor,date,slot})
  });
  const data = await res.json();
  msg.textContent = data.message;
  if(data.success) form.reset();
});

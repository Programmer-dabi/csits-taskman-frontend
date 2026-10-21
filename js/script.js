const API_URL= "http://localhost:8000";

const form = document.getElementById("form");
const taskList = document.getElementById("taskList");
let success = false;

document.addEventListener('DOMContentLoaded',function(){
    showListdata();
});
function submitInput(e){
e.preventDefault();
  const taskName = document.getElementById("taskName");
  const subOrganization = document.getElementById("subOrganization");
  const dueDate = document.getElementById("dueDate");
  const validation = document.getElementById("validation");

  if(!taskName.value || !subOrganization.value || !dueDate.value){
    validation.textContent = "Please fill all inputs";
    console.log("no output");
    return;
  }
    const insertObj = {
        task_name: taskName.value,
        sub_organization: subOrganization.value,
        due_date: dueDate.value,
        status: "Pending"
    };

    sendData(insertObj);
    showListdata();
}
function showList(list = [], status = "All") {
  taskTableBody.replaceChildren();
  console.log(list)
  const filteredList = list.filter((task) => {
    return status === "All" || task["status"] === status;
  });

  filteredList.forEach((task) => {
    List(
      task["task_name"],
      task["sub_organization"],
      task["due_date"],
      task["status"],
      task['id']
    );
  });
}

function List(taskName, subOrg, dueDate, status,id) {
    const row = document.createElement("tr");

    const taskNameCell = document.createElement("td");
    const subOrgCell  = document.createElement("td");
    const dueDateCell = document.createElement("td");
    const statusCell  = document.createElement("td");
    const actionsCell = document.createElement("td");

    const updateStatusBtn = document.createElement("button");
    const selectOption    = document.createElement("select");
    const deleteTaskBtn   = document.createElement("button");

    // Task information
    taskNameCell.textContent = taskName;
    subOrgCell.textContent = subOrg;

    // Format datetime-local
    if (dueDate) {
        const dateObj = new Date(dueDate);
        dueDateCell.textContent = new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(dateObj);
    } else {
        dueDateCell.textContent = "No due date";
    }

    const statusText = document.createElement("span");
    statusText.textContent = status;
    statusCell.append(statusText);
    console.log(status)

    if(status === 'Pending'){
      statusCell.classList = `pending`;
    }else if(status === "Due Tommorrow"){
      statusCell.classList = `dueTomorrow`;
    }else if(status === "Accomplished"){
      statusCell.classList = `Accomplished`;
    }else if(status === "Unaccomplished"){
      statusCell.classList = `Unaccomplished`;
      
    }


    // Update button
    updateStatusBtn.type = "button";
    updateStatusBtn.textContent = "Update";
    updateStatusBtn.className = "updateBtn";

    selectOption.style.display = "none";
    ["Pending", "Accomplished"]
        .forEach(s => selectOption.append(new Option(s, s)));
    selectOption.value = status;
    if (selectOption.selectedIndex === -1) selectOption.selectedIndex = 0;

    // Delete button
    deleteTaskBtn.type = "button";
    deleteTaskBtn.textContent = "Delete";
    deleteTaskBtn.className = "deleteBtn";


    actionsCell.append(updateStatusBtn, selectOption, deleteTaskBtn);


    row.append(taskNameCell, subOrgCell, dueDateCell, statusCell, actionsCell);
    taskTableBody.append(row);

    // ---- Toggle behaviour ----
    let isEditing = false;

    updateStatusBtn.addEventListener("click", () => {
        if (!isEditing) {

            statusText.style.display = "none";
            selectOption.style.display = "block";
            statusCell.append(selectOption);      
            updateStatusBtn.textContent = "Done";
            isEditing = true;
        } else {
           updateStatus(selectOption.value, id);
  
            selectOption.style.display = "none";
            actionsCell.insertBefore(selectOption, deleteTaskBtn);


            statusText.style.display = "";

            updateStatusBtn.textContent = "Update";
            isEditing = false;
            showListdata();
        }
    });
    deleteTaskBtn.addEventListener('click',()=>{
      deleteTask(id);
            showListdata();

    });

    if(status === "Unaccomplished" || status === "Accomplished"){
      // updateStatusBtn.removeEventListener();
      updateStatusBtn.disabled = true;
      console.log("done or undone");
    }
}

async function sendData(data) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // Convert the JS object into a JSON string
    });

      if (!response.ok) {
          const errorText = await response.text();

          console.error("Server response:", errorText);

          throw new Error(`HTTP error! Status: ${response.status}`);
      }

    const result = await response.json(); // Parse the server's JSON response
    console.log(result);

  } catch (error) {
    console.error('Error sending data:', error);
  }
}

async function showFilterData(filter){
  try{
      const response = await fetch(`${API_URL}/tasks/status/${filter}`);
       if (!response.ok) {
          const errorText = await response.text();

          console.error("Server response:", errorText);

          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the server's response
      showList(data.data)
    }catch(error){
    console.error(error);
  }
}

async function showListdata(){
  try{
      const response = await fetch(`${API_URL}/tasks`);
       if (!response.ok) {
          const errorText = await response.text();

          console.error("Server response:", errorText);

          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the server's response
      showList(data.data)
    }catch(error){
    console.error(error);
  }
}

async function updateStatus(status, taskId){
  try{
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        status: status
    })
});
       if (!response.ok) {
          const errorText = await response.text();

          console.error("Server response:", errorText);

          throw new Error(`HTTP error! Status: ${response.status}`);
      }
  }catch(error){
    console.log(error);
  }
}

async function deleteTask(taskId){
    try{
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json"
      }
  });
       if (!response.ok) {
          const errorText = await response.text();

          console.error("Server response:", errorText);

          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
  }catch(error){
    console.log(error);
  }
}
filter.addEventListener('change',()=>{showFilterData(filter.value)})
form.addEventListener('submit', (e)=>{submitInput(e)});
const profile_modal_el = document.querySelector(".profile-modal");
const profile_close_btn_el = document.querySelector(".close");
const profile_icon_el = document.querySelector(".profile-icon");

profile_icon_el.addEventListener("click", () => {
    profile_modal_el.style.display = "block";
})

profile_close_btn_el.addEventListener("click", () => {
    profile_modal_el.style.display = "none";
})

const create_task_el = document.querySelector(".create-task-btn");
const create_task_modal_el = document.querySelector(".create-task-modal");
const create_task_close_btn_el = document.querySelector(".create-task-close");

create_task_el.addEventListener("click", () => {
    create_task_modal_el.style.display = "flex";
})

create_task_close_btn_el.addEventListener("click", () => {
    create_task_modal_el.style.display = "none";
})

const title_input_el = document.querySelector("#title-input");
const desc_input_el = document.querySelector("#desc-input");
const status_input_el = document.querySelector("#status-input");
const priority_input_el = document.querySelector("#priority-input");
const date_input_el = document.querySelector("#date-input");
const add_task_el = document.querySelector(".add-task");


add_task_el.addEventListener("click", () => {

    let title = title_input_el.value;
    let description = desc_input_el.value;
    let status = status_input_el.value;
    let priority = priority_input_el.value;
    let date = date_input_el.value;
    
    const taskData = {
        title : title,
        description : description,
        status : status,
        priority : priority,
        date : date
    }

    addTask(taskData);

    create_task_modal_el.style.display = "none";
})


async function addTask(taskData){
    try{
        const response = await fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            },
            credentials:"include",
            body: JSON.stringify(taskData)
        });

        if(!response.ok){
            alert("failed to add task");
        }
        else getAllTask();

    }
    catch(err){
        console.log(err);
    }
}

let TasksArray = [];

async function getAllTask(){
    try{

        const response = await fetch("http://localhost:8080/tasks", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            },
            credentials: "include"
        });

        if(!response.ok){
            throw new Error("Failed to Fetch Tasks")
        }
        else{
            const data = await response.json();
            TasksArray.length = 0;
            TasksArray = TasksArray.concat(data);
            displayTasks(data);
        }

    }
    catch(err){
        console.log(err);
    }
}

const cards_el = document.querySelector(".cards");

function displayTasks(TasksArray){
    cards_el.innerHTML = "";

    TasksArray.forEach(eachCard => {

        const card_div = document.createElement('div');
        card_div.classList.add('card');
        card_div.id = `_${eachCard.task_id}`;
        cards_el.appendChild(card_div);

        const title_and_desc_div = document.createElement('div');
        title_and_desc_div.classList.add('title-and-desc');
        card_div.appendChild(title_and_desc_div);

        const title_div = document.createElement('div');
        title_div.classList.add('title');
        title_div.innerText = eachCard.title;
        title_and_desc_div.appendChild(title_div);

        const title_desc_div = document.createElement('div');
        title_desc_div.classList.add('title-desc');
        title_desc_div.innerText = eachCard.description;
        title_and_desc_div.appendChild(title_desc_div);

        
        const task_info_div = document.createElement('div');
        task_info_div.classList.add('task-info');
        card_div.appendChild(task_info_div);

        const date_p = document.createElement('p');
        date_p.classList.add('date');
        date_p.textContent = eachCard.date;
        task_info_div.appendChild(date_p);

        const priority_p = document.createElement('p');
        priority_p.classList.add('priority');
        priority_p.textContent = eachCard.priority;
        if(eachCard.priority == "Low"){
            priority_p.style.color = 'darkgreen';
        }
        else if(eachCard.priority == "Medium"){
            priority_p.style.color = 'blue';
        }
        else{
            priority_p.style.color = 'red';
        }
        task_info_div.appendChild(priority_p);

        const card_status_p = document.createElement('p');
        card_status_p.classList.add('card-status');
        card_status_p.textContent = eachCard.status;
        task_info_div.appendChild(card_status_p);

        const edit_img = document.createElement('img');
        edit_img.setAttribute("src", "/images/edit.png");
        task_info_div.appendChild(edit_img);

        const delete_img = document.createElement('img');
        delete_img.setAttribute("src", "/images/delete.png");
        delete_img.setAttribute("alt", `${eachCard.task_id}`);
        task_info_div.appendChild(delete_img);

        add_eventListenerOn_deleteBtn(delete_img);
        add_eventListenerOn_editBtn(edit_img, eachCard);
        handleDeadline(eachCard);

    });

}

function handleDeadline(Task){
    let taskDate = Task.date;
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split('T')[0];
    currentDate = currentDate;


    if(currentDate >= taskDate){
        const card_el = document.querySelector(`#_${Task.task_id}`);
        card_el.style.backgroundColor = "rgb(255, 85, 85)";
    }
}

const update_task_modal_el = document.querySelector(".update-task-modal");
const update_task_close_el = document.querySelector(".update-task-close");
const update_btn_el = document.querySelector("#update-btn");

update_task_close_el.addEventListener("click", () => {
    update_task_modal_el.style.display = "none";
});

const update_title_input_el = document.querySelector("#update-title-input");
const update_desc_input_el = document.querySelector("#update-desc-input");
const update_status_input_el = document.querySelector("#update-status-input");
const update_priority_input_el = document.querySelector("#update-priority-input");
const update_date_input_el = document.querySelector("#update-date-input");

function add_eventListenerOn_editBtn(edit_img, Task){
    edit_img.addEventListener("click", () => {
        displayTaskToBeUpdated(Task);
        update_task_modal_el.style.display = "flex";
    });
}

function displayTaskToBeUpdated(Task){
    update_title_input_el.value = Task.title;
    update_desc_input_el.value = Task.description;
    update_status_input_el.value = Task.status;
    update_priority_input_el.value = Task.priority;
    update_date_input_el.value = Task.date;

    update_btn_el.addEventListener("click", () => createUpdatedTask(Task.task_id));
}

function createUpdatedTask(id){
    let title = update_title_input_el.value;
    let description = update_desc_input_el.value;
    let status = update_status_input_el.value;
    let priority = update_priority_input_el.value;
    let date = update_date_input_el.value;

    const data = {
        title : title,
        description : description,
        status : status,
        priority : priority,
        date: date
    };

    updateTaskData(data, id);

}

async function updateTaskData(data, id){
    try{
        const response = await fetch(`http://localhost:8080/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            },
            credentials: "include",
            body: JSON.stringify(data)
        });
        if(!response.ok){
            throw new Error("Update unsuccessfull");
        }
        else{
            getAllTask();
            update_task_modal_el.style.display = "none";
        }
    }
    catch(err){
        console.log(err);
    }
}


function add_eventListenerOn_deleteBtn(delete_img){
    
    delete_img.addEventListener("click", () => {
        let id = parseInt(delete_img.alt);
        if(confirm("Confirm to delete the task")) deletById(id);
    })
   
}

async function deletById(id){
    try{
        const response = await fetch(`http://localhost:8080/tasks/${id}`, {
            method:'DELETE',
            headers:{
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            },
            credentials:"include"
        });

        if(!response.ok){
            throw new Error("Tasks not deleted");
        }

        getAllTask();
    }
    catch(err){
        console.log(err);
    }
}

const status_els = document.querySelectorAll(".status");

status_els.forEach( (status_el) => {
    status_el.addEventListener("click", (e) => {
        if(e.target.innerText !== "Dashboard"){
            displayTasksByStatus(e.target.innerText);
        }
        else{
            getAllTask();
        }
    })
} );


async function displayTasksByStatus(st){
    try{
        const response = await fetch(`http://localhost:8080/tasks/status/${st}`, {
            method: "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
            },
            credentials : "include"
        });

        if(!response.ok){
            throw new Error("Fetch by status failed");
        }

        const data = await response.json();
        displayTasks(data);
    }
    catch(err){
        console.log(err);
    }
}


const priority_filter_el = document.querySelector(".priority-filter");

priority_filter_el.addEventListener("click", (e) => {
    
    let priority = e.target.innerText;
    const newArray = TasksArray.filter( (tasks) => tasks.priority === priority);

    displayTasks(newArray);
})

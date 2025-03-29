const login_btn_el = document.querySelector("#login-btn");
const signup_btn_el = document.querySelector("#signup-btn");
const registration_page_el = document.querySelector(".registration-page");
const dashboard_el = document.querySelector(".dashboard");

if(document.cookie){
    openDashboard();
    let token = localStorage.getItem("jwtToken");
    let userInfo = parseJwt(token);
    setaUserProfile(userInfo);
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
    return JSON.parse(jsonPayload);
}

function openDashboard(){
    registration_page_el.classList.add('deactivate');
    dashboard_el.classList.add('active');
}

const login_username_el = document.querySelector("#login-username");
const login_password_el = document.querySelector("#login-password");

async function login(){

    let username = login_username_el.value;
    let password = login_password_el.value;

    const loginData = {
        username : username,
        password : password
    }

    try{
        let response = await fetch("http://localhost:8080/login",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(loginData)
        });

        if(!response.ok){
            throw new Error("Login failed invalid credentials");
        }
        const token = await response.text();
        let userInfo = parseJwt(token);
        setaUserProfile(userInfo);

        localStorage.setItem("jwtToken", token);
        document.cookie = `jwtToken = ${token}; path = /; max-age = ${12*60*60}`;

        openDashboard();
        getAllTask();

    }
    catch(error){
        alert(error);
    }
    
}

login_btn_el.addEventListener("click", login);


let signup_username_el = document.querySelector("#signup-username");
let signup_email_el = document.querySelector("#signup-email");
let signup_password_el = document.querySelector("#signup-password");

signup_btn_el.addEventListener("click", () => {
    let username = signup_username_el.value;
    let email = signup_email_el.value;
    let password = signup_password_el.value;

    console.log(username, email, password);

    if(username !== "" && email !== "" && password !== ""){
        const signupData = {
            username : username,
            email : email,
            password : password
        }

        signup(signupData);
    }
    else alert("Enter all the Fields");
});


async function signup(signupData){

    try{
        const response = await fetch("http://localhost:8080/signup", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(signupData)
        });

        if(!response.ok){
            alert("Username Already Exists");
        }
        else{
            alert("Signup Successfull");
            login_page_el.classList.remove('deactivate');
            signin_page_el.classList.remove('active');
        }

    }
    catch(err){
        console.log(err);
    }

}


const signin_text_el = document.querySelector(".sign-in-text");
const login_page_el = document.querySelector(".login-page");
const signin_page_el = document.querySelector(".sign-in-page");
const login_text_el = document.querySelector(".log-in-text");


signin_text_el.addEventListener("click", () => {

    login_page_el.classList.add('deactivate')
    signin_page_el.classList.add('active');

});

login_text_el.addEventListener("click", ()=> {

    login_page_el.classList.remove('deactivate');
    signin_page_el.classList.remove('active');

});


function setaUserProfile(userInfo){
    document.querySelector("#profile-user-input").value = userInfo.username;
    document.querySelector("#profile-email-input").value = userInfo.email;
    document.querySelector("#profile-password-input").value = "";
}


const log_out_el = document.querySelector(".log-out");

log_out_el.addEventListener("click", () => {
    document.cookie = `jwtToken =; path = /; max-age =0`;
    localStorage.removeItem("jwtToken");
    location.reload();
})
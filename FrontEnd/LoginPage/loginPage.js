
//inputs
let usernameInput = document.getElementById("username-input-login");
let passwordInput = document.getElementById("password-input-login");

//buttons
let loginButton = document.getElementById("login-button-login");

loginButton.addEventListener("click", async () => {
    if(usernameInput.value === "")
    {
        alert("Enter username");
    }
    if(passwordInput.value === "")
    {
        alert("Enter password");
    }

    let result = await fetch("http://localhost:5079/Users/login",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            username : usernameInput.value,
            password : passwordInput.value
        })
    });

    if(!result.ok)
    {
        alert(await result.json());
    }
    else{
        localStorage.setItem("userid",await result.json());
        localStorage.setItem("username",usernameInput.value);
        window.location.href = "../MainPage/mainPage.html";
    }
});
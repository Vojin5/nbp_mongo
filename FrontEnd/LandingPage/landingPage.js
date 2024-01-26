
//inputs
let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");

//buttons
let registerButton = document.getElementById("register-button");
let loginButton = document.getElementById("login-button");

registerButton.addEventListener("click",async () => {
    if(usernameInput.value === "")
    {
        alert("Please enter username");
    }
    if(emailInput.value === "")
    {
        alert("Please enter email");
    }
    if(passwordInput.value === "")
    {
        alert("Please enter password");
    }

    let result = await fetch("http://localhost:5079/Users/register",{
        method : "POST",
        headers : {
            "Content-Type":"application/json"
        },
        body : JSON.stringify({
            username : usernameInput.value,
            password : passwordInput.value,
            email : emailInput.value
        })
    });
    if(!result.ok)
    {
        alert(await result.json());
    }
    else{
        alert("User added");
    }
});

loginButton.addEventListener("click", () => {
    window.location.href = "../LoginPage/loginPage.html";
})
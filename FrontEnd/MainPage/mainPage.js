
//TODO : fetch svih kartica
//TODO : filteri
let carObject = {};
let usernameLabel = document.getElementById("usernameLabel");
usernameLabel.textContent = localStorage.getItem("username");
//containers
let createContentContainer = document.querySelector(".create-container");
let contentContainer = document.querySelector(".content-container");
//create
let attributesContainer = document.querySelector(".attributes-container");

//buttons
let createContentContainerButton = document.getElementById("create-container-button");
let adsContainerButtton = document.getElementById("ads-container-button");
//create
let createDodajAttribute = document.getElementById("create-dodaj-button");
let createCreateAd = document.getElementById("create-createAd-button");
let fileInput = document.getElementById("file-input");

//inputs
//create
let createPropertyNameInput = document.getElementById("create-svojstvo-input");
let createPropertyValueInput = document.getElementById("create-vrednost-input");
let brandInput = document.getElementById("create-brand-input");
let modelInput = document.getElementById("create-model-input");
let godisteInput = document.getElementById("create-godiste-input");
let kilometrazaInput = document.getElementById("create-kilometraza-input");
let gorivoInput = document.getElementById("create-gorivo-input");
let kubikazaInput = document.getElementById("create-kubikaza-input");
let cenaInput = document.getElementById("create-cena-input");

//Create Ad sekcija
createContentContainerButton.addEventListener("click",() => {
    contentContainer.classList.add("disabled");
    contentContainer.classList.remove("enabled");

    createContentContainer.classList.add("enabled");
    createContentContainer.classList.remove("disabled");
    carObject = {};
});

adsContainerButtton.addEventListener("click", () => {
    contentContainer.classList.add("enabled");
    contentContainer.classList.remove("disabled");

    createContentContainer.classList.remove("enabled");
    createContentContainer.classList.add("disabled");
});

createDodajAttribute.addEventListener("click",() => {
    let newItem = document.createElement("div");
    newItem.className = "attribute-item";
    let name = createPropertyNameInput.value;
    if(createPropertyNameInput.value === "")
    {
        return;
    }
    if(createPropertyValueInput.value === "")
    {
        return;
    }
    if(createPropertyNameInput.value in carObject)
    {
        return;
    }

    newItem.addEventListener("click",() => {
        attributesContainer.removeChild(newItem);
        delete carObject[name];
        console.log(carObject);
    });


    newItem.textContent = createPropertyNameInput.value + " : " + createPropertyValueInput.value;
    attributesContainer.appendChild(newItem);
    carObject[createPropertyNameInput.value] = createPropertyValueInput.value;
});


createCreateAd.addEventListener("click", async () => {
    if(brandInput.value === "")
    {
        alert("Unesite brend automobila");
        return;
    }
    if(modelInput.value === "")
    {
        alert("Unesite model automobila");
        return;
    }
    if(godisteInput.value == "")
    {
        alert("Unesite godiste automobila");
        return;
    }
    if(kilometrazaInput.value === "")
    {
        alert("Unesite kilometrazu automobila");
        return;
    }
    if(gorivoInput.value === "")
    {
        alert("Unesite tip goriva");
        return;
    }
    if(kubikazaInput.value === "")
    {
        alert("Unesite kubikazu automobila");
        return;
    }
    if(!"image" in carObject)
    {
        alert("Unesite sliku");
        return;
    }
    if(cenaInput.value === "")
    {
        alert("unesite cenu");
        return;
    }
    carObject["brand"] = brandInput.value;
    carObject["model"] = modelInput.value;
    carObject["godiste"] = godisteInput.value;
    carObject["kilometraza"] = kilometrazaInput.value;
    carObject["gorivo"] = gorivoInput.value;
    carObject["kubikaza"] = kubikazaInput.value;
    carObject["cena"] = cenaInput.value;

    carObject["ownerid"] = localStorage.getItem("userid");
    
    let result = await fetch("http://localhost:5079/Cars/addcar",{
        method : "POST",
        headers : {
            "Content-Type":"application/json"
        },
        body : JSON.stringify(carObject)
    })
    if(result.ok)
    {
        alert("Car added");
    }
    else{
        alert("Error");
    }
    
});

fileInput.addEventListener("change",() => {
    let avatarButton = document.getElementById("avatarRegister");
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        avatarButton.innerHTML = "Photo Added";
        avatarButton.style.backgroundColor = "green";
        carObject["image"] = reader.result.toString().replace(/^data:(.*,)?/, '');
    }

    if(file)
    {
        reader.readAsDataURL(file);
    }
    else{
    }
});

//Content sekcija
async function fetchAllCars()
{
    let data = await fetch("http://localhost:5079/Cars/getAllCars");
    let allCars = await data.json();
    console.log(allCars);

    allCars.forEach(car => {
        let card = document.createElement("div");
        card.className = "carCard";
        
        let img = document.createElement("img");
        img.src = "data:image/png;base64," + car["image"];
        card.appendChild(img);

        let brandName = document.createElement("label");
        brandName.textContent = car["brand"];
        brandName.className = "cardLabel";
        card.appendChild(brandName);

        let modelName = document.createElement("label");
        modelName.textContent = car["model"];
        modelName.className = "cardLabel";
        card.appendChild(modelName);

        let cena = document.createElement("label");
        cena.className = "cardLabel";
        cena.textContent = car["cena"] + "€";
        card.appendChild(cena);

        contentContainer.append(card);
    });
}

fetchAllCars();

let mode = 0;
let carObject = {};
let changeObject = {};
let usernameLabel = document.getElementById("usernameLabel");
usernameLabel.textContent = localStorage.getItem("username");
//containers
let createContentContainer = document.querySelector(".create-container");
let contentContainer = document.querySelector(".content-container");
let pagesContainer = document.querySelector(".pages-container");
let filterContainer = document.querySelector(".filter-container");
//create
let attributesContainer = document.querySelector(".attributes-container");

//buttons
let createContentContainerButton = document.getElementById("create-container-button");
let adsContainerButtton = document.getElementById("ads-container-button");
//create
let createDodajAttribute = document.getElementById("create-dodaj-button");
let createCreateAd = document.getElementById("create-createAd-button");
let fileInput = document.getElementById("file-input");
//pages
let prevPageButton = document.getElementById("prev-page");
let nextPageButton = document.getElementById("next-page");
//filters
let filterAll = document.getElementById("filter-all");
let filterBrand = document.getElementById("filter-brand");
let priceAsc = document.getElementById("filter-price-asc");
let yearAsc = document.getElementById("filter-year-asc");

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
    filterContainer.classList.add("disabled");
    pagesContainer.classList.add("disabled");

    filterContainer.classList.remove("enabled");
    pagesContainer.classList.remove("enabled");

    createContentContainer.classList.add("enabled");
    createContentContainer.classList.remove("disabled");
    carObject = {};
});

adsContainerButtton.addEventListener("click", () => {
    contentContainer.classList.add("enabled");
    contentContainer.classList.remove("disabled");
    filterContainer.classList.add("enabled");
    pagesContainer.classList.add("enabled");

    filterContainer.classList.remove("disabled");
    pagesContainer.classList.remove("disabled");

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
    carObject["godiste"] = parseInt(godisteInput.value);
    carObject["kilometraza"] = parseInt(kilometrazaInput.value);
    carObject["gorivo"] = gorivoInput.value;
    carObject["kubikaza"] = parseInt(kubikazaInput.value);
    carObject["cena"] = parseInt(cenaInput.value);

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

nextPageButton.addEventListener("click",() => {
    if(page + 1 >= numOfPages)
    {
        return;
    }
    page += 1;
    fetchAllCars(page);
});

prevPageButton.addEventListener("click",() => {
    if(page - 1 < 0)
    {
        return;
    }
    page -= 1;
    fetchAllCars(page);
})

//Content sekcija
async function fetchAllCars(page)
{
    let data = null;
    if(mode === 0)
    {
        data = await fetch("http://localhost:5079/Cars/getCars/"+page);
    }
    else if(mode === 1)
    {
        data = await fetch("http://localhost:5079/Cars/getBrandSorted/"+page);
    }
    else if(mode === 2)
    {
        data = await fetch("http://localhost:5079/Cars/getPriceAsc/"+page);
    }
    else if(mode == 3)
    {
        data = await fetch("http://localhost:5079/Cars/getYearAsc/"+page);
    }
    let allCars = await data.json();
    while(contentContainer.firstChild)
    {
        contentContainer.removeChild(contentContainer.firstChild);
    }

    allCars.forEach(car => {
        let card = document.createElement("div");
        card.className = "carCard";
        
        let img = document.createElement("img");
        img.src = "data:image/png;base64," + car["image"];
        card.appendChild(img);

        let modelContainer = document.createElement("div");
        modelContainer.className = "carName-container"; 

        let brandName = document.createElement("label");
        brandName.textContent = car["brand"];
        brandName.className = "cardLabel";
        modelContainer.appendChild(brandName);

        let modelName = document.createElement("label");
        modelName.textContent = car["model"];
        modelName.className = "cardLabel";
        modelContainer.appendChild(modelName);
        card.appendChild(modelContainer);

        let cena = document.createElement("label");
        cena.className = "cardLabel";
        cena.textContent = car["cena"] + "€";
        card.appendChild(cena);

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        let expandButton = document.createElement("button");
        expandButton.className = "button-card";
        expandButton.innerHTML = "&darr;";
        expandButton.addEventListener("click",() => {
            if(additionalContainer.classList.contains("hidden"))
            {
                additionalContainer.classList.add("expanded");
                additionalContainer.classList.remove("hidden");
            }
            else{
                additionalContainer.classList.remove("expanded");
                additionalContainer.classList.add("hidden");
            }
        });
        buttonContainer.appendChild(expandButton);
        if(car["ownerid"] == localStorage["userid"]) // trenutni korisnik je kreator
        {
            let deleteButton = document.createElement("button");
            deleteButton.className = "button-card";
            deleteButton.textContent = "Delete";
            buttonContainer.appendChild(deleteButton);
            deleteButton.addEventListener("click",async () => {
                console.log(car["_id"]);
                await fetch("http://localhost:5079/Cars/deleteCar/"+car["_id"],{
                    method : "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                      }
                });
            })

            let editButton = document.createElement("button");
            editButton.className = "button-card";
            editButton.textContent = "Edit";
            buttonContainer.appendChild(editButton);
            editButton.addEventListener("click",async () => {
                if(Object.keys(changeObject).length == 0)
                {
                    return;
                }
                else{
                    let result = await fetch("http://localhost:5079/Cars/updateCars",{
                        method : "PUT",
                        headers : {
                            "Content-Type" : "application/json"
                        },
                        body : JSON.stringify(changeObject)
                    })
                }
            });
            
        }
        card.appendChild(buttonContainer);

        //additional content
        let additionalContainer = document.createElement("div");
        additionalContainer.className = "additional-container";
        additionalContainer.classList.add("hidden");
        let doneElements = ["image","brand","model","cena","_id","ownerid"];
        
        for(const key in car)
        {
            if(!doneElements.includes(key))
            {
                //par se pravi od key : value labela
                let pair = document.createElement("div");
                pair.className = "key-value";
                let keyLabel = document.createElement("label");
                keyLabel.className = "cardLabel2";
                keyLabel.textContent = key + " : ";
                let valueLabel = document.createElement("label");
                valueLabel.className = "cardLabel2";
                valueLabel.textContent = car[key];
                pair.appendChild(keyLabel);
                pair.appendChild(valueLabel);
                additionalContainer.appendChild(pair);

                if(car["ownerid"] === localStorage["userid"])
                {
                    valueLabel.addEventListener("click",() => {
                        let oldLabel = valueLabel;
                        pair.removeChild(valueLabel);
                        let valueInput = document.createElement("input");
                        valueInput.value = car[key];
                        valueInput.style.width = "30%";
                        pair.appendChild(valueInput);
                        let applyButton = document.createElement("button");
                        applyButton.innerHTML = "Apply";
                        pair.appendChild(applyButton);
    
                        applyButton.addEventListener("click",() => {
                            if(car[key] != valueInput.value)
                            {
                                let change = {};
                                change[key] = valueInput.value
                                if(changeObject.hasOwnProperty(car["_id"]))
                                {
                                    changeObject[car["_id"]].push(change) // postojeci niz
                                }
                                else{
                                    changeObject[car["_id"]] = [change]; // novi niz
                                }
                                let newvalueLabel = document.createElement("label");
                                newvalueLabel.className = "cardLabel2";
                                newvalueLabel.textContent = valueInput.value;
    
                                let lastelement = pair.lastChild;
                                pair.removeChild(lastelement);
                                lastelement = pair.lastChild;
                                setvalue = lastelement.value;
                                pair.removeChild(lastelement);
                                pair.appendChild(newvalueLabel);
    
                            }
                            else{
                                let lastelement = pair.lastChild;
                                pair.removeChild(lastelement);
                                lastelement = pair.lastChild;
                                pair.removeChild(lastelement);
                                pair.appendChild(oldLabel);
                            }
                            
                        });
                    });
                }
            }
        }

        card.appendChild(additionalContainer);
        
        contentContainer.append(card);
        
    });
}

filterAll.addEventListener("click",() => {
    mode = 0;
    fetchAllCars(page);
});

filterBrand.addEventListener("click",() => {
    mode = 1;
    fetchAllCars(page);
});

priceAsc.addEventListener("click",() => {
    mode = 2;
    fetchAllCars(page);
});

yearAsc.addEventListener("click",() => {
    mode = 3;
    fetchAllCars(page);
})

async function fetchCount()
{
    let data = await fetch("http://localhost:5079/Cars/getCarsCount");
    let res = await data.json();
    return Math.ceil(parseInt(res["number"]) / 4);
}



//Main
let page = 0;
let numOfPages = 0;
fetchAllCars(page);
fetchCount().then((number) => {
    numOfPages = number;
});

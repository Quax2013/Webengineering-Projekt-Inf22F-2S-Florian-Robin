let input;
let globalOffset = 0;
let categoryOffset = {
    "physics": 0,
    "chemistry": 0,
    "physiology or medicine": 0,
    "literature": 0,
    "peace": 0,
    "economic sciences": 0
}
let foundAmount = 0;
const LIMIT = 31;
const categoryAlias = {
    "physics": "phy",
    "chemistry": "che",
    "physiology or medicine": "med",
    "literature": "lit",
    "peace": "pea",
    "economic sciences": "eco"
}

function mainLogoFunc() {
    window.location.replace("./index.html");
}

///////////////////////////////////////////////
function search(offset) {
    let filters = getFilter();
    console.log(filters);
    globalOffset = offset
    document.querySelector("#placeholder").innerHTML = ""
    if ((filters[0].length == 0 || filters[0].length == 6) && (filters[1].length == 0 || filters[1].includes("person"))) {
        fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${offset != 0 ? `&offset=${offset}` : ""}&limit=${LIMIT}`, {
            method: "GET"
        })
            .then(response => {
                return response.json();

            })
            .then(response => {
                foundAmount = response.laureates.length;

                console.log(response);
                console.log(response.laureates);

                if (response.laureates.length == 0) {
                    throwSearchError();
                    return;
                }
                handleResponse(response);
            })
    } else {
        console.log("FILTER_DEBUG")
        let emptyResponse = 0;
        document.querySelector("#placeholder").innerHTML = ""
        for (let item of filters[0]) {
            console.log("DEBUG_CATEGORY: " + item)
            console.log("DEBUG_CATEGORY: " + categoryAlias[item])
            fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${categoryOffset[item] != 0 ? `&offset=${categoryOffset[item]}` : ""}&limit=${LIMIT / 6}&nobelPrizeCategory=${categoryAlias[item]}`, {
                method: "GET"
            })
                .then(response => {
                    return response.json();

                })
                .then(response => {
                    foundAmount = response.laureates.length;

                    console.log(response);
                    console.log(response.laureates);

                    let buttons = document.querySelectorAll(".pageButton");
                    if (response.laureates.length == 0) {
                        emptyResponse++;
                    } else {
                        handleResponse(response);
                    }
                })
            if (emptyResponse == filters[0].length) {
                throwSearchError();
            }
        }
    }
}

function throwSearchError() {
    let buttons = document.querySelectorAll(".pageButton");
    let errorMsg = document.createElement("div");
    errorMsg.classList.add("error-field");
    errorMsg.innerHTML = "Keine Treffer"
    document.querySelector("#placeholder").appendChild(errorMsg);
    for (let i of buttons) {
        i.style.visibility = "hidden";
    }
}

function handleResponse(response) {
    adjustPageButtons(response);

    document.querySelector("#contents").style.transition = "all 0.25s";
    document.querySelector("#contents").style.marginTop = "10vh";
    let elementCount = 0;
    for (let i of response.laureates) {
        if (elementCount < 25) {
            if (i.birth) {
                putPerson(i);
            } else {
                // putCompany(i);
            }
        }
        elementCount++;
    }
}

function adjustPageButtons(response) {
    let buttons = document.querySelectorAll(".pageButton");

    if (response.laureates.length == LIMIT && globalOffset > 0) {
        for (let i of buttons) {
            i.style.visibility = "visible";
        }
    } else if (response.laureates.length == LIMIT && globalOffset == 0) {
        document.querySelector("#prev-page-button").style.visibility = "hidden";
        document.querySelector("#next-page-button").style.visibility = "visible";
    } else if (response.laureates.length < LIMIT && globalOffset == 0) {
        for (let i of buttons) {
            i.style.visibility = "hidden";
        }
    } else {
        document.querySelector("#prev-page-button").style.visibility = "visible";
        document.querySelector("#next-page-button").style.visibility = "hidden";
    }
}

function putPerson(i) {
    let resultDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    let nameLink = document.createElement("a");
    let wikiLink = document.createElement("a");
    let infoDiv = document.createElement("div");
    let prizesDiv = document.createElement("div");

    resultDiv.className = "search-result-person";

    nameLink.href = i.links[1].href;
    nameLink.innerHTML = i.fullName.en;

    wikiLink.href = i.wikipedia.english;
    wikiLink.innerHTML = " (Wikipedia)"

    nameDiv.className = "person-name";
    nameDiv.appendChild(nameLink);
    nameDiv.appendChild(wikiLink);

    infoDiv.className = "person-info";
    infoDiv.innerHTML = `* ${i.birth.date} - ${i.birth.place ? i.birth.place.locationString.en : ""}<br>+ ${i.death ? `${i.death.date} - ${i.death.place.locationString.en}` : "No Death"}`;

    prizesDiv.className = "person-prize";

    for (let x of i.nobelPrizes) {
        let newPrizeLink = document.createElement("a");
        newPrizeLink.innerHTML = `<br>- ${x.category.en} ${x.awardYear}`;
        newPrizeLink.href = x.links[2].href;
        newPrizeLink.target = "_blank";
        prizesDiv.appendChild(newPrizeLink);
    }

    resultDiv.appendChild(nameDiv);
    resultDiv.appendChild(infoDiv);
    resultDiv.appendChild(prizesDiv);

    document.querySelector("#placeholder").appendChild(resultDiv);
}

function putCompany(i) {
    let resultDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    let nameLink = document.createElement("a");
    let infoDiv = document.createElement("div");
    let prizesDiv = document.createElement("div");

    resultDiv.className = "search-result-person";

    nameLink.href = i.links[1].href;
    nameLink.innerHTML = i.fullName.en;

    nameDiv.className = "person-name";
    nameDiv.appendChild(nameLink);

    infoDiv.className = "person-info";
    infoDiv.innerHTML = `* ${i.birth.date} - ${i.birth.place ? i.birth.place.locationString.en : ""}<br>+ ${i.death ? `${i.death.date} - ${i.death.place.locationString.en}` : "No Death"}`;

    prizesDiv.className = "person-prize";

    for (let x of i.nobelPrizes) {
        let newPrizeLink = document.createElement("a");
        newPrizeLink.innerHTML = `<br>- ${x.category.en} ${x.awardYear}`;
        newPrizeLink.href = x.links[2].href;
        newPrizeLink.target = "_blank";
        prizesDiv.appendChild(newPrizeLink);
    }

    resultDiv.appendChild(nameDiv);
    resultDiv.appendChild(infoDiv);
    resultDiv.appendChild(prizesDiv);

    document.querySelector("#placeholder").appendChild(resultDiv);
}

function prevPage() {
    search(globalOffset - (LIMIT - 1));
}

function nextPage() {
    search(globalOffset + (LIMIT - 1));
}

function getFilter() {
    let categories = document.querySelectorAll(".divContentDropdown");
    let labels = [];
    let checkboxes = [[], [], []];
    let values = [[], [], []];

    for (let k = 0; k < 2; k++) {
        labels = categories[k].querySelectorAll("label.checkbox");
        for (let i of labels) {
            let cell = i.querySelector("input")
            checkboxes[k].push(cell);
            if (cell.checked) values[k].push(i.innerText.split("\n").shift());
        }
    }
    // console.log(labels);         //DEBUG
    // console.log(checkboxes);
    // console.log(values);
    return values;
}

///////////////////////////////////////////////











window.onload = () => {
    input = document.querySelector("#search-bar");

    document.querySelector("#search-bar").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            search(0);
        }
    });
}

function debug() {
    getFilter();
}




















/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("content-dropdown").classList.toggle("show");
}


















function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
}

function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);















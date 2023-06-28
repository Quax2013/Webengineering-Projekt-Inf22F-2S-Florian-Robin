let input;
let globalOffset = 0;
let foundAmount = 0;

function mainLogoFunc() {
    window.location.replace("./index.html");
}

///////////////////////////////////////////////
function search(offset) {
    globalOffset = offset
    fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${offset != 0 ? `&offset=${offset}` : ""}`, {
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
                document.querySelector("#placeholder").innerHTML = "Keine Treffer";
                for (let i of buttons) {
                    i.style.visibility = "hidden";
                }
                return;
            } else {
                if (response.laureates.length == 25 && globalOffset > 0) {
                    for (let i of buttons) {
                        i.style.visibility = "visible";
                    }
                } else if (response.laureates.length == 25 && globalOffset == 0){
                    document.querySelector("#prev-page-button").style.visibility = "hidden";
                    document.querySelector("#next-page-button").style.visibility = "visible";
                } else if (response.laureates.length < 25 && globalOffset == 0){
                    for (let i of buttons) {
                        i.style.visibility = "hidden";
                    }
                } else {
                    document.querySelector("#prev-page-button").style.visibility = "visible";
                    document.querySelector("#next-page-button").style.visibility = "hidden";
                }
            }
            document.querySelector("#contents").style.transition = "all 0.25s";
            document.querySelector("#contents").style.marginTop = "10vh";
            document.querySelector("#placeholder").innerHTML = "";
            for (let i of response.laureates) {
                if (i.birth) {
                    putPerson(i);
                }
            }
        })
}

function putPerson(i) {
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
    search(globalOffset - 25);
}

function nextPage() {
    search(globalOffset + 25);
}

function getFilter() {
    let checkboxes = document.querySelectorAll("input.testcheckbox");
    let values = [];
    for (let i of checkboxes) {
        values.push(i.checked);
    }
    console.log(checkboxes);
    console.log(values);
}

///////////////////////////////////////////////













window.onload = () => {
    input = document.querySelector("#search-bar");
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
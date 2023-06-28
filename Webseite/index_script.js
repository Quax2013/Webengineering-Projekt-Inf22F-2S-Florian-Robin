let input;

function mainLogoFunc() {
    window.location.replace("./index.html");
}

///////////////////////////////////////////////
function search() {

    fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();

        })
        .then(response => {
            console.log(response);
            console.log(response.laureates);
            if (response.laureates.length == 0) {
                document.querySelector("#placeholder").innerHTML = "Keine Treffer";
                return;
            }
            document.querySelector("#contents").style.transition = "all 0.25s";
            document.querySelector("#contents").style.marginTop = "10vh";
            document.querySelector("#placeholder").innerHTML = "";
            for (let i of response.laureates) {
                if (i.birth) {
                    let resultDiv = document.createElement("div");
                    let nameDiv = document.createElement("div");
                    let nameLink = document.createElement("a");
                    let infoDiv = document.createElement("div");
                    let prizesDiv = document.createElement("div");
                    let prizeLink = document.createElement("a");

                    resultDiv.className = "search-result-person";

                    nameLink.href = i.links[1].href;
                    nameLink.innerHTML = i.fullName.en;

                    nameDiv.className = "person-name";
                    nameDiv.appendChild(nameLink);

                    infoDiv.className = "person-info";
                    infoDiv.innerHTML = `* ${i.birth.date} - ${i.birth.place ? i.birth.place.locationString.en : ""}<br>+ ${i.death ? `${i.death.date} - ${i.death.place.locationString.en}` : "No Death"}`;

                    prizesDiv.className = "person-prize";
                    prizeLink.innerHTML = `- ${i.nobelPrizes[0].category.en} ${i.nobelPrizes[0].awardYear}`;
                    prizeLink.href = i.nobelPrizes[0].links[2].href;
                    prizeLink.target = "_blank";
                    prizesDiv.appendChild(prizeLink);

                    for (let x = 1; x < i.nobelPrizes.length; x++) {
                        let newPrizeLink = document.createElement("a");
                        newPrizeLink.innerHTML = `<br>- ${i.nobelPrizes[x].category.en} ${i.nobelPrizes[x].awardYear}`;
                        newPrizeLink.href = i.nobelPrizes[x].links[2].href;
                        newPrizeLink.target = "_blank";
                        prizesDiv.appendChild(newPrizeLink);
                    }

                    resultDiv.appendChild(nameDiv);
                    resultDiv.appendChild(infoDiv);
                    resultDiv.appendChild(prizesDiv);

                    document.querySelector("#placeholder").appendChild(resultDiv);
                }
            }

        })
}
///////////////////////////////////////////////













window.onload = () => {
    input = document.querySelector("#search-bar");
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
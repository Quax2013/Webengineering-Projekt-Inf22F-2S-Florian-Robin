let input;
let globalOffset = 0;
let categoryOffset = 0;
const LIMIT = 30;
const categoryAlias = {
    "physics": "phy",
    "chemistry": "che",
    "physiology or medicine": "med",
    "literature": "lit",
    "peace": "pea",
    "economic sciences": "eco"
}
let filters;

function mainLogoFunc() {
    window.location.replace("./index.html");
}

///////////////////////////////////////////////
function search(offset) {
    let foundAmount = 0;
    for (let i of document.querySelectorAll(".pageButton")) {
        i.style.visibility = "hidden";
    }
    if (offset == 0) filters = getFilter();
    console.log(filters);
    globalOffset = offset
    document.querySelector("#placeholder").innerHTML = "";
    if (filters[1].length == 0 || filters[1].includes("person")) {
        if ((filters[0].length == 0 || filters[0].length == 6) && (filters[1].length == 0 || filters[1].includes("person"))) {
            fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${offset != 0 ? `&offset=${offset}` : ""}&limit=${LIMIT + 1}`, {
                method: "GET"
            })
                .then(response => {
                    return response.json();

                })
                .then(response => {
                    foundAmount = response.laureates.length;

                    console.log(response);
                    console.log(response.laureates);

                    if (foundAmount == 0) {
                        throwSearchError();
                        return;
                    }
                    handleResponse(response, LIMIT);
                    console.log("AMOUNT_DEBUG: " + foundAmount);
                    adjustPageButtons(foundAmount);
                })
        } else {
            console.log("FILTER_DEBUG")
            let emptyResponses = 0;
            if (offset == 0) {
                categoryOffset = 0;
            }
            for (let item of filters[0]) {
                fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${categoryOffset != 0 ? `&offset=${categoryOffset}` : ""}&limit=${Math.ceil((LIMIT + 1) / filters[0].length)}&nobelPrizeCategory=${categoryAlias[item]}`, {
                    method: "GET"
                })
                    .then(response => {
                        return response.json();

                    })
                    .then(response => {
                        console.log("DEBUG_CATEGORY: " + item)
                        console.log("DEBUG_CATEGORY: " + categoryAlias[item])
                        foundAmount += response.laureates.length;

                        console.log(response);
                        console.log(response.laureates);

                        if (response.laureates.length == 0) {
                            emptyResponses++;
                        } else {
                            handleResponse(response, Math.ceil(LIMIT / filters[0].length));
                        }
                        console.log("AMOUNT_DEBUG: " + foundAmount);
                        adjustPageButtons(foundAmount);

                        if (emptyResponses == filters[0].length) {
                            throwSearchError();
                        }
                    })
            }
        }
    }
}

function throwSearchError() {
    let buttons = document.querySelectorAll(".pageButton");
    let errorMsg = document.createElement("div");
    errorMsg.classList.add("error-field");
    errorMsg.innerHTML = "No results"
    document.querySelector("#placeholder").appendChild(errorMsg);
    for (let i of buttons) {
        i.style.visibility = "hidden";
    }
}

function handleResponse(response, limit) {
    document.querySelector("#contents").style.transition = "all 0.25s";
    document.querySelector("#contents").style.marginTop = "10vh";
    let elementCount = 0;
    for (let i of response.laureates) {
        if (elementCount < limit) {
            if (i.birth) {
                putPerson(i);
            } else {
                putCompany(i);
            }
        }
        elementCount++;
    }
}

function adjustPageButtons(foundAmount) {
    let buttons = document.querySelectorAll(".pageButton");

    if (foundAmount >= LIMIT + 1 && globalOffset > 0) {
        for (let i of buttons) {
            i.style.visibility = "visible";
        }
    } else if (foundAmount >= LIMIT + 1 && globalOffset < 1) {
        document.querySelector("#prev-page-button").style.visibility = "hidden";
        document.querySelector("#next-page-button").style.visibility = "visible";
    } else if (foundAmount < LIMIT + 1 && globalOffset < 1) {
        for (let i of buttons) {
            i.style.visibility = "hidden";
        }
    } else {
        document.querySelector("#prev-page-button").style.visibility = "visible";
        document.querySelector("#next-page-button").style.visibility = "hidden";
    }
}

function dateFormat(date) {
    let nums = date.split("-");
    if (nums[1] == "00" || nums[2] == "00") return nums[0];
    return nums[2] + "." + nums[1] + "." + nums[0];
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
    infoDiv.innerHTML = `* ${dateFormat(i.birth.date)} - ${i.birth.place ? i.birth.place.locationString.en : ""}<br>+ ${i.death ? `${dateFormat(i.death.date)} - ${i.death.place.locationString.en}` : "No Death"}`;

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
    let wikiLink = document.createElement("a");
    let infoDiv = document.createElement("div");
    let prizesDiv = document.createElement("div");

    resultDiv.className = "search-result-company";

    nameLink.href = i.links[1].href;
    nameLink.innerHTML = i.orgName.en;

    wikiLink.href = i.wikipedia.english;
    wikiLink.innerHTML = " (Wikipedia)"

    nameDiv.className = "company-name";
    nameDiv.appendChild(nameLink);
    nameDiv.appendChild(wikiLink);

    infoDiv.className = "company-info";
    infoDiv.innerHTML = `* ${dateFormat(i.founded.date)} - ${i.founded.place ? i.founded.place.locationString.en : ""}`;

    prizesDiv.className = "company-prize";

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
    categoryOffset -= Math.ceil(LIMIT / filters[0].length);
    if (categoryOffset < 0) categoryOffset = 0;

    search(globalOffset - LIMIT);
    console.log("OFFSETS_DEBUG_PREV: " + categoryOffset)
}

function nextPage() {
    categoryOffset += Math.ceil(LIMIT / filters[0].length);
    if (categoryOffset < 0) categoryOffset = 0;

    search(globalOffset + LIMIT);
    console.log("OFFSETS_DEBUG_NEXT: " + categoryOffset)
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




















/* Funktion für Button dropdown, schaltet dropdown menü an/aus */
function dropdownMenu() {
    document.getElementById("content-dropdown").classList.toggle("show");
}




// ändert die farbe des bookmarks
function changeBookmark(id) {
    var bookmark = document.getElementById(id);
    if(bookmark.getAttribute("src")=="./imgs/bookmark-5-256.png"){
        bookmark.src="./imgs/bookmark-5-256-black.png";
    } else {
        bookmark.src="./imgs/bookmark-5-256.png";
    }
}


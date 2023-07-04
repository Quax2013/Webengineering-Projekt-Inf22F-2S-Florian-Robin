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
    let noLaureates = false;
    for (let i of document.querySelectorAll(".pageButton")) {
        i.style.visibility = "hidden";
    }
    if (offset == 0) {
        filters = getFilter();
        hideFilters();
    }
    console.log(filters);
    globalOffset = offset
    document.querySelector("#placeholder").innerHTML = "";
    if (filters[1].length == 0 || filters[1].includes("person")) {
        if ((filters[0].length == 0 || filters[0].length == 6) && (filters[1].length == 0 || filters[1].includes("person"))) {
            fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${offset != 0 ? `&offset=${offset}` : ""}&limit=${LIMIT + 1}&nobelPrizeYear=${filters[2][0]}&yearTo=${filters[2][1]}`, {
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
                        if (filters[1].length == 1) throwSearchError();
                        else noLaureates = true;
                    }
                    handleResponse(response, LIMIT);
                    console.log("AMOUNT_DEBUG: " + foundAmount);
                    adjustPageButtons(foundAmount);
                })
        } else {
            console.log("FILTER_DEBUG")
            let emptyResponses = 0;
            let fullResponses = 0;
            if (offset == 0) {
                categoryOffset = 0;
            }
            for (let item of filters[0]) {
                fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}${categoryOffset != 0 ? `&offset=${categoryOffset}` : ""}&limit=${Math.ceil(LIMIT / filters[0].length) + 1}&nobelPrizeCategory=${categoryAlias[item]}&nobelPrizeYear=${filters[2][0]}&yearTo=${filters[2][1]}`, {
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
                        if (response.laureates.length == Math.ceil(LIMIT / filters[0].length) + 1) fullResponses++;
                        if (response.laureates.length == 0) {
                            emptyResponses++;
                        } else {
                            handleResponse(response, Math.ceil(LIMIT / filters[0].length));
                        }
                        console.log("AMOUNT_DEBUG: " + foundAmount);
                        if (fullResponses > 0) adjustPageButtons(LIMIT + 1);
                        else adjustPageButtons(foundAmount);

                        if (emptyResponses == filters[0].length) {
                            if (filters[1].length == 1) throwSearchError();
                            else noLaureates = true;
                        }
                    })
            }
        }
    }
    if (filters[1].length == 0 || filters[1].includes("nobel prize")) {
        if (filters[0].length == 0 | filters[0].length == 6) {
            fetch(`https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeYear=${filters[2][0]}&yearTo=${filters[2][1]}${offset != 0 ? `&offset=${offset}` : ""}&limit=${LIMIT + 1}`, {
                method: "GET"
            })
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    foundAmount = response.nobelPrizes.length;

                    console.log(response);
                    console.log(response.nobelPrizes);

                    if (foundAmount == 0 && (noLaureates || filters[1].length == 1)) {
                        throwSearchError();
                    }
                    handleResponse(response, LIMIT);
                    console.log("AMOUNT_DEBUG: " + foundAmount);
                    adjustPageButtons(foundAmount);
                })
        } else {
            console.log("FILTER_DEBUG")
            let emptyResponses = 0;
            let fullResponses = 0;
            for (let item of filters[0]) {
                fetch(`https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeYear=${filters[2][0]}&yearTo=${filters[2][1]}&nobelPrizeCategory=${categoryAlias[item]}${categoryOffset != 0 ? `&offset=${categoryOffset}` : ""}&limit=${Math.ceil(LIMIT / filters[0].length) + 1}`, {
                    method: "GET"
                })
                    .then(response => {
                        return response.json();

                    })
                    .then(response => {
                        console.log("DEBUG_CATEGORY: " + item)
                        console.log("DEBUG_CATEGORY: " + categoryAlias[item])
                        foundAmount += response.nobelPrizes.length;

                        console.log(response);
                        console.log(response.nobelPrizes);
                        if (response.nobelPrizes.length == Math.ceil(LIMIT / filters[0].length) + 1) fullResponses++;
                        if (response.nobelPrizes.length == 0) {
                            emptyResponses++;
                        } else {
                            handleResponse(response, Math.ceil(LIMIT / filters[0].length));
                        }
                        console.log("AMOUNT_DEBUG: " + foundAmount);
                        if (fullResponses > 0) adjustPageButtons(LIMIT + 1);
                        else adjustPageButtons(foundAmount);

                        if (emptyResponses == filters[0].length && (noLaureates || filters[1].length == 1)) {
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
    let container = document.querySelector("#placeholder");
    document.querySelector("#contents").style.transition = "all 0.25s";
    document.querySelector("#contents").style.marginTop = "10vh";
    let elementCount = 0;
    if (response.laureates) {
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
    } else {
        for (let i of response.nobelPrizes) {
            if (elementCount < limit) {
                putNobelPrize(i);
            }
            elementCount++;
        }
    }
    // for (let i of container.childNodes){
    //     if (!i.classList.contains("error-field") && !i.classList.contains("bookmark-added")){
    //         let button = document.createElement("button");
    //         button.className = "bookmarkButton";
    //         button.onclick = "abFunc()";

    //     }
    // }
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
    nameLink.target = "_blank";
    nameLink.innerHTML = i.fullName.en;

    wikiLink.href = i.wikipedia.english;
    wikiLink.target = "_blank";
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
    nameLink.target = "_blank";
    nameLink.innerHTML = i.orgName.en;

    wikiLink.href = i.wikipedia.english;
    wikiLink.target = "_blank";
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

function putNobelPrize(i) {
    let resultDiv = document.createElement("div");
    let titleDiv = document.createElement("div");
    let infoDiv = document.createElement("div");
    let laureatesDiv = document.createElement("div");

    resultDiv.className = "search-result-nobelprize";

    titleDiv.className = "nobelprize-title";
    titleDiv.innerHTML = `${i.categoryFullName.en} ${i.awardYear}`

    infoDiv.className = "nobelprize-info";
    infoDiv.innerHTML = `Awarded: ${i.dateAwarded ? dateFormat(i.dateAwarded) : "No exact date"}</br>${i.laureates[0].motivation.en}`;

    laureatesDiv.className = "nobelprize-laureates";

    for (let k of i.laureates) {
        let person = document.createElement("a");
        if (k.fullName) person.innerHTML = `<br>-${k.fullName.en}`;
        else person.innerHTML = `<br>-${k.orgName.en}`;
        laureatesDiv.appendChild(person);
    }

    resultDiv.appendChild(titleDiv);
    resultDiv.appendChild(infoDiv);
    resultDiv.appendChild(laureatesDiv);

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
    values[2].push(document.querySelector("#minYear").value);
    values[2].push(document.querySelector("#maxYear").value);
    // console.log(labels);         //DEBUG
    // console.log(checkboxes);
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
    document.getElementById("dropdownContent").classList.toggle("show");
}

function hideFilters() {
    if (document.getElementById("content-dropdown").classList.contains("show")) document.getElementById("content-dropdown").classList.remove("show");
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


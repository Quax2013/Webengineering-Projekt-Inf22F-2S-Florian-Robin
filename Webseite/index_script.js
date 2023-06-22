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
                    let infoDiv = document.createElement("div");
                    let prizesDiv = document.createElement("div");

                    resultDiv.className = "search-result-person";

                    nameDiv.className = "person-name";
                    nameDiv.innerHTML = i.fullName.en;

                    infoDiv.className = "person-info";
                    infoDiv.innerHTML = `* ${i.birth.date} - ${i.birth.place ? i.birth.place.locationString.en : ""}<br>+ ${i.death ? `${i.death.date} - ${i.death.place.locationString.en}` : "No Death"}`;

                    prizesDiv.innerHTML = `- ${i.nobelPrizes[0].category.en}`;
                    for (let x = 1; x < i.nobelPrizes.length; x++) {
                        prizesDiv.innerHTML += `<br>- ${i.nobelPrizes[x].category.en}`;
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
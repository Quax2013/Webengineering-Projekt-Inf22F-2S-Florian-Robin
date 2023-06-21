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
            document.querySelector("#contents").style.marginTop = "10vh";
            document.querySelector("#placeholder").innerHTML = "";
            for (let i of response.laureates) {
                let x = document.createElement("p");

                x.innerHTML = i.fullName.en;
                document.querySelector("#placeholder").appendChild(x);
            }

        })
}
///////////////////////////////////////////////













window.onload = () => {
    input = document.querySelector("#search-bar");
}
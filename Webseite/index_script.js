let input;


/////////////////////////    NOT WORKING    //////////////////////
function search() {
    fetch(`https://api.nobelprize.org/2.1/laureates?name=${input.value}`, {
        method: "GET",
        headers:{
            accept: "application/json"
        }
    })
        .then(response => {
            response = response.json();
            console.log(response);
        })
}














window.onload = () => {
    input = document.querySelector("#search-bar");
}

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});
window.onload = pageLoad;

function pageLoad() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "cloth.json");
  xhr.onload = function () {
    var jsdata = JSON.parse(xhr.responseText);
    console.log(jsdata);
    showData(jsdata);
  };
  xhr.onerror = function () {
    alert("ERROR!");
  };
  xhr.send();
}

function showData(cloth) {
    let box = document.getElementById("layer").children;

    for (let i = 0; i < cloth.length; i++) {

        box[i].innerHTML =
            "<img src='" + cloth[i].img + "'>" +
            "<p>" + cloth[i].brand + "</p>" +
            "<p>Price: " + cloth[i].price + " Baht</p>";
    }
}

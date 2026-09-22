
window.onload = pageLoad;

function pageLoad(){
    let xhr = new XMLHttpRequest(); 
    xhr.open("GET", "data.txt"); 
    xhr.onload = function() { 
        alert(xhr.responseText); 
    }; 
    xhr.onerror = function() { 
        alert("ERROR!"); 
    }; 
    xhr.send();
}

// AJAX เรียก JSON file

function pageLoad(){
    let xhr = new XMLHttpRequest(); 
    xhr.open("GET", "data_2.json"); 
    xhr.onload = function() { 
        var jsdata = JSON.parse(xhr.responseText);
        console.log(jsdata);
        display(jsdata);
    }; 
    xhr.onerror = function() { alert("ERROR!"); }; 
    xhr.send();
}

function display(people){
    let showdiv = document.getElementById("people")
    showdiv.style.fontSize = "1.5em";
    showdiv.style.padding = "1em";
    for(let i =0; i< people.length;i++){
        
        let temp = document.createElement("p");
        temp.innerHTML = people[i].first_name + " " + people[i].last_name + " | Age: "+ people[[i]].age + " | Female: " + people[i].female;;
        showdiv.appendChild(temp);
    }
}
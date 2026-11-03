window.onload = pageLoad;

function pageLoad(){
	document.getElementById('showData').onclick = getData;
}

async function getData(){
	const response = await fetch("\showDB");
	const content = await response.json();
	showTable(content);
}

function showTable(data){
	if (data.length == 0){
		alert("No data found");
		return;
	}
	
	let keys = Object.keys(data[0]);
	let tablearea = document.getElementById("table")
	let table = document.createElement("table");
	let tr = document.createElement("tr");
	for (let i = 0; i <keys.length; i++) {
		let th = document.createElement("th");
		th.innerHTML = keys[i];
		tr.appendChild(th);
	}
	table.appendChild(tr);
	for (let i=0; i < data.length;i++){
		let tr = document.createElement("tr");
		let temp = data[i];
		for (let j=0;j<keys.length;j++){
			let td = document.createElement("td");
			td.innerHTML = temp[keys[j]];
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	tablearea.innerHTML = "";
	tablearea.appendChild(table);
}
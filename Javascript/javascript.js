const input = document.getElementById("task");
const totalTasks2 = document.getElementById("total");
const completedTasks2 = document.getElementById("finished");
const modal = document.getElementById("modal");
const numberRecentlyDeleted =6;

loadData("totalTasks1") || saveData("totalTasks1", 0);
totalTasks2.innerHTML = loadData("totalTasks1");

loadData("CompletedTasks1") || saveData("CompletedTasks1", 0);
completedTasks2.innerHTML = loadData("CompletedTasks1");

loadData("Apptheme") || saveData("Apptheme", "light");

input.addEventListener("keydown", function(e){
	if(e.keyCode === 13){
		let task = new Task(input.value);
		input.value = "";
		if(task.title.length === 0){
			return
		}
		addTask(taskStore, task, function(){
			let amountofTasks = Number(loadData("totalTasks1")) + 1;
			saveData("totalTasks1", amountofTasks);
			totalTasks2.innerHTML = Number(loadData("totalTasks1"));
			updateTask();
		});
	}
})

function updateTask(){
	console.log("Updated");
	readTask(taskStore, function(tasks){
		let list = document.getElementById("task-list");
		let innerHTML = "";
		for(let i=0; i<tasks.length; i++){
			innerHTML +=`
				<li data-id='${tasks[i].id}' onclick="deleteTaskonClick(this)">
					${tasks[i].title}
				</li>`;
		}
		list.innerHTML = innerHTML;
	});

	readTask(Completed, function(tasks){
		let list = document.getElementById("list");
		let innerHTML = "";
		tasks.reverse();
		for(let i=0; i<Math.min(tasks.length,numberRecentlyDeleted); i++){
			innerHTML +=`
				<li class="invert">
					${tasks[i].title}:<span>${tasks[i].CompletedDate}</span>
				</li>`;
		}
		list.innerHTML = innerHTML;
	});
}

function onload(){
	updateTask();
	updateTheme(loadData("Apptheme"));
	document.body.style.display ="flex";
}

function deleteTaskonClick(element){
	let id = Number(element.dataset.id);
	let task = readOneTask(taskStore, id, function(task){
		let completed1 = new CompletedTask(task.title);
		addTask(Completed, completed1, function(){
			element.classList.add("exit");
			element.addEventListener("animationend", function(){
				deleteTask(taskStore, id, function(){
					let amount = Number(loadData("totalTasks1"))-1;
					saveData("totalTasks1", amount);
					totalTasks2.innerHTML = loadData("totalTasks1");
					let amount1=Number(loadData("CompletedTasks1"))+1;
					saveData("CompletedTasks1",amount1);
					completedTasks2.innerHTML = loadData("CompletedTasks1");
					updateTask();
				});
			});
		});
	});
}


function updateTheme(theme){
	let bgcolor = theme == 'light' ? "255,255,255" : "19,19,19";
	let textcolor = theme == 'light' ?  "12,12,12" : "255,255,255" ;	
	let shadowcolor = theme == 'light' ? "0,0,0" : "255,255,255" ;
	let grad1 = theme == 'light' ? "108,29,103" : "34,173,211";
	let grad2 = theme == 'light' ? "100,25,148" : "32,173,211";
	let sidegrad1 = theme == 'light' ? "255,255,255" : "35,35,35";
	let sidegrad2 = theme == 'light' ? "251,247,247" : "46,46,46";

	let root = document.documentElement;
	root.style.setProperty( "--bg-color", bgcolor);
	root.style.setProperty( "--text-color", textcolor);
	root.style.setProperty( "--shadow-color", shadowcolor);
	root.style.setProperty( "--gradient-1", grad1);
	root.style.setProperty( "--gradient-2", grad2);
	root.style.setProperty( "--sidebar-gradient-1", sidegrad1);
	root.style.setProperty( "--sidebar-gradient-2", sidegrad2);

	document.getElementsByClassName("current-theme")[0].classList.remove("current-theme");
	let activateClass = theme == 'light' ? "light" : "dark";
	document.getElementById(activateClass).classList.add("current-theme");

	saveData("Apptheme", theme); 


	let invertStr = theme == "light" ? "0%" : "100%";
	let icons = document.getElementsByClassName("icon");

	for(let i=0; i < icons.length ; i++){
		icons[i].style.filter= `brightness(100%) invert(${invertStr})`;
	}
}

function Reset(){
	modal.showModal();
}

function closeModal(){
	modal.close();
}

function reset(){
	saveData("totalTasks1", 0);
	totalTasks2.innerHTML = loadData("totalTasks1");

	saveData("CompletedTasks1", 0);
	completedTasks2.innerHTML = loadData("CompletedTasks1");

	deleteAllTask(taskStore);
	deleteAllTask(Completed);
	updateTask();
}
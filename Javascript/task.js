let database;
const taskStore= "Tasks";
const Completed = "CompletedTasks"

function Task(title){
	this.title = title;
}

function CompletedTask(title, date){
	this.title = title;
	this.CompletedDate = getDate();
}

window.onload = function(){
	let req = window.indexedDB.open("SigningOffAppDB",1);
	req.onsuccess = function(){
		database = req.result;
		onload();
	}

	req.onerror = function(event){
		alert("There was an error", event);
	}

	req.onupgradeneeded = function(event){
		let db = req.result;
		console.log("Created Stores");
		let ObjectStore = db.createObjectStore(taskStore, {
			keyPath : 'id',
			autoIncrement : true
		});
		let ObjectStore2 = db.createObjectStore(Completed, {
			keyPath : 'id',
			autoIncrement : true
		});
	}
} 

let Error1 = function(){
	console.log("Error.")
}

function addTask(store, task, success, error = Error1){
	let transaction = database.transaction([store],"readwrite");
	let ObjectStore = transaction.objectStore(store);
	let request = ObjectStore.add(task);
	request.onerror = error;
	request.onsuccess = success;
}

function readTask(store, success, error = Error){
	let transaction = database.transaction([store],"readonly");
	let ObjectStore = transaction.objectStore(store);
	let request = ObjectStore.openCursor();
	request.onerror = error;
	let tasks=[];
	request.onsuccess = function(event){
		let cursor = event.target.result;
		if(cursor){
			let task = cursor.value;
			tasks.push(task);
			cursor.continue();
		}else{
			success(tasks);
		}
    };
}

function readOneTask(store, id, success, error = Error){
	let transaction = database.transaction([store],"readonly");
	let ObjectStore = transaction.objectStore(store);
	let request = ObjectStore.get(id);
	request.onerror = error;
	request.onsuccess = function(){
		success(request.result);
	};
}

function deleteTask(store, id, success, error = Error){
	let transaction = database.transaction([store],"readwrite");
	let ObjectStore = transaction.objectStore(store);
	let request = ObjectStore.delete(id);
	request.onerror = error;
	request.onsuccess = success;
}

function deleteAllTask(store, success, error = Error){
	success = success || function(){
		console.log("Deleted All Tasks");
	}
	let transaction = database.transaction([store],"readwrite");
	let ObjectStore = transaction.objectStore(store);
	let request = ObjectStore.clear();
	request.onerror = error;
	request.onsuccess = success;
}


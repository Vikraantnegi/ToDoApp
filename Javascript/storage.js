function saveData(key, value){
	if(localStorage){
		localStorage.setItem(key, value);
	}else{
		alert("Your browser doesn't support localStorage API.")
	}
}

function loadData(key){
	if(localStorage){
		if(key in localStorage){
			localStorage.getItem(key);
		}
	}else{
		alert("Your browser doesn't support localStorage API.")
	}
}
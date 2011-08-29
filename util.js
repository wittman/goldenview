/*
Util - Logging
*/
var logging = false;

function log(txt) {
  if(logging) {
    console.log(txt);
  }
}

/*
Util - Storage
*/
function set_item(key, value) {
	try{
		window.localStorage.removeItem(key);
		window.localStorage.setItem(key, value);
	}catch(e){
		log(e);
	}
}

function get_item(key){
	var v;
	try{
		v = window.localStorage.getItem(key);
	}catch(e){
		log(e);
		v = null;
	}
	return v;
}
function del_item(key) {
	try{
		window.localStorage.removeItem(key);
	}catch(e){
		log(e);
	}
	log("Return from removeItem" + key);
}
function stor_clear(){
	log('about to clear local storage');
	window.localStorage.clear();
	log('cleared');
}
function stor_del(name){
	del_item(name);
}
function stor_set(name, value){
	set_item(name, value);
}
function stor_get(name, dfault){
	var v = get_item(name);
	if(v == null){
		return dfault;
	}else{
		return v;
	}
}
function clear_session(){
  var data = sessionStorage.getItem('err_mes');
  console.log(data);
  console.log('hello');
  console.log(texts[0]);
  sessionStorage.clear();
  // localStorage.clear();
}
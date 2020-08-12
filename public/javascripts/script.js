// window.onkeydown = function(e) {
//     if (e.keyCode == 32 && e.target == document.body) {
//       console.log(e.target);
//       e.preventDefault();
//     }
//   };

document.onkeydown = function () {
    if (event.keyCode == 32) {
        return false;
    }
}
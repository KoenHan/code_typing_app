// const log = document.getElementById("log-data");
// const input = document.getElementById("input");
const texts_ele = document.getElementById("text");

// const texts = [
//     // "#include <stdio.h>",
//     // "using namespace std;",
//     // "int main(){",
//     // "print(\"Hello World!\");",
//     // "return 0;",
//     // "}"
//     "Hello", "everyone!", "My", "name", "is", "park."
// ];



// (function(){
    const texts = $("#main").data("texts");
    console.log("texts type");
    console.log(typeof(texts));
    console.log(texts[3]);
    console.log(texts[4]);
    console.log(texts[5]);
// }).call(this);

// 要素追加
for(let i = 0; i < texts.length; i++){
    const text_html = document.createElement("pre");
    text_html.textContent = texts[i];
    text_html.id = "text-"+i;
    texts_ele.appendChild(text_html);
    // const space = document.createElement("span");
    // space.textContent = " ";
    // texts_ele.appendChild(space);
    // const br = document.createElement("br");
    // texts_ele.appendChild(br);
}

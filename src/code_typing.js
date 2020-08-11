const download_texts =[
    "#include <bits/stdc++.h>",
    "using namespace std;",
    "using ll = long long;",
    "",
    "int main()",
    "{",
    "    ios::sync_with_stdio(false);",
    "    cin.tie(0);",
    "",
    "    return 0;",
    "}",
];

const start_button = document.getElementById("start_button");
const displayed_countdown = document.getElementById("displayed_countdown");
const typed_lines = document.getElementById("typed_lines");
const target_line = document.getElementById("target_line");
const untyped_lines = document.getElementById("untyped_lines");

function ready()
{
    start_button.style.visibility = "hidden";
    let countdown = 3;
    let readytimer = setInterval(() => {
        displayed_countdown.innerHTML = countdown;
        countdown--;
    }, 1000);
    setTimeout(() => {
        clearInterval(readytimer);
        start_game();
    }, (countdown+1)*1000);
}

function start_game()
{
    mistake = 0;
    correct = 0;
    init_display_code();
    let limit = 90;
    displayed_countdown.innerHTML = "Limit : " + limit;
    let limittimer = setInterval(() =>{
        limit--;
        displayed_countdown.innerHTML = "Limit : " + limit;
    }, 1000);
    setTimeout(() =>{
        clearInterval(limittimer);
        finish_typing();
    }, limit*1000);
}

function init_display_code()
{
    // typed_lines.clear()
    while(typed_lines.firstChild)
    {
        typed_lines.removeChild(typed_lines.firstChild);
    }
    // target_line.clear()
    while(target_line.firstChild)
    {
        target_line.removeChild(target_line.firstChild);
    }
    // untyped_lines.clear()
    while(untyped_lines.firstChild)
    {
        untyped_lines.removeChild(untyped_lines.firstChild);
    }
    // untyped_lines.append(download_texts)
    for(let i=0; i<download_texts.length; i++)
    {
        const line = document.createElement("pre");
        line.textContent = download_texts[i];
        untyped_lines.appendChild(line);
    }
}

function finish_typing()
{
}
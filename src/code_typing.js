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

const RED = "#DC143C";
const GREEN = "#228B22";
const RETURN = "\u23CE";

const start_button = document.getElementById("start_button");
const displayed_countdown = document.getElementById("displayed_countdown");
const typed_lines = document.getElementById("typed_lines");
const target_line = document.getElementById("target_line");
const untyped_lines = document.getElementById("untyped_lines");
const displayed_score = document.getElementById("displayed_score");

let mistype = 0;
let correct = 0;
let is_running = false;
let target_words = "";
let target_char_idx = 0;

function ready()
{
    start_button.style.visibility = "hidden";
    displayed_score.innerHTML = "";
    let countdown = 3;
    displayed_countdown.innerHTML = countdown;
    let readytimer = setInterval(() => {
        countdown--;
        displayed_countdown.innerHTML = countdown;
        if(countdown <= 0)
        {
            clearInterval(readytimer);
            start_game();
        }
    }, 1000);
}

function start_game()
{
    mistype = 0;
    correct = 0;
    target_words = "";
    target_char_idx = 0;
    is_running = true;
    init_display_code();
    document.addEventListener("keypress", listening_type)
    let limit = 90;
    displayed_countdown.innerHTML = "Limit : " + limit;
    let limittimer = setInterval(() =>{
        limit--;
        displayed_countdown.innerHTML = "Limit : " + limit;
        if(limit <= 0 || !is_running)
        {
            clearInterval(limittimer);
            finish_typing();
        }
    }, 1000);
}

function init_display_code()
{
    clear_code();

    for(let i=0; i<download_texts.length; i++)
    {
        const line = document.createElement("span");
        line.textContent = download_texts[i];
        if(download_texts[i] == "")
        {
            line.style.visibility = "hidden";
            line.textContent = "Han Koen";
        }
        untyped_lines.appendChild(line);
    }
    update("enter");
}

function clear_code()
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
}

function finish_typing()
{
    clear_code();
    displayed_countdown.innerHTML = "";
    start_button.style.visibility = "visible";

    displayed_score.innerHTML = "correct: " + correct + "<br>mistype: " + mistype + "<br>percent: " + (correct / (correct + mistype) * 100).toFixed(1) + "%";
}

function listening_type(keypress_event)
{
    let key_str;
    if(keypress_event.keyCode == 13) key_str = "enter"
    else key_str = String.fromCharCode(keypress_event.keyCode);
    update(key_str);
}

function update(key_str)
{
    if(target_words.length == target_char_idx && !untyped_lines.firstChild)
    {
        is_running = false;
        return;
    }
    let back_color;
    if(target_words.length == target_char_idx && key_str == "enter")
    {
        correct++;
        target_char_idx = 0;
        const line = document.createElement("span");
        if(target_words != "") line.textContent = target_words;
        else
        {
            line.textContent = "Han Koen";
            line.style.visibility = "hidden";
        }
        typed_lines.appendChild(line);
        if(untyped_lines.firstChild.style.visibility != "hidden") target_words = untyped_lines.firstChild.textContent;
        else target_words = "";
        remove_last_whitespace();
        target_char_idx = skip_first_whitespace(target_words);
        untyped_lines.removeChild(untyped_lines.firstChild);
        back_color = GREEN;
    }
    else if(key_str == target_words[target_char_idx])
    {
        correct++;
        target_char_idx++;
        back_color = GREEN;
    }
    else
    {
        mistype++;
        back_color = RED;
    }
    // target_line.clear()
    while(target_line.firstChild)
    {
        target_line.removeChild(target_line.firstChild);
    }
    const before = document.createElement("span");
    before.textContent = target_words.substring(0, target_char_idx);
    before.style.display = "inline";
    target_line.appendChild(before);
    const target = document.createElement("span");
    if(target_words.length == target_char_idx) target.textContent = RETURN;
    else target.textContent = target_words[target_char_idx];
    target.style.backgroundColor = back_color;
    target.style.display = "inline";
    target_line.appendChild(target);
    const after = document.createElement("span");
    after.textContent = target_words.substring(target_char_idx+1, target_words.length);
    after.style.display = "inline";
    target_line.appendChild(after);
}

function remove_last_whitespace()
{
    let removed_whitespace_str = "";
    let wstmp = "";
    for(let i=0; i<target_words.length; i++)
    {
        if(target_words[i] == " ") wstmp += target_words[i];
        else
        {
            removed_whitespace_str += wstmp + target_words[i];
            wstmp = "";
        }
    }
    target_words = removed_whitespace_str;
}

function skip_first_whitespace(words)
{
    let idx = 0;
    for(; idx < words.length; idx++)
    {
        if(words[idx] != " ") break;
    }
    return idx;
}
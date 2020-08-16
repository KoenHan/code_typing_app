const download_texts = $("#main").data("texts");
const ext = $("#main").data("ext");

const RED = "#FF82B2";
const WHITE = "#FFFFFF";
const GREEN = "#99FF99";
const GRAY = "#808080";
const RETURN = "\u23CE";

const start_message = document.getElementById("start_message");
const limit_message = document.getElementById("limit_message");
const selected_limit_time = document.getElementById("selected_limit_time");
const start_countdown = document.getElementById("start_countdown");
const displayed_countdown = document.getElementById("displayed_countdown");
const typed_lines = document.getElementById("typed_lines");
const target_line = document.getElementById("target_line");
const untyped_lines = document.getElementById("untyped_lines");
const displayed_score = document.getElementById("displayed_score");
const code = document.getElementById("code");
const comment_ele = document.createElement("span");
comment_ele.textContent = "";

let mistype = 0;
let correct = 0;
let is_running = false;
let target_words = "";
let target_char_idx = 0;
let start_time;
let end_time;
let reserved_words = {};

window.onload = () => {
    document.addEventListener("keypress", waiting_space, false);
}

function waiting_space(keypress_event)
{
    keypress_event.preventDefault();
    if(keypress_event.keyCode == 32)
    {
        ready();
        document.removeEventListener("keypress", waiting_space);
    }
}

function ready()
{
    start_message.style.display = "none";
    limit_message.style.display = "none";
    displayed_score.innerHTML = "";
    let countdown = 3;
    start_countdown.innerHTML = countdown;
    let readytimer = setInterval(() => {
        countdown--;
        start_countdown.innerHTML = countdown;
        if(countdown <= 0)
        {
            clearInterval(readytimer);
            start_game();
        }
    }, 1000);
}

function start_game()
{
    code.style.display = "block";
    target_words = "";
    target_char_idx = 0;
    is_running = true;
    init_display_code();
    correct = 0;
    mistype = 0;
    document.addEventListener("keypress", listening_type, false);
    start_time = performance.now();
    let limit = selected_limit_time.value;
    start_countdown.innerHTML = "";
    if(limit == 0)
    {
        displayed_countdown.innerHTML = "";
    }
    else
    {
        displayed_countdown.innerHTML = "Limit : " + limit;
        let limittimer = setInterval(() =>{
            limit--;
            displayed_countdown.innerHTML = "Limit : " + limit;
            if(!is_running)
            {
                clearInterval(limittimer);
                finish_typing(); 
            }
            else if(limit <= 0)
            {
                is_running = false;
                clearInterval(limittimer);
                finish_typing();
            }
        }, 1000);
    }
}

function remove_CR(str)
{
    let res = "";
    for(let i=0; i<str.length; i++)
    {
        let c = escape(str.substring(i, i+1));
        if(c != "%0D" && c != "%0A")
        {
            res += str.substring(i, i+1);
        }
    }
    return res;
}

function init_display_code()
{
    clear_code();

    for(let i=0; i<download_texts.length; i++)
    {
        const line = document.createElement("span");
        line.style.display = "block";
        let text = remove_CR(download_texts[i]);
        line.textContent = text;
        line.style.color = GRAY;
        if(text == "")
        {
            line.style.visibility = "hidden";
            line.textContent = "koren";
        }
        untyped_lines.appendChild(line);
    }
    update("enter");
    while(is_whitespace_only(target_words) && comment_ele.textContent != "") update("enter");
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
    document.removeEventListener("keypress", listening_type);
    end_time = performance.now();
    clear_code();
    start_message.style.display = "block";
    limit_message.style.display = "flex";
    code.style.display = "none";

    setTimeout(() => {
        document.addEventListener("keypress", waiting_space, false);
    }, 1500);
    displayed_countdown.innerHTML = "";

    displayed_score.innerHTML =
        "<h4 class=\"text-center\">Result</h4>" +
        "<div class=\"t-out\">" +
        "<table class=\"table table-bordered table-striped bg-white t-in w-25\">" +
        "<tbody>" +
        "  <tr>" +
        "    <th scope=\"row\">time</th>" +
        "    <td>" + ((end_time - start_time) / 1000).toFixed(1) + "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th scope=\"row\">CPS</th>" +
        "    <td>" + (correct / ((end_time - start_time) / 1000)).toFixed(1) + "</td>" +
        "  </tr>" +
        "  <tr>" +
        "    <th scope=\"row\">correct</th>" +
        "    <td>" + correct + "</td>" +
        "  </tr>" +
        "    <tr>" +
        "    <th scope=\"row\">wrong</th>" +
        "    <td>" + mistype + "</td>" +
        "  </tr>" +
        "  </tr>" +
        "    <tr>" +
        "    <th scope=\"row\">accuracy</th>" +
        "    <td>" + (correct / (correct + mistype) * 100).toFixed(1) + "%</td>" +
        "  </tr>" +
        "</tbody>" +
        "</div>" +
        "</table>";
}

function listening_type(keypress_event)
{
    let key_str;
    if(keypress_event.keyCode == 13) key_str = "enter"
    else key_str = String.fromCharCode(keypress_event.keyCode);
    update(key_str);
    while(is_whitespace_only(target_words) && comment_ele.textContent != "") update("enter");
    keypress_event.preventDefault();
}

function is_whitespace_only(str)
{
    let count = 0;
    for(let i=0; i<str.length; i++)
    {
        if(str[i] == " ") count++;
    }
    return (str.length == count);
}

function update(key_str)
{
    if(target_words.length == target_char_idx && !untyped_lines.firstChild)
    {
        is_running = false;
        finish_typing();
        return;
    }
    let back_color;
    if(target_words.length == target_char_idx && key_str == "enter")
    {
        correct++;
        target_char_idx = 0;
        const line = document.createElement("span");
        if(target_words != "" || comment_ele.textContent != "") line.textContent = target_words + comment_ele.textContent;
        else
        {
            line.textContent = "koren";
            line.style.visibility = "hidden";
        }
        line.classList.add(ext);
        hljs.highlightBlock(line);
        line.style.backgroundColor = WHITE;
        typed_lines.appendChild(line);
        target_words = "";
        comment_ele.textContent = "";
        if(untyped_lines.firstChild.style.visibility != "hidden")
        {
            const ele = document.createElement("span");
            ele.textContent = untyped_lines.firstChild.textContent;
            ele.classList.add(ext);
            hljs.highlightBlock(ele);
            while(ele.firstChild)
            {
                if($(ele.firstChild).hasClass("hljs-comment"))
                {
                    comment_ele.textContent = ele.firstChild.textContent;
                }
                else
                {
                    target_words += ele.firstChild.textContent;
                }
                ele.removeChild(ele.firstChild);
            }
        }
        if(!is_whitespace_only(target_words)) remove_last_whitespace();
        target_char_idx = skip_first_whitespace(target_words);
        console.log(target_words);
        console.log(comment_ele.textContent);
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
    before.classList.add(ext);
    hljs.highlightBlock(before);
    before.style.backgroundColor = WHITE;
    before.style.display = "inline";
    target_line.appendChild(before);
    const target = document.createElement("span");
    if(target_words.length == target_char_idx)
    {
        target_line.appendChild(comment_ele);
        target.textContent = RETURN;
    }
    else target.textContent = target_words[target_char_idx];
    target.style.backgroundColor = back_color;
    target_line.appendChild(target);
    const after = document.createElement("span");
    after.textContent = target_words.substring(target_char_idx+1, target_words.length);
    after.style.color = GRAY;
    target_line.appendChild(after);
    if(target_words.length != target_char_idx) target_line.appendChild(comment_ele);
    target_line.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
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
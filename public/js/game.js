//game board
const game = document.getElementById('hunnit-hens');
const board = document.getElementById('board');
const chickens = document.getElementById('chicken-board')
const timer_bar = document.getElementById("timer");
const countdown = document.getElementById('countdown');
const gridBoxes = document.getElementsByClassName("grid-box");
const resultScreen = document.getElementById('result-screen');
const finalScore = document.getElementById('final-score');

//game
var chickenCount = 0
function updateCount() {
    chickenCount = chickenCount + 1;
    document.getElementById("chicken-count").innerHTML = "Chickens: " + chickenCount;
}

function hatch() {
    this.setAttribute("onclick", null);
    this.classList.remove('grass');

    this.classList.add('chicken');
    updateCount();
}

function makeGrid(row, col) {
    board.style.setProperty('--grid-cols', col);
    board.style.setProperty('--grid-rows', row);

    for (i = 0; i < (row * col); i++) {
        let cell = document.createElement("div");
        cell.classList.add("grid-box");
        cell.classList.add("grass");
        board.appendChild(cell);
    }
}

function showResult() {
    finalScore.innerHTML = 'You hatched ' + chickenCount + ' chickens! \n Insert a username to submit your score on the leaderboards!';
    resultScreen.style.setProperty('display', 'inline-flex');
}

function timer(time) {
    time = time * 1000;
    var bar = 100 / time;
    var t = 1;
    timer_bar.style.setProperty('visibility', 'visible')
    timer_bar.style.setProperty('--time', "100%")
    var timer = setInterval(() => {
        if (t >= time) {
            for (let box of gridBoxes) {
                box.setAttribute("onclick", null);
            }
            timer_bar.style.setProperty('visibility', 'hidden')
            clearInterval(timer);
            showResult();
        } else {
            timer_bar.style.setProperty('--time', ((time - t)*bar) + "%")
            t+=10;
        }
    }, 10)
}
async function newScore(e) {
    e.preventDefault();
    let obj = {};
    let data = new FormData(e.target);
    data.append("score", chickenCount);
    data.forEach((value, key) => {
        obj[key] = value;
    });
    var json = JSON.stringify(obj);
    console.log(json)
    let post = await fetch('/newscore', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: json
    });
}

function newGame() {
    makeGrid(10, 10)
    var cell = document.getElementsByClassName('grid-box')
    var c = 3
    let startCD = setInterval(() => {
        countdown.innerHTML = c;
        if (c == 0) {
            cell.onclick = hatch;
            clearInterval(startCD);
            countdown.style.setProperty("display", "none");
            for (let box of gridBoxes) {
                box.onclick = hatch;
            }
            timer(5)
        } else {
            c--;
        }
    }, 1000)
}

const start_menu = document.getElementById('start-menu');
if (start_menu) {
    start_menu.addEventListener('click', () => {
        location.href = "/game";
    })
}

window.onload = newGame()
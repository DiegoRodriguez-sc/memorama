const d = document,
  $tablero = d.querySelector("#tablero"),
  $btn = d.querySelector(".btn");

let selections = [];
let icons = [];
// steps var
const $step = d.querySelector(".steps");
const $bestTime = d.querySelector(".bestTime");
let steps =0;
let win = [];

// cronometro------------------------------------------------------------------------------------------------------------------

let h = 0, m = 0, s = 0;
const $tempo= d.querySelector(".tempo");
$tempo.innerHTML="00:00:00";

const  time = ()=>{
start();
id = setInterval(start,1000);
}

const  start = () =>{

let hAux, mAux, sAux;
s++;
if (s>59){m++;s=0;}
if (m>59){h++;m=0;}
if (h>24){h=0;}

if (s<10){sAux="0"+s;}else{sAux=s;}
if (m<10){mAux="0"+m;}else{mAux=m;}
if (h<10){hAux="0"+h;}else{hAux=h;}

$tempo.innerHTML = `${hAux} : ${mAux} : ${sAux}`; 
}

const restart = () =>{
  clearInterval(id);
  $tempo.innerHTML="00:00:00";
  h=0;m=0;s=0;
}

// game------------------------------------------------------------------------------------------------------------------

const loadingIcons = () => {

  icons = [
    `<img src="./assets/apple-alt-solid.svg" alt="apple">`,
    `<img src="./assets/bug-solid.svg" alt="bug">`,
    `<img src="./assets/car-side-solid.svg" alt="car">`,
    `<img src="./assets/cat-solid.svg" alt="cat">`,
    `<img src="./assets/ghost-solid.svg" alt="ghost">`,
    `<img src="./assets/lightbulb-solid.svg" alt="lightbulb">`,
    `<img src="./assets/music-solid.svg" alt="music">`,
    `<img src="./assets/skull-crossbones-solid.svg" alt="skull">`,
    `<img src="./assets/sun-regular.svg" alt="sun">`,
    `<img src="./assets/user-astronaut-solid.svg" alt="astronaut">`,
    `<img src="./assets/yin-yang-solid.svg" alt="yingYang">`,
    `<img src="./assets/trash-alt-regular.svg" alt="trash">`,
  ];

}

 const winner = () =>{
      clearInterval(id);
      const scoreTimeAndStep = {
        time:$tempo.textContent,
        step:steps,
      }
      const data = localStorage.getItem("score");
      if(data == null){
        localStorage.setItem("score",JSON.stringify(scoreTimeAndStep));
      }else{
        const datos = JSON.parse(data);
        if(datos.time > $tempo.textContent ){
            datos.time = $tempo.textContent;
            datos.step = steps;
            localStorage.setItem("score",JSON.stringify(datos));
            $bestTime.textContent = `${datos.time} - ${datos.step}`;
        }else{
          if(datos.time == $tempo.textContent){
            if(datos.step > steps){
              datos.step = steps;
              localStorage.setItem("score",JSON.stringify(datos));
              $bestTime.textContent = `${datos.time} - ${datos.step}`;
            }
          }
        }
      }
 }

const  generarTablero = () => {
  let scoreActual = localStorage.getItem("score");
  if(scoreActual == null ){$bestTime.textContent="n/a"}
  else{
    let bestScore = JSON.parse(scoreActual);
    $bestTime.textContent = `${bestScore.time} - ${bestScore.step} `;
  }
  let cardsNumbers = [];
  loadingIcons();
  $step.innerHTML = steps;
  for (let i = 0; i < 24; i++) {
    cardsNumbers.push(`
            <div class="card-body" onclick="handleCard(${i})">
                <div class="card" id="cardNumber-${i}">
                    <div class="face back" id="backNumber-${i}">
                         ${icons[0]}
                    </div>
                    <div class="face front">
                        <img src="./assets/question-circle-regular.svg" alt="trash">
                    </div>
                </div>
            </div>        
    `);
    if (i % 2 == 1) {
      icons.splice(0, 1);
    }
  }
  cardsNumbers.sort(() => Math.random() - 0.5);
  $tablero.innerHTML = cardsNumbers.join(" ");
  time();
}

function handleCard(num) {
  steps++;
  let $card = document.getElementById(`cardNumber-${num}`);
  if ($card.style.transform != "rotateY(180deg)") {
    $card.style.transform = "rotateY(180deg)";
    selections.push(num);
  }
  if (selections.length == 2) {
    deselect(selections);
    selections = [];
  }
  $step.innerHTML = steps;
}

function deselect(selectNumber) {
  setTimeout(() => {
    let backCardOne = document.getElementById(`backNumber-${selectNumber[0]}`);
    let backCardTwo = document.getElementById(`backNumber-${selectNumber[1]}`);
    if (backCardOne.innerHTML != backCardTwo.innerHTML) {
      let $cardOne = document.getElementById(`cardNumber-${selectNumber[0]}`);
      let $cardTwo = document.getElementById(`cardNumber-${selectNumber[1]}`);
      $cardOne.style.transform = "rotateY(0deg)";
      $cardTwo.style.transform = "rotateY(0deg)";
    } else {
      backCardOne.style.background = "#2C2C2C";
      backCardTwo.style.background = "#2C2C2C";
      win.push(backCardOne);
      win.push(backCardTwo);
      if(win.length == 24){
        winner();
      }
    }
  }, 1000);
}

d.addEventListener("DOMContentLoaded",()=>{
  generarTablero();
})

$btn.addEventListener("click",()=>{
  steps=0;
  win=[];
  restart();
  generarTablero();
})


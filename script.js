
let lastTime = 0;
let lastDirection = '';
const speed = 4;
let score = 0;
let pause = false;
let food = null;
const step = 20;
const X = 30;
const Y = 20;
const minX = 0;
const maxX = X*step;
const minY = 0;
const maxY = Y*step;
const beginPosition = {
    x: 0,
    y: 0,
    direction: 'ArrowRight',
};

let nextPosition =  {};

const bodySnake = [];

const left = ()=> nextPosition.x -= step;
const right = ()=> nextPosition.x += step;
const up = ()=> nextPosition.y -= step;
const down =  ()=> nextPosition.y += step;
const pauseCommand = () =>{ pause = !pause};

const commandsDirection = {
    'ArrowLeft':  left,
    'ArrowUp':  up  ,
    'ArrowRight': right,
    'ArrowDown': down,
};

const commandsAction = {
    'Space': pauseCommand,
}

let currentDirection = null;

function initialize( ) {
    nextPosition = {...beginPosition };
    currentDirection =  commandsDirection[beginPosition.direction];
    bodySnake.push(beginPosition);
;
    pause = false;
}

function calcScore(value=10){
    const scoreItem = document.getElementById('score');
    score+=value;
    scoreItem.lastChild.textContent = score;
}

function resetScore(){
    score = 0;
}

function configure(){
    const game = document.getElementById('game');
    game.style.width = maxX+2;
    game.style.height = maxY;
    game.style.top = `${window.screen.height-window.screen.height+100}px`;
    game.style.left = '25%';
}

function getRandomInt(min, max) {
    const between = (max-min)/step;
    return min+Math.floor(Math.random()*between)*step;
}

function createFood(){
    if(!food){
        const x = getRandomInt(minX, maxX);
        const y = getRandomInt(minY, maxY);
        for(let i=0; i< bodySnake.length;i++){
            if(bodySnake[i].x === x && bodySnake[i].y === y){
                return;
            }
        }
        food = {x,y};
    }
}

function draw() {
    const game = document.getElementById('game');
    bodySnake.forEach((piece,i)=>{
        const img = document.createElement('img');
        img.setAttribute('src','square.png');
        img.setAttribute('id',i);
        img.style.left = piece.x;
        img.style.top = piece.y;
        game.appendChild(img);
    });
    if(!food){
        createFood();
        const foodImg = document.createElement('img');
        foodImg.setAttribute('src','square.png');
        foodImg.setAttribute('id','food');
        foodImg.style.left = food.x;
        foodImg.style.top = food.y;
        game.appendChild(foodImg);
    }
}

function eatFoodBySnake(){
    if(!food) return;
    if(bodySnake[0].x === food.x && bodySnake[0].y === food.y){
        food = null;
        const segment = {
            ...bodySnake[bodySnake.length-1],
        }
        bodySnake.push(segment);
        const game = document.getElementById('game');
        const foodImg = document.getElementById('food');
        foodImg.remove();
        calcScore(100);
    }
}

function del(){ 
    for(let i = 0; i < bodySnake.length;i++ ){
      const img = document.getElementById(i);
      if(img) img.remove();
    }   
}

function reset(){
    del();
    initialize();
    resetScore();
}
function endGame(){
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = score;  
    const modal = document.getElementById('modal');
    modal.style.display='flex';
    pause = true;
}

function verifyLimits() {
    if(
         nextPosition.y === minY-step ||
         nextPosition.y === maxY || 
         nextPosition.x === minX-step || 
         nextPosition.x === maxX 
    ){
        endGame();
    }
}

function updateSnake(){
    for(let i= 4; i< bodySnake.length;i++){
        if(nextPosition.x === bodySnake[i].x && nextPosition.y === bodySnake[i].y){
            endGame();
        }
    }
    for(let i = bodySnake.length-1; i > 0; i-- ){
        switch(bodySnake[i].direction){
            case 'ArrowLeft':
            case 'ArrowRight':
                bodySnake[i].x = bodySnake[i-1].x;
            break;
            case 'ArrowDown':
            case 'ArrowUp':
                bodySnake[i].y = bodySnake[i-1].y;
            break;
        }
        bodySnake[i].direction = bodySnake[i-1].direction;
    }
    lastDirection = bodySnake[0].direction;
    bodySnake[0] = nextPosition;
    
}
 
function updatePosition(){
        if(!pause){
            updateSnake();
            calcScore();
            verifyLimits();
            currentDirection();
        }
}
        
function action(){

    document.addEventListener('keyup', e=>{

        const direction = commandsDirection[e.code];

        if( direction ){
            if(e.code === 'ArrowLeft' && nextPosition.direction === 'ArrowRight') return;
            if(e.code === 'ArrowRight' && nextPosition.direction === 'ArrowLeft') return;
            if(e.code === 'ArrowUp' && nextPosition.direction === 'ArrowDown') return;
            if(e.code === 'ArrowDown' && nextPosition.direction === 'ArrowUp') return;
            currentDirection = direction;
            nextPosition.direction = e.code;
        } else {

            const commandAction = commandsAction[e.code];

            if(commandsAction){
                commandAction();
            }
        }
    });     
}
function eventClick(){
    document.addEventListener('click',(e)=>{
        if(e.target.id === 'reset') reset();
        else if(e.target.id === 'pause') pause=true;
        else if(e.target.id === 'start') pause=false;
        else if(e.target.id === 'button') {
            reset();
            const modal = document.getElementById('modal');
            modal.style.display = 'none';
            pause = false;
        }
        const menu = document.getElementById('menu');
        if(e.target.id === 'title' && !menu.lastChild.style.display){
            menu.lastChild.style.display = 'flex';
        }else {
            menu.lastChild.style.display = '';
        }
    });
}

function main (currentTime){
    window.requestAnimationFrame(main);
    const second = (currentTime - lastTime)/1000;
    if(second < 1/speed) return;
   
    updatePosition();
    eatFoodBySnake();
    del();
    draw();
    lastTime=currentTime;
}
initialize();
configure();
action();
eventClick();
window.requestAnimationFrame(main);
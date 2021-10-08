let lastTime = 0;
let lastDirection = '';
const speed = 4;
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
}
let nextPosition =  {
   ...beginPosition
}
let bodySnake = [
    beginPosition, 
];

function configure(){
    const game = document.getElementById('game');
    game.style.width = maxX;
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
    }
}

function del(){ 
    const game = document.getElementById('game');
    for(let i = 0; i < bodySnake.length;i++ ){
      const img = document.getElementById(i);
      if(img) img.remove();
    }   
}
function reset(){
    del();
    nextPosition = {...beginPosition };
    bodySnake = [
        beginPosition
    ];
}

function verifyLimits() {
    if(
         nextPosition.y === minY-step ||
         nextPosition.y === maxY || 
         nextPosition.x === minX-step || 
         nextPosition.x === maxX 
    ){
        reset();
    }
}
function updateSnake(){
    for(let i= 4; i< bodySnake.length;i++){
        if(nextPosition.x === bodySnake[i].x && nextPosition.y === bodySnake[i].y){
            reset();
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
    switch(nextPosition.direction){
        case 'ArrowRight':
            nextPosition.x += step;
            break;
        case 'ArrowDown': 
            nextPosition.y += step;
            break;
        case 'ArrowLeft': 
            nextPosition.x -= step;
            break;
        case 'ArrowUp':
                nextPosition.y -= step;
                break;
    }
    verifyLimits();
}
        
        
function action(){
    document.addEventListener('keyup', e=>{
        if( e.code === 'ArrowLeft' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowRight' ||
            e.code === 'ArrowDown'
        ){
            if(e.code === 'ArrowLeft' && nextPosition.direction === 'ArrowRight') return;
            if(e.code === 'ArrowRight' && nextPosition.direction === 'ArrowLeft') return;
            if(e.code === 'ArrowUp' && nextPosition.direction === 'ArrowDown') return;
            if(e.code === 'ArrowDown' && nextPosition.direction === 'ArrowUp') return;
            if(e.code === 'ArrowLeft' && lastDirection === 'ArrowRight') return;
            if(e.code === 'ArrowRight' && lastDirection === 'ArrowLeft') return;
            if(e.code === 'ArrowUp' && lastDirection === 'ArrowDown') return;
            if(e.code === 'ArrowDown' && lastDirection === 'ArrowUp') return;

            nextPosition.direction = e.code;
        }
    });     
}

function main (currentTime){
    window.requestAnimationFrame(main);
    const second = (currentTime - lastTime)/1000;
    if(second < 1/speed) return;
    updateSnake();
    updatePosition();
    eatFoodBySnake();
    del();
    draw();
    lastTime=currentTime;
}
configure();
action();
window.requestAnimationFrame(main);
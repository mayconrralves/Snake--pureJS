let lastTime = 0;
const speed = 1;
let position = 2;
const nextPosition =  {
    x: 100,
    y: 350,
    direction: 'ArrowRight',
}
const lengthSquare = 20;
const step = lengthSquare;
const bodySnake = [
    { ...nextPosition }, 
    { ...nextPosition, x:nextPosition.x-20 }, 
    {...nextPosition, x:nextPosition.x-40 },
    { ...nextPosition, x:nextPosition.x-60 },
    /* { ...nextPosition, x:nextPosition.x-80 },
    { ...nextPosition, x:nextPosition.x-100 },
    { ...nextPosition, x:nextPosition.x-120 },
    { ...nextPosition, x:nextPosition.x-140 },
    { ...nextPosition, x:nextPosition.x-160 },
    { ...nextPosition, x:nextPosition.x-180 }, */
]
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
}
function updateSnake(){
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
}

function del(){ 
    const game = document.getElementById('game');
    for(let i = 0; i < bodySnake.length;i++ ){
      if(game.lastChild) game.removeChild(game.lastChild);
    }
    
}

function action(){
    document.addEventListener('keyup', e=>{
        if(e.code === 'ArrowLeft' && nextPosition.direction === 'ArrowRight') return;
        if(e.code === 'ArrowRight' && nextPosition.direction === 'ArrowLeft') return;
        if(e.code === 'ArrowUp' && nextPosition.direction === 'ArrowDown') return;
        if(e.code === 'ArrowDown' && nextPosition.direction === 'ArrowUp') return;
        nextPosition.direction = e.code;
    });     
}

function main (currentTime){
    window.requestAnimationFrame(main);
    const second = (currentTime - lastTime)/1000;
    if(second < 1/speed) return;
    updateSnake();
    updatePosition()
    
    del();
    draw();
    lastTime=currentTime;
}
action();
window.requestAnimationFrame(main);
// GLOBAL VARIABLES

speed = 6
last_render = 0 
const board1 = document.getElementById('box1')
the_snake = [{ x: 8, y:8}]
add_length = 0
container_size = 15
gameOver = false
lives = 4 
score = 0
number = 1
level = 2

 
document.addEventListener('DOMContentLoaded', function() {
    
    drawSnake(board1)
     lev = document.getElementById('whichLevel').innerHTML = level
     sco = document.getElementById('whichScore').innerHTML = score

})




function secondMain(currentTime) { 
    if(gameOver){ 

        if(confirm('you lost. press ok to restart')){ 
            window.location = ''
        }
        
        return
    }


    window.requestAnimationFrame(secondMain)
    secondsSinceLastRender = (currentTime - last_render) / 1000 
    if(secondsSinceLastRender < 1 / speed) return
    last_render = currentTime

    all() 

    document.onkeydown = checkKey;

    function checkKey(e) {

    if (e.keyCode == '32') {
        alert('game paused')
    }

}

}


document.getElementById('startGame').addEventListener('click', run)
function run() { 
    window.requestAnimationFrame(secondMain)
    
}




        // Storing all the functions inside a single one
function all() { 
    updateSnake() 
    updateFood()
    board1.innerHTML = ''
    drawSnake(board1)
    drawFood(board1)
    checkDeath()    



}

// SNAKE FUNCTIONS
function drawSnake(board1){ 
    the_snake.forEach(element => { 
        const snake = document.createElement('div')
        snake.style.gridRowStart = element.y
        snake.style.gridColumnStart = element.x
        snake.classList.add('snake')
        board1.appendChild(snake)
    })
}


function updateSnake() { 
    addSegments()
    const inputDirection = getInputDirection()
    for(let i = the_snake.length -2; i>=0 ;  i--){ 
        the_snake[ i+1 ] = { ...the_snake[i] }
    }

    the_snake[0].x += inputDirection.x 
    the_snake[0].y += inputDirection.y
    
}

function addSegments(){ 
    for(let i = 0; i< add_length; i++){ 
        the_snake.push({...the_snake[the_snake.length-1]})
    }
    add_length = 0
}

function outsideGrid(position){ 
    return ( 
        position.x < 1 || position.x > container_size || 
        position.y < 1 || position.y > container_size
    )
}

function getSnakeHead() { 
    return the_snake[0]
}

function snakeIntersection() { 
    return onSnake(the_snake[0], { ignoreHead : true })
}


// END OF SNAKE FUNCTIONS  


// INPUT DIRECTION CODE

 number1 = Math.floor(Math.random() * (2 - (-1))) -1
 inputDirection = {x:number1, y:opposite(number1) }
console.log(inputDirection.x)
console.log(inputDirection.y)
 lastInputDirection = {x:0, y:0}

function opposite(number1) { 
    
     number2 = Math.floor(Math.random() * (2 - (-1))) -1
    while(number2===number1 || number1*number2 <0){ 
        number2 = Math.floor(Math.random() * (2 - (-1))) -1
    }
    return number2
}

window.addEventListener('keydown', e=> { 
    switch(e.key){ 
        case 'ArrowUp': 
        //if we are moving up just ignore this
            if(lastInputDirection.y !==0) break
            inputDirection = {x:0, y:-1} //-1 moves upwards
            break 
        case 'ArrowDown': 
            if(lastInputDirection.y !==0) break
            inputDirection = {x:0, y:1} //1 move downwards
            break  
        case 'ArrowLeft': 
            if(lastInputDirection.x !==0) break
            inputDirection = {x:-1, y:0} // -1 moves left 
            break  
        case 'ArrowRight': 
            if(lastInputDirection.x !==0) break
            inputDirection = {x:1, y:0} // 1 moves right
            break  

    }

})




function getInputDirection() { 
    lastInputDirection = inputDirection
    return inputDirection
}

// END OF INPUT DIRECTION CODE 




// FOOD FUNCTIONS
 food = getRandomPosition()
 EXPANSION_RATE = 1


function updateFood() { 
    if(onSnake(food)){ 
        number++;
        speed++;
        score+=20;
        document.getElementById('whichScore').innerHTML = score
        if (number===12){ 
            if(confirm('Congratulations you won the game'))
            window.location = ''
        } 
        
        expandSnake(EXPANSION_RATE)
        food = getRandomPosition()
        
    }
}


function drawFood() { 

    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('middle')
    foodElement.innerHTML = number
    board1.appendChild(foodElement)
}


function expandSnake(amount){ 
    add_length += amount
}


function onSnake(position, {ignoreHead = false} = {}) { 
    
    return the_snake.some((segment, index) => { 
        if(ignoreHead && index === 0) return false
        return equalPositions(segment, position)
        
    })
}



function equalPositions(pos1, pos2) { 
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function getRandomPosition() { 
     let newFoodPosition 
    
    while(newFoodPosition == null || onSnake(newFoodPosition)){ 
        newFoodPosition = getRandomGridPosition() 
    }
    return newFoodPosition
}

function getRandomGridPosition() { 
    return { 
        x: Math.floor(Math.random() * container_size) +1,
        y: Math.floor(Math.random() * container_size) +1
    }
}


// END OF FOOD FUNCTIONS


// GAME OVER 

function checkDeath()
{ 
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}
//  END OF GAME OVER 



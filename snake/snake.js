// GLOBAL VARIABLES

let speed = 4   // The speed of the snake
let last_render = 0 // the last time the page was rendered
let get_box = document.getElementById('box') // storing the box in a variable to be used later on
let the_snake = [{ x: 11, y:11}] // the snake's initial position
let add_length = 0 // The length of the snake to add when growing
let container_size = 21  //The size of the box
let gameOver = false 
let lives = 9 
let score = 0
let number = 1
let level = 1


// Initial appearence of the page
document.addEventListener('DOMContentLoaded', function() {
    
    drawSnake(get_box)
    let lev = document.getElementById('whichLevel').innerHTML = level
    let sco = document.getElementById('whichScore').innerHTML = score

})
// TESTING



// end of testing 


// The main function that triggers the whole animaton and functions of the game
function main(currentTime) {

    //check if we have lost the game 
    if(gameOver){ 
        if(confirm('you lost. press ok to restart')){ 
            window.location = ''
          
        }
        return 
    }

    // Calling requestAnimationFrame again and again(runs everyTime when the browser is ready to make a paint) 
    // request a frame to animate my game
    window.requestAnimationFrame(main) //main is the callback when it's time to animate again
    let secondsSinceLastRender = (currentTime - last_render) / 1000 //converting the time from milliseconds to seconds
    if(secondsSinceLastRender < 1 / speed) return // check if we can move the snake
    last_render = currentTime // updating last Render time

    all() 

    // Pause/play the game
    document.onkeydown = checkKey;
    function checkKey(e) {
    if (e.keyCode == '32') { // when the user clicks on the space bar
        alert('game paused')
    } 

 }

}

//When the user clicks on start, trigger the main function
document.getElementById('startGame').addEventListener('click', run)
function run() { 

    window.requestAnimationFrame(main)
}


// Storing all the functions inside a single one
function all() { 
    upgrade_snake() 
    upgrade_food()
    get_box.innerHTML = ''
    drawSnake(get_box)
    drawFood(get_box)
    checkDeath()    


}

// SNAKE FUNCTIONS

// Making the snake appear
function drawSnake(get_box){ 
    the_snake.forEach(element => { 
        let snake = document.createElement('div')
        snake.style.gridRowStart = element.y
        snake.style.gridColumnStart = element.x
        snake.classList.add('snake')
        get_box.appendChild(snake)
    })
}


// keep track of the behavior if the snake 
function upgrade_snake() { 
    // everytime we update, see if there is any segment and add them
    addSegments()
    let inputDirection = getInputDirection()
    // loop through every segment of the snake except the last one that will eventually disappear 
    for(let i = the_snake.length -2; i>=0 ;  i--){ //grab the second element and move it to be equal to the first element to make the snake move correctly in the same order
 
        the_snake[ i+1 ] = { ...the_snake[i] }
    }
    //update the head based on where we are moving 
    //place the head in the correct x and y axis in the grid 
    the_snake[0].x += inputDirection.x 
    the_snake[0].y += inputDirection.y
    
}


// Expand the snake, add new segments at the bottom of our snake 
function addSegments(){ 
    for(let i = 0; i< add_length; i++){ //loop through all of our segments
        the_snake.push({...the_snake[the_snake.length-1]})  //add segment to the end of the snake 
    }
    add_length = 0 //to avoid the snake of constantly expanding itself, get rid of our new segments 
}

//if we are outside of the grid it will return true
function outsideGrid(position){ 
//check if the the position of the snake is less than 1 which is our minimum grid size
//or greater than our grid size
    return ( 
        position.x < 1 || position.x > container_size || 
        position.y < 1 || position.y > container_size
    )
}

function getSnakeHead() { 
    // get the head of the snake which is the first element 
    return the_snake[0]
}

// check if the head of the snake has touched any parts of it's body
function snakeIntersection() { 
    return onSnake(the_snake[0], { ignoreHead : true })//ignoring the head of the snake
}


// END OF SNAKE FUNCTIONS  


// INPUT DIRECTION CODE

// when clicking on start game, start moving the snake to a random path 
let number1 = Math.floor(Math.random() * (2 - (-1))) -1
let inputDirection = {x:number1, y:opposite(number1) }
console.log(inputDirection.x)
console.log(inputDirection.y)
let lastInputDirection = {x:0, y:0}

// Get opposite numbers
function opposite(number1) { 
    let number2 = Math.floor(Math.random() * (2 - (-1))) -1
    while(number2===number1 || number1*number2 <0){ 
        number2 = Math.floor(Math.random() * (2 - (-1))) -1
    }
    return number2
}

// track which bottom we are clicking 
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



//check the last Arrow that we clicked 
function getInputDirection() { 
    lastInputDirection = inputDirection
    return inputDirection
}

// END OF INPUT DIRECTION CODE 




// FOOD FUNCTIONS
let food = getRandomPosition()
let expand = 1//how much the snake grows when it eats the food

function upgrade_food() { 
    // check if the snake ate the food
    if(onSnake(food)){ 
        number++;
        speed++;
        score+=10;
        document.getElementById('whichScore').innerHTML = score
        if (number===10){ 
            if (window.confirm('Enter Level 2'))
            {
                window.location = 'snake1.html';
            }
            else
            {
                window.location = '';
            }

        } 
        
        expandSnake(expand)
        food = getRandomPosition()
        
    }
}

// Making the food appear 
function drawFood() { 

    let foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('middle')
    foodElement.innerHTML = number
    get_box.appendChild(foodElement)
}


function expandSnake(amount){ 
    // make the snake grow 
    add_length += amount
}

// set ignoreHead to false   
function onSnake(position, {ignoreHead = false} = {}) { // passing an empty object in case we aren't passing anything 
    //if the position of the snake is equal to the position of the food than it's true
    return the_snake.some((segment, index) => { 
        //if we are on the head
        if(ignoreHead && index === 0) return false // because we are completely ignoring the head
        return equalPositions(segment, position)
        
    })
}


//if the snake intersects with the food return true
function equalPositions(pos1, pos2) { 
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function getRandomPosition() { 
    let newFoodPosition 
    
    while(newFoodPosition == null || onSnake(newFoodPosition)){ 
        //keep checking until it finds a new positon 
        newFoodPosition = getRandomGridPosition() // give it a position
    }//when it finds a value that is not on the snake position move it 
    return newFoodPosition
}

function getRandomGridPosition() { 
    return { 
        x: Math.floor(Math.random() * container_size) +1,// calculate a random number between 1 and the size of the grid
        y: Math.floor(Math.random() * container_size) +1// calculate a random number between 1 and the size of the grid
    }
}


// END OF FOOD FUNCTIONS


// GAME OVER 

function checkDeath()
{ 
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}
//  END OF GAME OVER 


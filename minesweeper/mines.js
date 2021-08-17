//1  make sure that all of our html is loaded before running JS code
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flags_count = document.querySelector('#flags-left')
    const winOrLose = document.querySelector('#result')
    let width = 10 // grid width 
    let bomb_count = 20 // bomb count
    let flags = 0
    let squares_amount = [] // create an empty array 
    let game_over = false // initialize game Over to false
    let counter = 0



    function count() {
      counter++;
      document.querySelector('.time').innerHTML = counter;
  }
  
  setInterval(count, 1000);


  let leftButtonDown = false;
  let rightButtonDown = false;
  
  document.addEventListener("mousedown", (e) => {
      // left click
      if (e.button === 0) {
          leftButtonDown = true;
      }
      // right click
      if (e.button === 2) {
          rightButtonDown = true;
      }
  });
  
  document.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
          leftButtonDown = false;
      }
      if (e.button === 0) {
        rightButtonDown = false;
    }
  });

    //create Board
    function create() {
      flags_count.innerHTML = bomb_count
  
      //get shuffled game array with random bombs
      const bomb_a = Array(bomb_count).fill('bomb') //creating an array of 20 indexes and call each one of them bomb with the .fill() method
      const valid_a = Array(width*width - bomb_count).fill('valid') // for the remaining array, create 80 indexes and call each one of them valid with the .fill() method
      const gameArray = valid_a.concat(bomb_a) // join the above arrays together
      const shuffle = gameArray.sort(() => Math.random() -0.5) // mix the above array to get different values each time 
      // calling the .sort() method which accepts a function that returns a value between -0.5 and 0.5 
  
      // 2 loop over the grid
      for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div')// create a divs and define it's height and width in css
        square.setAttribute('id', i) // give an id to each square
        square.classList.add(shuffle[i]) // add the value of each array element as a className for each square
        grid.appendChild(square) // append each square to the grid 
        squares_amount.push(square) // add the items to the end of the array creating  divs
  
        //when we click on a square
        square.addEventListener('click', function(e) {
          click(square) // trigger the function click
        })
  
        //cntrl and left click
        square.oncontextmenu = function(e) {// the oncontextmenu event occurs when the user right clicks on an element to open the context menu
          e.preventDefault() // prevent the default action from happening 
          add_a_flag(square)// trigger a function
        }

        square.oncontextmenu = function(e) {// the oncontextmenu event occurs when the user right clicks on an element to open the context menu
            e.preventDefault() // prevent the default action from happening 
            addQuestionMark(square)// trigger a function
          }

          square.addEventListener("contextmenu", (e) => {
            if (leftButtonDown && rightButtonDown) { //when the 
              if(square.querySelector("[data = '0' ]") || square.classList.contains('flag') || square.classList.contains('questionMark')) return //if it's not checked or contains a flag return
              if (game_over) return // if gameOver do nothing 
              else{ 
                openNeighbours()
              }
              
              e.preventDefault()
             }   
            });

        }
  


      //check every square surrounding each square for bombs to display a number if any 
      //loop over the grid 100 times again
      for (let i = 0; i < squares_amount.length; i++) {
        let total = 0
        const left = (i % width === 0)  //if he square is on the left side of the grid, we want to mkae sure to not 
                                            //care of it's left side square because it will belong to the row above
        const right = (i % width === width -1)// if the square belongs to the right of the grid, 
                                                    // we don't want to take care of it's right side because it will belong to the 
                                                    // row below
  
        // if the square doesn't contain a bomb
        if (squares_amount[i].classList.contains('valid')) {
            //if the index is greater than 0 and not on the left edge add 1 to it
          if (i > 0 && !left && squares_amount[i -1].classList.contains('bomb')) total ++ // check if the left side has a bomb 
          if (i > 9 && !right && squares_amount[i +1 -width].classList.contains('bomb')) total ++ // check if the ttop right side has a bomb
          if (i > 10 && squares_amount[i -width].classList.contains('bomb')) total ++ // check if the top side has a bomb
          if (i > 11 && !left && squares_amount[i -1 -width].classList.contains('bomb')) total ++ // check if the top left side has a bomb 
          if (i < 98 && !right && squares_amount[i +1].classList.contains('bomb')) total ++ // check if the right side has a bomb 
          if (i < 90 && !left && squares_amount[i -1 +width].classList.contains('bomb')) total ++ // check if there is  a bomb on the below left side
          if (i < 88 && !right && squares_amount[i +1 +width].classList.contains('bomb')) total ++ // check if there is a bomb on the below right side 
          if (i < 89 && squares_amount[i +width].classList.contains('bomb')) total ++// check if there is a bomb at the bottom of  the square
          squares_amount[i].setAttribute('data', total)
        }
      }
    }
    create() // calling the function 
  
    //add Flag with right click
    function add_a_flag(square) {
      if (game_over) return // if game is over don't trigger the function
      if (!square.classList.contains('checked') && (flags < bomb_count)) {
        if (!square.classList.contains('flag') && !square.classList.contains('questionMark') ) { // if the square doesn't contain a flag already or a questionMark
          square.classList.add('flag')
          square.innerHTML = ' 🚩'
          flags ++ // increment a flag 
          flags_count.innerHTML = bomb_count- flags // update the number inside my html
          win()
        } else { // if there is already a flag
            square.classList.remove('flag')
             //decrement num of flags
            square.classList.add('questionMark')
            square.innerHTML = '❓'
            if(flags != 0) flags --
            flags_count.innerHTML = bomb_count- flags

        }
      }
    }

function addQuestionMark(square){ 
    if(square.classList.contains('questionMark')){ 
        square.classList.remove('questionMark')
        square.innerHTML = ''
    } else { 
        add_a_flag(square)

    } 
}


  
    //click on square actions
    function click(square) {
      let pk = square.id // get the id of the square
      if (game_over) return // if the game is over and we click a square nothing happens 
      if (square.classList.contains('checked') || square.classList.contains('flag')) return // if we click on a square that is checked or contains a flag nothing happens   //here
      if (square.classList.contains('bomb')) { // if the square contains a bomb gameOver 
        gameOver(square)
      } else { // when we click on a number

        let total = square.getAttribute('data') // grab the data attribute which is the number
        if (total !=0) { // if the square contains a number
          square.classList.add('checked') // add a class of checked to it
          if (total == 1) square.classList.add('one')
          if (total == 2) square.classList.add('two')
          if (total == 3) square.classList.add('three')
          if (total == 4) square.classList.add('four')
          square.innerHTML = total // make the number appear inside the html file
          return // break the cycle
        }
        check(square, pk)// check surroundings of my checked square for recursion
        
      }
      square.classList.add('checked') // for squares_amount that doesn't have any data in it or bomb add checked class to it 
    }
  
  
    //check neighboring squares_amount once square is clicked
    function check(square, pk) {
      const left = (pk % width === 0)
      const right = (pk % width === width -1)
  
      setTimeout(() => { // set timeOut of a millisecond after the function starts running 
        if(square.classList.contains('questionMark')){ 
            square.classList.remove('questionMark')
            square.innerHTML = ''
        }
        if (pk > 0 && !left) {
          const newId = squares_amount[parseInt(pk) -1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk > 9 && !right) {
          const newId = squares_amount[parseInt(pk) +1 -width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk > 10) {
          const newId = squares_amount[parseInt(pk -width)].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk > 11 && !left) {
          const newId = squares_amount[parseInt(pk) -1 -width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk < 98 && !right) {
          const newId = squares_amount[parseInt(pk) +1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk < 90 && !left) {
          const newId = squares_amount[parseInt(pk) -1 +width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk < 88 && !right) {
          const newId = squares_amount[parseInt(pk) +1 +width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (pk < 89) {
          const newId = squares_amount[parseInt(pk) +width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
      }, 10)
    }
  
    //game over
    function gameOver(square) {
      winOrLose.innerHTML = 'Game Over!'

      game_over = true 
  
      //show ALL the bombs
      squares_amount.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣'
          square.classList.remove('bomb')
          square.classList.add('checked')
        }
      })
    }
  
    //check for win
    function win() {
      ///simplified win argument
    let equals = 0
  
      for (let i = 0; i < squares_amount.length; i++) {
        if (squares_amount[i].classList.contains('flag') && squares_amount[i].classList.contains('bomb')) {
          equals ++ // increment by one
        }
        if (equals === bomb_count) { // if the equals equals the bomb amount you win
          winOrLose.innerHTML = 'YOU WIN!'
          game_over = true//end the game 
        }
      }
    } 


  function openNeighbours(){ 
    for (let i = 0; i < squares_amount.length; i++) {
      const left = (i % width === 0)
      const right = (i % width === width -1)
      if (squares_amount[i].classList.contains('valid')) {
        if (i > 0 && !left) click(squares_amount[i -1]) // check  the left side 
        if (i > 9 && !right) click(squares_amount[i +1 -width]) // check  the ttop right side 
        if (i > 10) click(squares_amount[i -width])  // check  the top side has a bomb
        if (i > 11 && !left) click(squares_amount[i -1 -width])  // check  the top left side 
        if (i < 98 && !right) click(squares_amount[i +1]) // check  the right side 
        if (i < 90 && !left) click(squares_amount[i -1 +width]) // check   on the below left side
        if (i < 88 && !right) click(squares_amount[i +1 +width])  // check  on the below right side 
        if (i < 89) click(squares_amount[i +width])// check at the bottom of  the square
     }
    }
   }
})
const ROWS = 17
const COLS = 21

// setting speed of game dynamically
let slider = document.getElementById("slider");
let tick = slider.value

slider.oninput = function() {
   tick = slider.value;
   pauseGame();
   playGame();
}

let grid = newGrid(ROWS,COLS,function(el,row,col){
    // click listener, alive <=> dead
    if (el.getAttribute('alive') === 'false') {
      el.setAttribute('alive', 'true')
    } else if (el.getAttribute('alive') === 'true') {
      el.setAttribute('alive', 'false')
    }
});
document.getElementById("grid-div").appendChild(grid);

let currentlyPlaying = false

function playGame() {

  if (currentlyPlaying === false){

    currentlyPlaying = true;
    game = setInterval(function(){

      // turn html grid into javascript array
      let currentGrid = Array.prototype.map.call(document.querySelectorAll('tr'), function(tr){
        return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
          return td;
          });
        });

      //initialize next grid as with empty 2d array
      let nextGrid = Array(currentGrid.length).fill().map(a=>[]);
      let totalSum = 0;

      //create 2d array of new grid
      for (let r=0; r<currentGrid.length; r++) {
        row = currentGrid[r]
        for (var c=0; c<row.length; c++) {
          let oldCell = row[c]
          const nextCell = oldCell.cloneNode(true)

          //number of alive cells around box (including self)
          let sum = sumAround(nextCell, currentGrid);
          totalSum += sum;

          if (sum === 3) {
            nextCell.setAttribute('alive', 'true')
          } else if (sum === 4) {
            nextCell.setAttribute('alive', oldCell.getAttribute('alive'))
          } else {
            nextCell.setAttribute('alive', 'false')
          }

          nextGrid[r][c] = nextCell;

        }
      }

      //creating html table element from new grid array
      let newGrid = renderNewGrid(nextGrid,function(el){

          if (el.getAttribute('alive') === 'false') {
            el.setAttribute('alive', 'true')
          } else if (el.getAttribute('alive') === 'true') {
            el.setAttribute('alive', 'false')
          }
      });

      //removing old grid from page, adding new grid
      let oldGrid = document.querySelector('#grid');
      oldGrid.parentNode.removeChild(oldGrid);
      document.getElementById("grid-div").appendChild(newGrid);


        //select all alive cells, play tone based on cell position

      document.querySelectorAll("td[alive='true']").forEach(function(cell) {
        //randomly assign timeout for each note
        let beat_wait = Math.floor(Math.random() * 11) * tick / 10;
        let row = parseInt(cell.getAttribute('grid-row'));
        let col = parseInt(cell.getAttribute('grid-col'));

        let new_note = (row * col * 20);
        // let new_note = SCALE1[row][col]
        setTimeout(function(){
        synth.triggerAttackRelease(new_note, 0.1)
      }, beat_wait)
      })



      // if all cells die off, pauses the game
      if (totalSum === 0) {
        pauseGame();
      }
    }, tick)
  }
}


function pauseGame() {
  clearInterval(game);
  currentlyPlaying = false;
}


function newGrid(rows,cols,callback){

    let grid = document.createElement('table');
    grid.className = 'grid';
    grid.id = 'grid'

    for (let r=0; r<rows; ++r){
        let tr = grid.appendChild(document.createElement('tr'));
        for (let c=0; c<cols; ++c){
            let cell = tr.appendChild(document.createElement('td'));

            // set all cells to not alive
            cell.setAttribute('alive', 'false');
            cell.setAttribute('grid-row', `${r}`)
            cell.setAttribute('grid-col', `${c}`)

            cell.addEventListener('click',(function(el,r,c){
                return function(){
                    callback(el,r,c);
                }
            })(cell,r,c),false);
        }
    }

    return grid;
}


//creates html table element based on grid array passed in
function renderNewGrid(nextGrid, callback) {

    let newGrid = document.createElement('table');
    newGrid.className = 'grid';
    newGrid.id = 'grid'

    let row = nextGrid.length
    let col = nextGrid[0].length

    for (let r=0; r<row; ++r){
        let tr = newGrid.appendChild(document.createElement('tr'));
        for (let c=0; c<col; ++c){
            let cell = tr.appendChild(document.createElement('td'));

            //check input array for new grid status
            aliveStatus = nextGrid[r][c].getAttribute('alive');
            cell.setAttribute('alive', aliveStatus);
            cell.setAttribute('grid-row', `${r}`)
            cell.setAttribute('grid-col', `${c}`)

            cell.addEventListener('click',(function(el){
                return function(){
                    callback(el);
                }
            })(cell),false);
        }
    }
    return newGrid;

}


//sums the value of cell + 8 surrounding boxes
function sumAround(cell, currentGrid) {

    const row_length = currentGrid.length
    const col_length = currentGrid[0].length

    let sum = 0;
    let row = cell.getAttribute('grid-row');
    let col = cell.getAttribute('grid-col');

    row = parseInt(row);
    col = parseInt(col);

    //if row/col is out of bounds, loops around to other side of grid
    let prev_row = row - 1;
    if (prev_row < 0) {prev_row = row_length - 1;}

    let next_row = row + 1;
    if (next_row > row_length - 1) {next_row = 0;}

    let prev_col = col - 1;
    if (prev_col < 0) {prev_col = col_length - 1;}

    let next_col = col + 1;
    if (next_col > col_length - 1) {next_col = 0}

    // sums all the true values of the cells surrounding 5
    // 1 2 3
    // 4 5 6
    // 7 8 9
    cell1 = currentGrid[prev_row][prev_col];
    cell2 = currentGrid[prev_row][col];
    cell3 = currentGrid[prev_row][next_col];
    cell4 = currentGrid[row][prev_col];
    cell5 = currentGrid[row][col];
    cell6 = currentGrid[row][next_col];
    cell7 = currentGrid[next_row][prev_col];
    cell8 = currentGrid[next_row][col];
    cell9 = currentGrid[next_row][next_col];

    if (cell1.getAttribute('alive') === 'true') {sum += 1}
    if (cell2.getAttribute('alive') === 'true') {sum += 1}
    if (cell3.getAttribute('alive') === 'true') {sum += 1}
    if (cell4.getAttribute('alive') === 'true') {sum += 1}
    if (cell5.getAttribute('alive') === 'true') {sum += 1}
    if (cell6.getAttribute('alive') === 'true') {sum += 1}
    if (cell7.getAttribute('alive') === 'true') {sum += 1}
    if (cell8.getAttribute('alive') === 'true') {sum += 1}
    if (cell9.getAttribute('alive') === 'true') {sum += 1}

    return sum;
}

function newPreset1Grid(rows, cols, callback) {

    let grid = document.createElement('table');
    grid.className = 'grid';
    grid.id = 'grid'

    for (let r=0; r<rows; ++r){
        let tr = grid.appendChild(document.createElement('tr'));
        for (let c=0; c<cols; ++c){
            let cell = tr.appendChild(document.createElement('td'));

            // preset conditional for alive cells
            if (r == 2 && c == 3 || r == 2 && c == 4 || r == 3 && c == 3 || r == 3 && c == 4 ||
                r == 4 && c == 5 || r == 4 && c == 6 || r == 5 && c == 5 || r == 5 && c == 6 ||
                r == 2 && c == 16 || r == 2 && c == 17 || r == 3 && c == 16 || r == 3 && c == 17 ||
                r == 4 && c == 14 || r == 4 && c == 15 || r == 5 && c == 14 || r == 5 && c == 15 ||
                r == 2 && c == 10 || r == 3 && c == 10  || r == 4 && c == 10 ||
                r == 11 && c == 7 || r == 11 && c == 8 || r == 11 && c == 9 || r == 11 && c == 10 ||
                r == 11 && c == 11 || r == 11 && c == 12 || r == 11 && c == 13 || r == 12 && c == 7 ||
                r == 12 && c == 9 || r == 12 && c == 10 || r == 12 && c == 11 || r == 12 && c == 13 ||
                r == 13 && c == 7 || r == 13 && c == 8 || r == 13 && c == 9 || r == 13 && c == 10 ||
                r == 13 && c == 11 || r == 13 && c == 12 || r == 13 && c == 13) {
                  cell.setAttribute('alive', 'true');
                } else {
                  cell.setAttribute('alive', 'false');
                }
            cell.setAttribute('grid-row', `${r}`)
            cell.setAttribute('grid-col', `${c}`)

            cell.addEventListener('click',(function(el,r,c){
                return function(){
                    callback(el,r,c);
                }
            })(cell,r,c),false);
        }
    }

    return grid;
}

function newPreset2Grid(rows, cols, callback) {

    let grid = document.createElement('table');
    grid.className = 'grid';
    grid.id = 'grid'

    for (let r=0; r<rows; ++r){
        let tr = grid.appendChild(document.createElement('tr'));
        for (let c=0; c<cols; ++c){
            let cell = tr.appendChild(document.createElement('td'));


            // preset conditional for alive cells
            if (  r == 4 && c == 6 || r == 4 && c == 7 || r == 4 && c == 8 || r == 4 && c == 9 ||
                  r == 4 && c == 10 || r == 4 && c == 11 || r == 4 && c == 12 || r == 4 && c == 13 ||
                  r == 5 && c == 6 || r == 5 && c == 8 || r == 5 && c == 9 || r == 5 && c == 10 ||
                  r == 5 && c == 11 || r == 6 && c == 13 || r == 6 && c == 6 || r == 6 && c == 7 ||
                  r == 6 && c == 8 || r == 6 && c == 9 || r == 6 && c == 10 || r == 6 && c == 11 ||
                  r == 6 && c == 12 || r == 6 && c == 13 || r == 12 && c == 7 || r == 12 & c == 8 ||
                  r == 13 && c == 5 || r == 13 && c == 6 || r == 13 && c == 8 || r == 13 && c == 9 ||
                  r == 14 && c == 5 || r == 14 && c == 6 || r == 14 && c == 7 || r == 14 && c == 8 ||
                  r == 15 && c == 6 || r == 15 && c == 7 || r == 5 && c == 13) {
                  cell.setAttribute('alive', 'true');
                } else {
                  cell.setAttribute('alive', 'false');
                }
            cell.setAttribute('grid-row', `${r}`)
            cell.setAttribute('grid-col', `${c}`)

            cell.addEventListener('click',(function(el,r,c){
                return function(){
                    callback(el,r,c);
                }
            })(cell,r,c),false);
        }
    }

    return grid;
}

function newPreset3Grid(rows, cols, callback) {

    let grid = document.createElement('table');
    grid.className = 'grid';
    grid.id = 'grid'

    for (let r=0; r<rows; ++r){
        let tr = grid.appendChild(document.createElement('tr'));
        for (let c=0; c<cols; ++c){
            let cell = tr.appendChild(document.createElement('td'));

            // preset conditional for alive cells
            if (r == 2 && c == 6 || r == 2 && c == 7 || r == 2 && c == 8 || r == 2 && c == 12 ||
                r == 2 && c == 13 || r == 2 && c == 14 || r == 4 && c == 4 || r == 5 && c == 4 ||
                r == 6 && c == 4 || r == 4 && c == 9 || r == 5 && c == 9 || r == 6 && c == 9 ||
                r == 4 && c == 11 || r == 5 && c == 11 || r == 6 && c == 11 || r == 4 && c == 16 ||
                r == 5 && c == 16 || r == 6 && c == 16 || r == 7 && c == 6 || r == 7 && c == 7 ||
                r == 7 && c == 8 || r == 7 && c == 12 || r == 7 && c == 13 || r == 7 && c == 14 ||
                r == 9 && c == 6 || r == 9 && c == 7 || r == 9 && c == 8 || r == 9 && c == 12 ||
                r == 9 && c == 13 || r == 9 && c == 14 || r == 10 && c == 4 || r == 11 && c == 4 ||
                r == 12 && c == 4 || r == 10 && c == 9 || r == 11 && c == 9 || r == 12 && c == 9 ||
                r == 14 && c == 6 || r == 14 && c == 7 || r == 14 && c == 8 || r == 14 && c == 12 ||
                r == 14 && c == 13 || r == 14 && c == 14 || r == 10 && c == 11 || r == 11 && c == 11 ||
                r == 12 && c == 11 || r == 10 && c == 16 || r == 11 && c == 16 || r == 12 && c == 16) {
                  cell.setAttribute('alive', 'true');
                } else {
                  cell.setAttribute('alive', 'false');
                }
            cell.setAttribute('grid-row', `${r}`)
            cell.setAttribute('grid-col', `${c}`)

            cell.addEventListener('click',(function(el,r,c){
                return function(){
                    callback(el,r,c);
                }
            })(cell,r,c),false);
        }
    }

    return grid;
}


function preset1() {

  let grid = newPreset1Grid(ROWS,COLS,function(el,row,col){

      if (el.getAttribute('alive') === 'false') {
        el.setAttribute('alive', 'true')
      } else if (el.getAttribute('alive') === 'true') {
        el.setAttribute('alive', 'false')
      }
  });

  let oldGrid = document.querySelector('#grid');
  oldGrid.parentNode.removeChild(oldGrid);

  document.getElementById("grid-div").appendChild(grid);
}

function preset2() {

    let grid = newPreset2Grid(ROWS,COLS,function(el,row,col){

        if (el.getAttribute('alive') === 'false') {
          el.setAttribute('alive', 'true')
        } else if (el.getAttribute('alive') === 'true') {
          el.setAttribute('alive', 'false')
        }
    });

    let oldGrid = document.querySelector('#grid');
    oldGrid.parentNode.removeChild(oldGrid);

    document.getElementById("grid-div").appendChild(grid);
}

function preset3() {

    let grid = newPreset3Grid(ROWS,COLS,function(el,row,col){

        if (el.getAttribute('alive') === 'false') {
          el.setAttribute('alive', 'true')
        } else if (el.getAttribute('alive') === 'true') {
          el.setAttribute('alive', 'false')
        }
    });

    let oldGrid = document.querySelector('#grid');
    oldGrid.parentNode.removeChild(oldGrid);

    document.getElementById("grid-div").appendChild(grid);
}

//reset grid to all cells dead
function clearGrid() {

  let grid = newGrid(ROWS,COLS,function(el,row,col){

      if (el.getAttribute('alive') === 'false') {
        el.setAttribute('alive', 'true')
      } else if (el.getAttribute('alive') === 'true') {
        el.setAttribute('alive', 'false')
      }
  });

  let oldGrid = document.querySelector('#grid');
  oldGrid.parentNode.removeChild(oldGrid);

  document.getElementById("grid-div").appendChild(grid);

}

//Delay, Filter, and Tone effects
var ping = new Tone.PingPongDelay(0.2, 0.3).toMaster();
var filter = new Tone.Filter(800, "lowpass").connect(ping);
let synth = new Tone.PolySynth(20, Tone.MonoSynth).connect(filter);

synth.set({
				volume: -25,
				oscillator:{
					type:"square"
				},
				envelope:{
					attack:0.3,
					decay:0,
					sustain:1,
					release:0.3
				}
			});

// two scales based on E minor pentatonic
const SCALE1 = [
  ['C2', 'Eb2', 'F2', 'G2', 'Bb2', 'C2', 'Eb2', 'F2', 'G2', 'Bb2', 'C2', 'Eb2', 'F2', 'G2', 'Bb2'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C4', 'Eb4', 'F4', 'G4', 'Bb4'],
  ['C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C5', 'Eb5', 'F5', 'G5', 'Bb5'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C4', 'Eb4', 'F4', 'G4', 'Bb4'],
  ['C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C5', 'Eb5', 'F5', 'G5', 'Bb5'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C4', 'Eb4', 'F4', 'G4', 'Bb4'],
  ['C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C5', 'Eb5', 'F5', 'G5', 'Bb5']
]

const SCALE2 = [
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3'],
  ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C3', 'Eb3', 'F3', 'G3', 'Bb3']
]

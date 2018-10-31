
function playGame() {

    // turn html grid into javascript array
    let currentGrid = Array.prototype.map.call(document.querySelectorAll('tr'), function(tr){
      return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
        return td;
        });
      });

    //initialize next grid as with empty 2d array
    let nextGrid = Array(currentGrid.length).fill().map(a=>[]);

    //create 2d array of new grid
    for (let r=0; r<currentGrid.length; r++) {
      row = currentGrid[r]
      for (var c=0; c<row.length; c++) {
        let oldCell = row[c]
        const nextCell = oldCell.cloneNode(true)

        //number of alive cells around box (including self)
        let sum = sumAround(nextCell, currentGrid);

        if (sum === 3) {
          nextCell.setAttribute('alive', 'true')
        } else if (sum === 4) {
          nextCell.setAttribute('alive', oldCell.getAttribute('alive'))
          //next cell alive property stays the same
        } else {
          nextCell.setAttribute('alive', 'false')
        }

        nextGrid[r][c] = nextCell;

      }
    }

    let newGrid = renderNewGrid(nextGrid,function(el){

        // click listener, alive <=> dead
        if (el.getAttribute('alive') === 'false') {
          el.setAttribute('alive', 'true')
        } else if (el.getAttribute('alive') === 'true') {
          el.setAttribute('alive', 'false')
        }
    });


    let oldGrid = document.querySelector('#grid');
    oldGrid.parentNode.removeChild(oldGrid);


    document.body.appendChild(newGrid);

}




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


function sumAround(cell, currentGrid) {
  //sums the value of cell + 8 surrounding boxes

    const row_length = currentGrid.length
    const col_length = currentGrid[0].length

    let sum = 0;
    let row = cell.getAttribute('grid-row');
    let col = cell.getAttribute('grid-col');

    row = parseInt(row);
    col = parseInt(col);

    //if row/col is out of bounds, loops around to other side of grid
    let prev_row = row - 1;
    if (prev_row < 0) {
      prev_row = row_length - 1;
    }

    let next_row = row + 1;
    if (next_row > row_length - 1) {
      next_row = 0;
    }

    let prev_col = col - 1;
    if (prev_col < 0) {
      prev_col = col_length - 1;
    }

    let next_col = col + 1;
    if (next_col > col_length - 1){
      next_col = 0
    }

    cell1 = currentGrid[prev_row][prev_col];
    cell2 = currentGrid[prev_row][col];
    cell3 = currentGrid[prev_row][next_col];
    cell4 = currentGrid[row][prev_col];
    cell5 = currentGrid[row][col];
    cell6 = currentGrid[row][next_col];
    cell7 = currentGrid[next_row][prev_col];
    cell8 = currentGrid[next_row][col];
    cell9 = currentGrid[next_row][next_col];

    if (cell1.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell2.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell3.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell4.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell5.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell6.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell7.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell8.getAttribute('alive') === 'true') {
      sum += 1
    }
    if (cell9.getAttribute('alive') === 'true') {
      sum += 1
    }

    return sum;
}

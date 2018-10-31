const ROWS = 10
const COLS = 16


let grid = newGrid(ROWS,COLS,function(el,row,col){

    // click listener, alive <=> dead
    if (el.getAttribute('alive') === 'false') {
      el.setAttribute('alive', 'true')
    } else if (el.getAttribute('alive') === 'true') {
      el.setAttribute('alive', 'false')
    }
});

document.body.appendChild(grid);

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

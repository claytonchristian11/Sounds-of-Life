
## Sounds of Life
#### Overview
Based on [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), Sounds of Life is a fun take on the original that adds a different tone to each individual cell. This way, the user can not only visualize the unique properties of the game, but listen along as cells are created and destroyed.

The game follows the original rules to determine whether a cell is alive or not, but it also has a few extra features, such as playing tones for each cell. Another feature is the ability to slow down or speed up the life process. The user is also able to choose which instrument the sounds come from.

#### Functionality
Users will be able to:

- [ ] Populate the grid with live cells
- [ ] Hit play/pause to start/stop the game
- [ ] Watch as grid seamlessly transitions on edges to create an infinite area
- [ ] Listen along as living cells play different tones
- [ ] Speed up or slow down the process via slide bar
- [ ] Observe preset grid patterns with one click

#### Technologies Utilized
 * Vanilla JavaScript for overall structure and game logic
 * Tone.js to provide multiple instruments, easily dictate tone and note length

#### Image of site 
![alt text](https://preview.ibb.co/itOiYV/Screen-Shot-2018-11-07-at-10-01-58-PM.png)

#### Code Snippets
Implemented volatile tick speed by abstracting game play logic from grid, allowing a slide bar to change how fast the game progresses. 
``` javascript
// setting speed of game dynamically
let slider = document.getElementById("slider");
let tick = slider.value

slider.oninput = function() {
   tick = slider.value;
   pauseGame();
   playGame();
}

function playGame() {
    if (currentlyPlaying === false){
    currentlyPlaying = true;
    
    game = setInterval(function(){
    
      //game logic to update grid goes here
    
    }, tick)
  }
}
```

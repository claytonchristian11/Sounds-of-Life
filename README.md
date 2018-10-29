
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
 * HTML5 Canvas to render the grid and manipulate cells
 * Webpack to bundle all modules for usage in browser

#### Implementation Timeline
##### Monday
 - Familiarize self with canvas, get grid to render
 - Walk through logic of game of life, plan implementation

##### Tuesday
 - Work on implementation of game logic, aim for full pause/play functionality
 - Familiarize self with Tone.js

##### Wednesday
 - Add individual tones to each cell (utilizing scales for higher likelihood of sounding pleasant)
 - Work on tones playing only when the cell is alive

##### Thursday
 - Work on color scheme/styling
 - Add slide bar to change speed of the game

##### Friday
 - Finish up previous days' work
 - Add preset grids user is able to select
 - Debug, ensure ease of use, finish styling

##### Weekend
 - Extra time to finish up any MVP not completed during week
 - Bonus features: Ability to change instruments,

---
title: "Creating a Snake game in JavaScript"
description: "SEO"
date: "2022-11-21"
banner:
  src: "../../images/SnakeGameZoomed.png"
  alt: "First Markdown Post"
categories:
  - "application development"
  - "Game"
keywords:
  - "JavaScript"
  - "Development"
  - "Game"
  - "School"
---

## Creating a Snake game in JavaScript

### Introduction

The goal of this project is to create a Snake game in JavaScript. The game will be developed in VanillaJs. The game will be playable on PC and mobile. <a href="https://github.com/WinDyAlphA/Snake" target="_blank">GitHub Repo</a>

### What I learned

- Create a canvas and draw on it
- Create a menu and save the game settings in a cookie
- Create a score system
- Manage Frames Per Second
- Manage collisions, snake, apples, walls.
- Manage keyboard inputs
- Display Sprites in game and manage animations
- Manage sounds and music

---

## Skills

- 1 - Carry out an application development
- 2 - Optimize applications
- 5 - Lead a project
- 6 - Collaborate within an IT team

## The game

The game is a Snake game. The snake is defined as an object:

```js
var snake = {
	// Position of the snake
	x: 160,
	y: 160,

	// speed of the snake. 1 frame = one square covered
	dx: grid,
	dy: 0,
	// the cells of the snake are stored in this grid
	cells: [],

	//snake size. if it eats an apple, its size increases
	maxCells: 4,
};
```

For the random location of the apple, we use the function `getRandomInt(0, sizeMaxRow) * grid,` which returns a random number between 0 and `sizeMaxRow` which is the max number of cells, all multiplied by the size of a cell.

## The Loop

We could have created an animation with `setInterval` as follows:

```js
setInterval(() => {
	// animation code
}, 1000 / 60);
```

but we preferred to use `requestAnimationFrame` to have a more fluid game.

- Animations will be so smooth as its optimized
- Animations in inactive tabs will stop, saving CPU resources

this function: `window.requestAnimationFrame(callback);` taking as argument only its callback. the callback function to call when it’s time to update your animation for the next repaint. We use it like this 👇 <a href="https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame" target="_blank">(Documentation)</a>

```js
function perfectAnimation() {
	// animation
	requestAnimationFrame(perfectAnimation);
}
requestAnimationFrame(perfectAnimation);
```

### User inputs

We use the `keydown` event to detect the user inputs. We use the `event.key` property to detect the key pressed. We use `&& snake.dy === 0` because we don't want the snake to go back on itself.

```js
document.addEventListener("keydown", function (e) {
	if (e.key == "ArrowLeft" && snake.dx === 0) {
		snake.dx = -grid;
		snake.dy = 0;
	}
	// up arrow key
	else if (e.key == "ArrowUp" && snake.dy === 0) {
		snake.dy = -grid;
		snake.dx = 0;
	}
	// right arrow key
	else if (e.key == "ArrowRight" && snake.dx === 0) {
		snake.dx = grid;
		snake.dy = 0;
	}
	// down arrow key
	else if (e.key == "ArrowDown" && snake.dy === 0) {
		snake.dy = grid;
		snake.dx = 0;
	}
});
```

## ia

Ca a été de loin la partie la compliqué, designer un inteligence artificielle permettant de faire jouer le serpent. Nous avons donc décidé de faire un algorithme de type A\*.

```js
let cols = 5; //columns in the grid
let rows = 5; //rows in the grid

let grid = new Array(cols); //array of all the grid points

let openSet = []; //array containing unevaluated grid points
let closedSet = []; //array containing completely evaluated grid points

let start; //starting grid point
let end; // ending grid point (goal)
let path = [];

//heuristic we will be using - Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function heuristic(position0, position1) {
	let d1 = Math.abs(position1.x - position0.x);
	let d2 = Math.abs(position1.y - position0.y);

	return d1 + d2;
}

//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y) {
	this.x = x; //x location of the grid point
	this.y = y; //y location of the grid point
	this.f = 0; //total cost function
	this.g = 0; //cost function from start to the current grid point
	this.h = 0; //heuristic estimated cost function from current grid point to the goal
	this.neighbors = []; // neighbors of the current grid point
	this.parent = undefined; // immediate source of the current grid point

	// update neighbors array for a given grid point
	this.updateNeighbors = function (grid) {
		let i = this.x;
		let j = this.y;
		if (i < cols - 1) {
			this.neighbors.push(grid[i + 1][j]);
		}
		if (i > 0) {
			this.neighbors.push(grid[i - 1][j]);
		}
		if (j < rows - 1) {
			this.neighbors.push(grid[i][j + 1]);
		}
		if (j > 0) {
			this.neighbors.push(grid[i][j - 1]);
		}
	};
}

//initializing the grid
function init() {
	//making a 2D array
	for (let i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new GridPoint(i, j);
		}
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].updateNeighbors(grid);
		}
	}

	start = grid[0][0];
	end = grid[cols - 1][rows - 1];

	openSet.push(start);

	console.log(grid);
}

//A star search implementation

function search() {
	init();
	while (openSet.length > 0) {
		//assumption lowest index is the first one to begin with
		let lowestIndex = 0;
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowestIndex].f) {
				lowestIndex = i;
			}
		}
		let current = openSet[lowestIndex];

		if (current === end) {
			let temp = current;
			path.push(temp);
			while (temp.parent) {
				path.push(temp.parent);
				temp = temp.parent;
			}
			console.log("DONE!");
			// return the traced path
			return path.reverse();
		}

		//remove current from openSet
		openSet.splice(lowestIndex, 1);
		//add current to closedSet
		closedSet.push(current);

		let neighbors = current.neighbors;

		for (let i = 0; i < neighbors.length; i++) {
			let neighbor = neighbors[i];

			if (!closedSet.includes(neighbor)) {
				let possibleG = current.g + 1;

				if (!openSet.includes(neighbor)) {
					openSet.push(neighbor);
				} else if (possibleG >= neighbor.g) {
					continue;
				}

				neighbor.g = possibleG;
				neighbor.h = heuristic(neighbor, end);
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.parent = current;
			}
		}
	}

	//no solution by default
	return [];
}

console.log(search());
```

## Conclusion

This project allowed me to improve my javascript HTML and CSS development. I could experiment the machine learning solution even if it is not the chosen solution. It allowed me to have the new approaches regarding code factorization, project management, algorithm and even AI.

---

<span style="font-size:0.86rem;">(an article may be released on machine learning very soon 🤫)</span>

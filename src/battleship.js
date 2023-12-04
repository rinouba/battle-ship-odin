const view = {
	displayMessage: function(msg) {
		const messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		const cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		const cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

const model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

/*	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""]},
		{ locations: ["24", "34", "44"], hits: ["", "", ""]},
		{ locations: ["10", "11", "12"], hits: ["", "", ""]}
	],
*/
  	ships: [
		{ locations: ["", "", ""], hits: ["", "", ""]},
		{ locations: ["", "", ""], hits: ["", "", ""]},
		{ locations: ["", "", ""], hits: ["", "", ""]}
	],


	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Miss!");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = createRandom(2);
		var row, col;

		if (direction === 1) { // horizontal
			row = createRandom(this.boardSize);
			col = createRandom(this.boardSize - this.shipLength + 1);
		} else { // vertical
			row = createRandom(this.boardSize - this.shipLength + 1);
			col = createRandom(this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};


function createRandom(num) {
  var rand = Math.floor(Math.random() * num);
  return rand;
}

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}

// event handlers
function handleFireButton () {
	const guessInput = document.getElementById("guessInput");
	const guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
};

function handleKeyPress(e) {
	const fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function init() {
	const fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	const guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

window.onload = init;

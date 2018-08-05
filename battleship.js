
var view={
	displayMessage:function(msg){
		var messageArea=document.getElementById("messageArea");
		messageArea.innerHTML=msg;
	},
	displayHit:function(location){
		var cell=document.getElementById(location);
		cell.setAttribute("class","hit");
	},
	displayMiss:function(location){
		var cell=document.getElementById(location);
		cell.setAttribute("class","miss");
	}
};
// view.displayMiss("00");
// view.displayHit("34");
// view.displayMiss("55");
// view.displayHit("12");
// view.displayMiss("25");
// view.displayHit("26");
// view.displayMessage("aaaaaaaaaaaaaaaaa");

var model={
	boardSize:7,
	numShips:3,
	shipLength:3,
	shipsSunk:0,
	ships:[{locations:["0","0","0"],hits:["","",""]},
			{locations:["0","0","0"],hits:["","",""]},
			{locations:["0","0","0"],hits:["","",""]}],
	fire:function(guess){
		for (var i = 0; i < this.numShips; i++) {
			var ship=this.ships[i];
			// var locations=ship.locations;
			// var index=locations.indexOf(guess);
			var index=ship.locations.indexOf(guess);
			if (index>=0) {
				ship.hits[index]="hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					view.displayMessage("YOU SANK MY SHIP!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("you missed.");
		return false;
	},
	isSunk:function(ship){
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i]!=="hit") {
				return false;
			}
		}
		return true;
	},
	//创建战舰
	generateShipLocation:function(){
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do{
				locations=this.generateShip();
			}while(this.collision(location));
			this.ships[i].locations=locations;
		}
	},
	//创建一艘战舰
	generateShip:function(){
		var direction=Math.floor(Math.random()*2)
		var row,col;
		if (direction===1) {
			row=Math.floor(Math.random()*this.boardSize);
			col=Math.floor(Math.random()*(this.boardSize-this.shipLength));
		}else{
			row=Math.floor(Math.random()*(this.boardSize-this.shipLength));
			col=Math.floor(Math.random()*this.boardSize);
		}
		var newShipLocations=[];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction===1) {
				newShipLocations.push(row+""+(col+i));
			}else{
				newShipLocations.push((row+i)+""+col);
			}
		}
		return newShipLocations;
	},
	collision:function(locations){
		for (var i = 0; i < this.numShips; i++) {
			var ship=model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[i])>=0) {
					return true;
				}
			}
		}
		return false;
	}

};
// model.fire("31");
function parseGuess(guess){
	var alphabet=["A","B","C","D","E","F","G"];
	if (guess===null||guess.length!==2) {
		alert("please enter a letter and a number");
	}
	else{
		firstChar=guess.charAt(0);
		var row=alphabet.indexOf(firstChar);
		var column=guess.charAt(1);
		if (isNaN(row)||isNaN(column)) {
			alert("Oop,that isn't on the board");
		}else if(row<0||row>=model.boardSize||column<0||column>=model.boardSize) {
			alert("Oop,that't off the board");
		}else{
			return row+column;
		}
	}
	return null;
}
// console.log(parseGuess("A0"));
// console.log(parseGuess("A6"));
// console.log(parseGuess("Z0"));
// console.log(parseGuess("A00"));
var controller={
	guesses:0,
	processGuess:function(guess){
		var location=parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit=model.fire(location);
			if (hit&&model.shipsSunk==model.numShips) {
				view.displayMessage("you sank all my battle,in"+this.guesses+"guesses");
			}
		}
	}
}
// controller.processGuess("A0");
// controller.processGuess("A6");
// controller.processGuess("C4");

function init(){
	var fireButton=document.getElementById("fireButton");
	fireButton.onclick=handleFireButton;
	//让回车键也可以代替fire
	var guessInput=document.getElementById("guessInput");
	guessInput.onkeypress=handleKeyPress;

	model.generateShipLocation();
}
function handleKeyPress(e){
	var fireButton=document.getElementById("fireButton");
	if (e.keyCode===13) {
		fireButton.click();
		return false;
	}
}
function handleFireButton(){
	var guessInput=document.getElementById("guessInput");
	var guess=guessInput.value;
	controller.processGuess(guess);
	guessInput.value="";
}
window.onload=init;
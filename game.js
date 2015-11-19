"use strict";

var numberOfBlocks = 9;
var targetBlocks = [];
var trapBlock;
var targetTimer;
var trapTimer;
var instantTimer;


document.observe('dom:loaded', function(){
	$("start").onclick = ready;
	$("stop").onclick = stopGame;
});

function ready(){
	clearInterval(trapTimer);
	clearInterval(targetTimer);
	$("state").textContent = "Ready!";
	$("score").textContent = "0";

	setTimeout(startGame, 3000);
}

function startGame(){
	var block = $$(".block");
	for (var i = 0; i < numberOfBlocks; i++) {
		block[i].removeClassName("target");
		block[i].removeClassName("trap");
		block[i].stopObserving("click");
	}
	targetBlocks = [];
	startToCatch();
}

function stopGame(){
	var block = $$(".block");
	clearInterval(trapTimer);
	clearInterval(targetTimer);
	$("state").textContent = "Stop";
	for (var i = 0; i < numberOfBlocks; i++) {
		block[i].removeClassName("target");
		block[i].removeClassName("trap");
		block[i].stopObserving("click");
	}
	targetBlocks = [];
}

function startToCatch(){
	$("state").textContent = "Catch!";
	trapTimer = setInterval(settrap, 3000);
	targetTimer = setInterval(settarget, 1000);

	buttonClick();
}

function settarget(){
	var block = $$(".block");
	var numberOfTarget = 0;
	//alert("target");
	var tmp = Math.floor(Math.random()*numberOfBlocks);
	while(block[tmp].hasClassName("target")||block[tmp].hasClassName("trap")){
		tmp = Math.floor(Math.random()*numberOfBlocks);
	}
	block[tmp].addClassName("target");
	targetBlocks[tmp] = "1";
	for(var i=0;i<numberOfBlocks;i++){
		if(targetBlocks[i] == "1"){
			numberOfTarget++;
		}
	}
	if(numberOfTarget>4){
			stopGame();
			alert("You Lose");
	}
}

function settrap(){
	var block = $$(".block");
	var tmp = Math.floor(Math.random()*numberOfBlocks);
	while(block[tmp].hasClassName("target")||block[tmp].hasClassName("trap")){
		tmp = Math.floor(Math.random()*numberOfBlocks);
	}
	block[tmp].addClassName("trap");
	setTimeout(clearblock, 2000, tmp, "trap");
}
function clearblock(index,className){
	var block = $$(".block");
	block[index].removeClassName(className);
}
function buttonClick(){
	var block = $$(".block");
	for(var i=0; i < block.length; i++){
		block[i].observe("click", buttonEvent);
	}
}
function buttonEvent(){
	var block_index = this.readAttribute("data-index");
	if(!this.hasClassName("trap")&&!this.hasClassName("target")){
		this.addClassName("wrong");
		setTimeout(clearblock, 100, block_index, "wrong");
		$("score").innerHTML-=10;
	}
	else if(this.hasClassName("trap")){
		this.removeClassName("trap");
		$("score").innerHTML-=30;
	}
	else if(this.hasClassName("target")){
		this.removeClassName("target");
		var score = parseInt($("score").textContent)+20;
		$("score").innerHTML = score;
		targetBlocks[block_index] = 0;
	}
}

/*

The Game Project - Final

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectables;
var clouds;
var mountains;
var canyons;

var game_score;
var lives;
var flagpole;
var lifeToken;

var jumpSound;
var screamSound;
var cheerSound;
var hitSound;

var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
	jumpSound.playMode('untilDone')

	screamSound = loadSound('assets/scream.wav');
	screamSound.setVolume(0.1);
	screamSound.playMode('untilDone')
	

	cheerSound = loadSound('assets/cheer.wav');
	cheerSound.setVolume(0.1);
	cheerSound.playMode('untilDone')

	hitSound = loadSound('assets/hit.wav');
	hitSound.setVolume(0.1);
	hitSound.playMode('untilDone')
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3
	lifeToken = [
		{used: false, x_pos: 110, y_pos: 15},
		{used: false, x_pos: 150, y_pos: 15},
		{used: false, x_pos: 190, y_pos: 15}
	]

	startGame();
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

	push();
	translate(scrollPos, 0);

	// Draw clouds.
	drawClouds();

	// Draw mountains.
	drawMountains();

	// Draw trees.
	drawTrees();

	// Draw canyons.
	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	//Draw enemies
	for(i = 0; i < enemies.length; i++)
	{
		enemies[i].drawEnemies();

		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);

		if(isContact)
		{
			hitSound.play();
			if(lives > 1)
			{
				lifeToken[lives - 1].used = true;
				lives -= 1;
				console.log(gameChar_world_x)
				startGame();
				break;
			}
			else
			{
				lifeToken[0].used = true;
				lives -= 1;
				isLeft = false;
				isRight = false;
				push();
				fill('rgba(0, 0, 0, 0.5)');
				rect(gameChar_world_x - gameChar_x, 0, width, height);
				textSize(100);
				fill(255);
				textAlign(CENTER);
				text("GAME OVER",(gameChar_world_x - gameChar_x) + width/2, height/2);
				// text("GAME OVER",(gameChar_world_x - gameChar_x + width)/2 ,height/2);
				textSize(20);
				text("Press space to continue....",(gameChar_world_x - gameChar_x) + width/2 ,height/2 + ((height/2)/5));
				pop();
			
			}	
		}

	}

	// Draw collectable items.
	for(var i = 0; i < collectables.length; i++)
	{
		if(collectables[i].isFound == false)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}

	}

	//Draw flagpole
	drawFlagpole();
	
	if(flagpole.isReached)
	{
		push();
		fill('rgba(0, 0, 0, 0.5)');
		rect(0, 0, width, height);
		textSize(80);
		fill(255);
		textAlign(CENTER);
		text("LEVEL COMPLETED",width/2,height/2);
		textSize(20);
		text("Press space to continue....",width/2,height/2 + ((height/2)/5));
		pop();
		 
		return;
	}

	pop();

	// Draw life counter
	drawLives();

	// Draw game character.
	drawGameChar();

	// Draw score counter
	fill(255);
	noStroke();
	textSize(14);
	text("SCORE: " + game_score, 20, 25);

	

	
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	
	if (gameChar_y < floorPos_y - 5)
	{
		isFalling = true; 
		gameChar_y += 2; 
	} 
	else if (gameChar_y < floorPos_y)
	{
		isFalling = false;
		gameChar_y = floorPos_y;
	}

	// Check distance to flagpole
	if(flagpole.isReached == false)
	{
		checkFlagpole();
	
	}
	
	// Check if if a player dies
	checkPlayerDie();

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	if(keyCode == 37) // Left arrow
	{
			isLeft = true;
	}
	else if(keyCode == 39) // Right arrow
	{
		isRight = true;
	}
	else if(keyCode == 32) // Spacebar
	{
		jumpSound.play();
		if(!isFalling)
		{ 
			gameChar_y -= 100;
		} 

		if(lifeToken[0].used == true)
		{
			for(i = 0; i < 3; i++)
			{
				lifeToken[i].used = false;
			}
			startGame();
		}

		if(flagpole.isReached)
		{
			for(i = 0; i < 3; i++)
			{
				lifeToken[i].used = false;
			}
			startGame();
		}
	}
}

function keyReleased()
{
	if(keyCode == 37) // Left arrow
	{
		isLeft = false;
	}
	else if(keyCode == 39) // Right arrow
	{
		isRight = false;
	}
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// jumping-left code
		// Right arm
		fill(69);
		push();
		translate(gameChar_x, gameChar_y - 51);
		rotate(100);
		rect(0, 0, 6, 20);
		pop();
		// Right leg
		push();
		translate(gameChar_x - 4, gameChar_y - 30);
		rotate(80);
		rect(0,0 , 7, 24);
		pop();
		// Torso
		fill(128);
		rect(gameChar_x - 8, gameChar_y - 50, 16, 30);
		fill(255,215,0);
		ellipse(gameChar_x, gameChar_y - 60, 22, 25);
		fill(69);
		// Left leg
		push();
		translate(gameChar_x, gameChar_y - 22);
		rotate(-80);
		rect(0, 0, 7, 24);
		pop();
		// Left arm
		push();
		translate(gameChar_x + 1, gameChar_y - 42);
		rotate(-100);
		rect(0, 0, 6, 20);
		pop();
	}
	else if(isRight && isFalling)
	{
		// umping-right code
		// Left arm
		fill(69);
		push();
		translate(gameChar_x - 2, gameChar_y - 44);
		rotate(-100);
		rect(0, 0, 6, 20);
		pop();
		// Left leg
		push();
		translate(gameChar_x + 2, gameChar_y - 24);
		rotate(-80);
		rect(0, 0, 7, 24);
		pop();
		// Torso
		fill(128);
		rect(gameChar_x - 8, gameChar_y - 50, 16, 30);
		fill(255,215,0);
		ellipse(gameChar_x, gameChar_y - 60, 22, 25);
		fill(69);
		// Right leg
		push();
		translate(gameChar_x - 2, gameChar_y - 30);
		rotate(80);
		rect(0,0 , 7, 24);
		pop();
		// Right arm
		push();
		translate(gameChar_x - 2, gameChar_y - 48);
		rotate(100);
		rect(0, 0, 6, 20);
		pop();
	}
	else if(isLeft)
	{
		// walking left code
		// Right arm
		fill(69);
		push();
		translate(gameChar_x, gameChar_y - 51);
		rotate(60);
		rect(0, 0, 6, 20);
		pop();
		// Right leg
		push();
		translate(gameChar_x - 8, gameChar_y - 26);
		rotate(30);
		rect(0,0 , 7, 24);
		pop();
		// Torso
		fill(128);
		rect(gameChar_x - 8, gameChar_y - 50, 16, 30);
		fill(255,215,0);
		ellipse(gameChar_x, gameChar_y - 60, 22, 25);
		fill(69);
		// Left leg
		push();
		translate(gameChar_x, gameChar_y - 22);
		rotate(-55);
		rect(0, 0, 7, 24);
		pop();
		// Left arm
		push();
		translate(gameChar_x + 1, gameChar_y - 42);
		rotate(-60);
		rect(0, 0, 6, 20);
		pop();
	}
	else if(isRight)
	{
		// walking right code
		// Left arm
		fill(69);
		push();
		translate(gameChar_x - 2, gameChar_y - 44);
		rotate(-60);
		rect(0, 0, 6, 20);
		pop();
		// Left leg
		push();
		translate(gameChar_x + 2, gameChar_y - 24);
		rotate(-30);
		rect(0, 0, 7, 24);
		pop();
		// Torso
		fill(128);
		rect(gameChar_x - 8, gameChar_y - 50, 16, 30);
		fill(255,215,0);
		ellipse(gameChar_x, gameChar_y - 60, 22, 25);
		fill(69);
		// Right leg
		push();
		translate(gameChar_x - 4, gameChar_y - 28);
		rotate(55);
		rect(0,0 , 7, 24);
		pop();
		// Right arm
		push();
		translate(gameChar_x - 4, gameChar_y - 48);
		rotate(60);
		rect(0, 0, 6, 20);
		pop();
	}
	else if(isFalling || isPlummeting)
	{ 

		// jumping facing forwards code
		//Add your code here ...
		fill(128);
		rect(gameChar_x - 11, gameChar_y - 50, 22, 30);
		fill(255,215,0);
		ellipse(gameChar_x, gameChar_y - 60, 20, 25);
		fill(69);
		push();
		translate(gameChar_x - 8, gameChar_y - 26);
		rotate(70);
		rect(0,0 , 7, 24);
		pop();
		push();
		translate(gameChar_x + 6, gameChar_y - 19);
		rotate(-70);
		rect(0, 0, 7, 24);
		pop();
		push();
		translate(gameChar_x - 8, gameChar_y - 51);
		rotate(80);
		rect(0, 0, 6, 20);
		pop();
		push();
		translate(gameChar_x + 8, gameChar_y - 45);
		rotate(-80);
		rect(0, 0, 6, 20);
		pop();
	}
	else
	{
		// standing front facing code
		fill(128);
		rect(gameChar_x - 11, gameChar_y - 50, 22, 30);
		fill(255,215,0);
		ellipse(gameChar_x, gameChar_y - 60, 20, 25);
		fill(69);
		rect(gameChar_x - 10, gameChar_y - 22, 7, 24);
		rect(gameChar_x + 3, gameChar_y - 22, 7, 24);
		push();
		translate(gameChar_x - 12, gameChar_y - 50);
		rotate(20);
		rect(0, 0, 6, 20);
		pop();
		push();
		translate(gameChar_x + 6, gameChar_y - 47);
		rotate(-20);
		rect(0, 0, 6, 20);
		pop();
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
	for(var i = 0; i < clouds.length; i++)
	{
		fill(255);
		ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size * 8);
		ellipse(clouds[i].x_pos + (40 * (clouds[i].size / 10)), clouds[i].y_pos - (10 * (clouds[i].size / 10)), clouds[i].size * 10,clouds[i].size * 11);
		ellipse(clouds[i].x_pos + (90 * (clouds[i].size / 10)), clouds[i].y_pos - (20 * (clouds[i].size / 10)), clouds[i].size * 13, clouds[i].size * 11);
		ellipse(clouds[i].x_pos + (90 * (clouds[i].size / 10)), clouds[i].y_pos - (30 * (clouds[i].size / 10)), clouds[i].size * 13, clouds[i].size * 11);
		ellipse(clouds[i].x_pos + (120 * (clouds[i].size / 10)), clouds[i].y_pos - (10 * (clouds[i].size / 10)), clouds[i].size * 12, clouds[i].size * 10);
		ellipse(clouds[i].x_pos, clouds[i].y_pos + (30 * (clouds[i].size / 10)), clouds[i].size * 6);
		ellipse(clouds[i].x_pos + (40 * (clouds[i].size / 10)), clouds[i].y_pos + (30 * (clouds[i].size / 10)), clouds[i].size * 6);
		ellipse(clouds[i].x_pos + (80 * (clouds[i].size / 10)), clouds[i].y_pos + (30 * (clouds[i].size / 10)), clouds[i].size * 6);
		ellipse(clouds[i].x_pos + (120 * (clouds[i].size / 10)), clouds[i].y_pos + (30 * (clouds[i].size / 10)), clouds[i].size * 6);
		ellipse(clouds[i].x_pos + (160 * (clouds[i].size / 10)), clouds[i].y_pos + (30 * (clouds[i].size / 10)), clouds[i].size * 6);
	}
}

// Function to draw mountains objects.
function drawMountains()
{
	for(var i = 0; i < mountains.length; i++)
	{
		fill(150)
		triangle(mountains[i].x_pos, floorPos_y, mountains[i].x_pos + (50 * (mountains[i].size / 10)), floorPos_y - (182 * (mountains[i].size / 10)), mountains[i].x_pos + (160 * (mountains[i].size / 10)), floorPos_y);
		triangle(mountains[i].x_pos + 30, floorPos_y, mountains[i].x_pos + (130 * (mountains[i].size / 10)), floorPos_y - (132 * (mountains[i].size / 10)),mountains[i].x_pos + (200 * (mountains[i].size / 10)), floorPos_y);
	}
}

// Function to draw trees objects.
function drawTrees()
{
	for(var i = 0; i < trees_x.length; i++)
	{
		fill(153, 76, 0);
		rect(trees_x[i], treePos_y, 30, 112);
		fill(0, 102, 0);
		triangle(trees_x[i] - 50, treePos_y, trees_x[i] + 80, treePos_y, trees_x[i] + 15, treePos_y -100);
		triangle(trees_x[i] - 40, treePos_y - 50, trees_x[i] + 70, treePos_y -50, trees_x[i] + 15, treePos_y - 140);
	}
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	{
		// Brown outline
		noStroke();
		fill(102, 51, 0);
		beginShape();
		vertex(t_canyon.x_pos, 432);
		vertex(t_canyon.x_pos + 10, 460);
		vertex(t_canyon.x_pos + 40, 490);
		vertex(t_canyon.x_pos + 50, 576);
		vertex(t_canyon.x_pos + 10 + t_canyon.width, 550);
		vertex(t_canyon.x_pos + 50 + t_canyon.width, 500);
		vertex(t_canyon.x_pos + 90 + t_canyon.width, 432);
		endShape(CLOSE);

		// Blue fill
		fill(100, 155, 255);
		beginShape();
		vertex(t_canyon.x_pos + 5, 422);
		vertex(t_canyon.x_pos + 10, 450);
		vertex(t_canyon.x_pos + 45, 480);
		vertex(t_canyon.x_pos + 55, 566);
		vertex(t_canyon.x_pos + t_canyon.width, 540);
		vertex(t_canyon.x_pos + 45 + t_canyon.width, 490);
		vertex(t_canyon.x_pos + 80 + t_canyon.width, 422);
		endShape(CLOSE);
	}
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if (gameChar_world_x <= t_canyon.x_pos + t_canyon.width + 90 && gameChar_world_x > t_canyon.x_pos && gameChar_y > floorPos_y - 5)
	{
		isPlummeting = true;
		isLeft = false;
		isRight = false;
		gameChar_y += 6;
		screamSound.play();
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
	stroke(255, 53, 51);
	fill(204, 0, 204);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size * 0.3, t_collectable.size * 0.6);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size * 0.6, t_collectable.size * 0.3);
	noStroke();
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 40)
	{
		t_collectable.isFound = true;
		game_score += 1;
	}
}

// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

// Function to draw flagpole object.

function drawFlagpole()
{
	push();
	strokeWeight(5);
	stroke(100);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	pop();

	if(flagpole.isReached)
	{
		cheerSound.play();
		fill(240,0,0);
		triangle(flagpole.x_pos + 2.5, floorPos_y - 240, flagpole.x_pos + 70, floorPos_y - 200, flagpole.x_pos + 2.5, floorPos_y - 160);
	}
	else
	{
		fill(240,0,0);
		triangle(flagpole.x_pos + 2.5, floorPos_y - 80, flagpole.x_pos + 70, floorPos_y - 40, flagpole.x_pos + 2.5, floorPos_y);
	}
	pop();
}

//Function to check if flagpole is reached

function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if(d < 15)
	{
		flagpole.isReached = true;
	}
}

// ----------------------------------
// Check when player dies
// ----------------------------------

function checkPlayerDie()
{
	if(gameChar_y > 600)
	{
		if(lives > 1)
		{
			lifeToken[lives - 1].used = true;
			lives -= 1;
			console.log(gameChar_x)
			startGame();
		}
		else
		{
			lifeToken[0].used = true;
			lives -= 1;
			push();
			fill('rgba(0, 0, 0, 0.5)');
			rect(0, 0, width, height);
			textSize(100);
			fill(255);
			textAlign(CENTER);
			text("GAME OVER",width/2,height/2);
			textSize(20);
			text("Press space to continue....",width/2,height/2 + ((height/2)/5));
			pop();
			//  jumpSound.setVolume(0);
		}
 	}
}


// ----------------------------------
// Draw life counter
// ----------------------------------

function drawLives()
{
	for(i = 0; i < lifeToken.length; i++)
		if(lifeToken[i].used == false)
		{
			fill(255,0,0);
			noStroke();
			ellipse(lifeToken[i].x_pos - 4, lifeToken[i].y_pos, 9.5);
			ellipse(lifeToken[i].x_pos + 4, lifeToken[i].y_pos, 9.5);
			triangle(lifeToken[i].x_pos - 9.5,lifeToken[i].y_pos,lifeToken[i].x_pos + 9.5,lifeToken[i].y_pos,lifeToken[i].x_pos,lifeToken[i].y_pos + 12);
		}
}

// ----------------------------------
// Enemies constructor function
// ----------------------------------
function Enemy(x, size, speed, range) 
{
	this.x = x;
	this.y = floorPos_y - 30;
	this.size = size;
	this.speed = speed;
	this.currentX = x;
	this.range = range;
	
	this.update = function()
	{
		this.currentX += this.speed;

		if(this.currentX >= this.x + this.range || this.currentX < this.x)
		{
			this.speed *= -1;
		};
	}

	this.drawEnemies = function()
	{
		this.update();
		push(); 
		fill(255, 158, 23);
		ellipse(this.currentX, this.y, this.size * 1.2);
		fill(213, 19, 19);
		ellipse(this.currentX, this.y, this.size);
		pop();
	}

	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.currentX, this.y)

		if(d < 35)
		{
			return true;
		}
	return false;

	}
}



// ----------------------------------
// Start the game
// ----------------------------------

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	angleMode(DEGREES);

	if(lives < 0)
	{
		lives = 3;
	}

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	trees_x = [-500, 500, 1200];
	treePos_y = floorPos_y - 111;

	collectables = [
		{x_pos: 400, y_pos: 400, size: 50, isFound: false},
		{x_pos: 900, y_pos: 400, size: 70, isFound: false},
		{x_pos: -100, y_pos: 400, size: 30, isFound: false},
		{x_pos: -700, y_pos: 400, size: 40, isFound: false}
	];

	clouds = [
		{x_pos: -250, y_pos: 150, size: 6}, 
		{x_pos: 300, y_pos: 100, size: 10}, 
		{x_pos: 900, y_pos: 200, size: 8}
	];

	mountains = [
		{x_pos: 180, size: 9},
		{x_pos: 800, size: 11},
		{x_pos: 1300, size: 15}
	];

	canyons = [
		{x_pos: -50, width: 70},
		{x_pos: 650, width: 75},
		{x_pos: 1650, width: 65}
	];

	enemies = [];

	for(i = 0; i < 5; i++)
	{
		enemies.push(new Enemy(random(-2000,2000), random(10,40), random(1,5), random(50,100)))
	};

	game_score = 0;

	flagpole = {isReached: false, x_pos: 2000};
}
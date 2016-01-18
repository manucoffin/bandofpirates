// What we do in this file :
// when the game template is rendered, we initialize the game for local player
// (set up the map, the variables...etc)
// then, when the player move or do anything, we do the changes locally
// and we send player's data to the database, so that each player infos are constantly updated
// so we can get other players datas from the database, and display them locally


Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

// subscription to server publications to pass datas between client/server via the databases
Meteor.subscribe('boats');
Meteor.subscribe('userStatus'); 



function startGame() {

	var game = new Phaser.Game(
		1000, // size of the canvas created
		600,
		Phaser.AUTO,
		'game-view', // div in which the canvas is appened
		{ 
			preload: preload,
			create: create,
			update: update,
			render: render
		}
	);


	var dPlayers; // array of distant players
	var map;
	var layer;
	var sprite; // local player
	var cursors;
	var lBullets; // LOCAL bullets
	var fireRate = 100;
	var nextFire = 0;
	var lBulletsDatasToSend = []; // an array of useful datas about bullets that we send in the database
	var cloudsGroup;
	// var particleEmitter;

	var query = Boats.find({});	
	var existingBoats = query.fetch(); // all the boats stored in the database

	var handle = query.observeChanges({
		// callback each time the boats db changes
		changed: function () {

			// need to declare the array again because it is not accessible from here
			let boatsArray = query.fetch();

			// loop through all the boats into the database
			for(var i=0; i<boatsArray.length; i++)
			{
				// if the boat is not owned by the current user
				// and if the boat is not already dead
				if (boatsArray[i].owner != Meteor.user()._id)
				{
					// then we loop in our local enemy array
					dPlayers.forEach(function(enemy) {
						// and if the id in local array and the one in the db match
						if(enemy.id == boatsArray[i].owner) {
							// we update the coordinates
							enemy.x = boatsArray[i].x + enemy.width/2;
							enemy.y = boatsArray[i].y + + enemy.height/2;
							enemy.angle = boatsArray[i].angle;

							// change sprite image depending on the angle
						    switch (enemy.angle){
						    	case 0:
						    		enemy.loadTexture('right', 0);
						    		break;

						    	case 45:
						    		enemy.loadTexture('bottomRight', 0);
						    		break;

						    	case 90:
						    		enemy.loadTexture('bottom', 0);
						    		break;

						    	case 135:
						    		enemy.loadTexture('bottomLeft', 0);
						    		break;

						    	case -180:
						    		enemy.loadTexture('left', 0);
						    		break;	

						    	case -45:
						    		enemy.loadTexture('topRight', 0);
						    		break;

						    	case -90:
						    		enemy.loadTexture('top', 0);
						    		break;

						    	case -135:
						    		enemy.loadTexture('topLeft', 0);
						    		break;

						    	case -180:
						    		enemy.loadTexture('left', 0);
						    		break;

						    	default:
						    		enemy.loadTexture('right', 0);
						    		break;
						    }

						}

					}, this);


					// we also loop in the bullets array of each boat
					dBullets.forEach(function(bullet) {
						if (bullet.ownerId == boatsArray[i].owner)
						{
							// if the bullet is alive
							if(boatsArray[i].bullets[bullet.bulletId].alive == true)
							{
								// we update its coordinates
								bullet.x = boatsArray[i].bullets[bullet.bulletId].x;
								bullet.y = boatsArray[i].bullets[bullet.bulletId].y;
							}
							// else if the bullet is dead
							else
							{
								// we just put the bullet away 
								// this is a temporary solution before I find out how to kill that bullet
								bullet.x = -1000;
								bullet.y = -1000;
							}
						}
	
					}, this);
					
				}
				// else if it is the boat of current user
				else
				{
					// we just want to get health value that is updated by the enemies
					sprite.health = boatsArray[i].health;
				}
			}
		}
	});



	// handle users connection/disconnection
	Meteor.users.find({ "status.online": true }).observe({
		// on user connection
		added: function(user) {
			console.log(user.username + " is online");
		},

		// on user disconnection
		removed: function(user) {
			console.log(user.username + " has logged off");
			Meteor.call("killBoat", user);
		}
	});


// ------------------------------------------------------------------------
// 		THE GAME
// ------------------------------------------------------------------------









	function preload(){

		// prevent game pausing when loosing focus on browser
		game.stage.disableVisibilityChange = true; 
	
		game.load.tilemap('worldTileMap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'assets/tiles/tileset.png');

    	game.load.image('bullet','assets/sprites/blue_ball.png');
    	game.load.image('cloud1','assets/sprites/cloud1.png');
    	game.load.image('cloud2','assets/sprites/cloud2.png');
    	game.load.image('particle','assets/sprites/particle.png');

    	game.load.image('left','assets/sprites/left.png');
    	game.load.image('topLeft','assets/sprites/topLeft.png');
    	game.load.image('top','assets/sprites/top.png');
    	game.load.image('topRight','assets/sprites/topRight.png');
    	game.load.image('right','assets/sprites/right.png');
    	game.load.image('bottomRight','assets/sprites/bottomRight.png');
    	game.load.image('bottom','assets/sprites/bottom.png');
    	game.load.image('bottomLeft','assets/sprites/bottomLeft.png');


	}








	function create() {

		// ---------------------------------------
	    // 	World map settings:
	    // ---------------------------------------


		game.stage.backgroundColor = '#787878';
	    map = game.add.tilemap('worldTileMap');
	    map.addTilesetImage('tileset', 'tiles');

	    map.setCollisionBetween(0, 13);
	    map.setCollisionBetween(21, 22);
	    map.setCollisionBetween(30, 54);

	    layer = map.createLayer('Background');
	    layer.resizeWorld();
	    game.world.setBounds(0, 0, 1600, 1600);
		game.physics.startSystem(Phaser.Physics.ARCADE);



		// ---------------------------------------
	    // 	Sprites settings:
	    // ---------------------------------------

	    



	    // local player sprite
		sprite = game.add.sprite(100, 100, 'right');
	    game.physics.enable(sprite, Phaser.Physics.ARCADE);
	    sprite.anchor.setTo(0.5, 0.5);
	    sprite.momentumVelocity = 0;
	    sprite.health = 100;
	    sprite.body.setSize(55, 20, 0, 20);
	    sprite.body.collideWorldBounds=true;

	    var rotateSprite = sprite.animations.add('rotateSprite');


	    // distant players group
	    dPlayers = game.add.group();
		dPlayers.enableBody = true;
	    dPlayers.physicsBodyType = Phaser.Physics.ARCADE;

	    // local bullets group
	    lBullets = game.add.group();
	    lBullets.enableBody = true;
	    lBullets.physicsBodyType = Phaser.Physics.ARCADE;

	    // distant bullets group
	    dBullets = game.add.group();
		dBullets.enableBody = true;
	    dBullets.physicsBodyType = Phaser.Physics.ARCADE;


	    // create pool of LOCAL lBullets with some properties
	    for(var i=0; i<10; i++)
	    {
	    	let lBulletSprite = game.add.sprite(100, 100, 'bullet');
	    	lBulletSprite.ownerId = Meteor.user()._id; // boat id
	    	lBulletSprite.bulletId = i; // bullet id, to retrieve them easily
	    	lBulletSprite.anchor.setTo(0.5, 0.5);
	    	lBullets.add(lBulletSprite);
	    	// we need to "kill" the sprite (make it invisible) to initialize a pool full of dead bullets
	    	lBulletSprite.kill();
	    }
	    lBullets.setAll('checkWorldBounds', true);
	    lBullets.setAll('outOfBoundsKill', true);
    
	    // we need to store useful properties of each bullets in an array
	    // because we can't just save the phaser.group in the database
		lBullets.forEach(function(member){
			member = {ownerId: 0, x: 0, y: 0};
			lBulletsDatasToSend.push(member);
		});


	    // initialize the array of distant players
	    for(var i=0; i<existingBoats.length; i++)
		{
			// if owner of the boat is not the user currently logged in
			if ( existingBoats[i].owner != Meteor.user()._id )
			{
				// we add sprites to the group
			    let dPlayerSprite = game.add.sprite(100, 100, 'right');
			    dPlayerSprite.anchor.setTo(0.5, 0.5);
			    dPlayerSprite.id = existingBoats[i].owner;
			    dPlayers.add(dPlayerSprite);

			    // then we loop through bullets array of each boat
			    for(var j=0; j<existingBoats[i].bullets.length; j++)
			    {
			    	// and we create the bullets sprites
			    	let dBulletSprite = game.add.sprite(100, 100, 'bullet');
				    dBulletSprite.ownerId = existingBoats[i].owner;
				    dBulletSprite.bulletId = j;
				    dBulletSprite.anchor.setTo(0.5, 0.5);
				    dBullets.add(dBulletSprite);

			    }
			}
		}



	    // to use the keyboard
	    cursors = game.input.keyboard.createCursorKeys();
	    game.camera.follow(sprite);


	    // handle the sprite rotation
	    rotateLeftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	    rotateLeftButton.onDown.add(function(){
	    	// sprite.loadTexture('player2', 0);
	    	if (sprite.angle>=-180)
	    		sprite.angle += -45;
	    	else
	    		sprite.angle += 360;
	    }, this);

	    rotateRightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	    rotateRightButton.onDown.add(function(){
	    	// sprite.loadTexture('player', 0);
	    	if (sprite.angle<=180)
	    		sprite.angle += 45;
	    	else
	    		sprite.angle += -360;
	    }, this);



	    // ---------------------------------------
	    // 	Other Features settings:
	    // ---------------------------------------



	    // Clouds generation

	    cloudsGroup = game.add.group();
	    cloudsGroup.enableBody = true;
	    cloudsGroup.physicsBodyType = Phaser.Physics.ARCADE;

	    for(var i=0; i<20; i++)
	    {
	    	let cloudSprite = game.add.sprite(Math.random()*1600, Math.random()*1600, 'cloud1');
	    	cloudsGroup.add(cloudSprite);
	    }

	    for(var i=0; i<20; i++)
	    {
	    	let cloudSprite = game.add.sprite(Math.random()*1600, Math.random()*1600, 'cloud2');
	    	cloudsGroup.add(cloudSprite);
	    }


	    // Particles System 

	 //    particleEmitter = game.add.emitter(0, 0, 1000);
	 //    particleEmitter.makeParticles('particle');

	 //    // attach emitter to the sprite
	 //    sprite.addChild(particleEmitter)

	 //    particleEmitter.y = 0;
  // 		particleEmitter.x = 0;

  // 		particleEmitter.lifespan = 1000;
		// particleEmitter.maxParticleSpeed = new Phaser.Point(-100,50);
		// particleEmitter.minParticleSpeed = new Phaser.Point(-200,-50);
	 //    // explode, lifespan, frequency, quantity
	    // particleEmitter.start(false, 5000, 20, 500);



	}









	function update() {

		sprite.body.velocity.x = 0;
	    sprite.body.velocity.y = 0;
	    sprite.body.angularVelocity = 0;

	    // enable collision between player and tiles
	    game.physics.arcade.collide(sprite, layer);


	    // each loop we decrease the speed of the boat to create the momentum effect
	    if(sprite.momentumVelocity>0)
	    {
	    	sprite.momentumVelocity -= 1;
	    	// particleEmitter.emitParticle();
	    }


	    // change sprite image depending on the angle
	    switch (sprite.angle){
	    	case 0:
	    		sprite.loadTexture('right', 0);
	    		sprite.body.setSize(50, 20, 0, 20);
	    		break;

	    	case 45:
	    		sprite.loadTexture('bottomRight', 0);
	    		sprite.body.setSize(40, 30, 3, 15);
	    		break;

	    	case 90:
	    		sprite.loadTexture('bottom', 0);
	    		sprite.body.setSize(25, 30, 0, 10);
	    		break;

	    	case 135:
	    		sprite.loadTexture('bottomLeft', 0);
	    		sprite.body.setSize(45, 35, 0, 10);
	    		break;

	    	case -180:
	    		sprite.loadTexture('left', 0);
	    		sprite.body.setSize(50, 20, 0, 20);
	    		break;	

	    	case -45:
	    		sprite.loadTexture('topRight', 0);
	    		sprite.body.setSize(40, 30, 3, 15);
	    		break;

	    	case -90:
	    		sprite.loadTexture('top', 0);
	    		sprite.body.setSize(25, 30, 0, 10);
	    		break;

	    	case -135:
	    		sprite.loadTexture('topLeft', 0);
	    		sprite.body.setSize(45, 35, 0, 10);
	    		break;

	    	case -180:
	    		sprite.loadTexture('left', 0);
	    		sprite.body.setSize(50, 20, 0, 20);
	    		break;

	    	default:
	    		sprite.loadTexture('right', 0);
	    		sprite.body.setSize(50, 20, 0, 20);
	    		break;
	    }



	    // Move forward
	    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	    {
	    	// set the velocity, which create a thrust
	    	// 200 is arbitrary value, greater value increase inertia
	        sprite.momentumVelocity = 200;
	    }

	    // Fire
	    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
	    {
	        fire(sprite.rotation);
	    }

	    // we loop through the bullets group
	    lBullets.forEach(function(bullet)
	    {
	    	// and we set the datas we need to send to the database
	    	lBulletsDatasToSend[bullet.bulletId] = {ownerId: bullet.ownerId, 
	    											x: bullet.x, 
	    											y: bullet.y, 
	    											alive: bullet.alive 
	    										};
	    }, this);
	    

	    // move the boat locally
	    game.physics.arcade.velocityFromAngle(sprite.angle, sprite.momentumVelocity, sprite.body.velocity);
	    
	   	// detect collisions between:
	    game.physics.arcade.overlap(lBullets, dPlayers, hitEnnemy, null, this); // local bullets and ennemy
	    game.physics.arcade.overlap(dBullets, sprite, hitMyself, null, this); // distant bullets and current player
	    // game.physics.arcade.collide(sprite, dPlayers); // two boats

	    $("#debug").text(sprite.health);

	

    	// finaly we update the database with new position of the boat
		Meteor.call("updateBoat", 
				Meteor.user(), 
				{
					x: sprite.body.x, 
					y: sprite.body.y, 
					angle: sprite.angle
				},
				lBulletsDatasToSend
				);

	}



	// DEBUG
	function render() {

	    game.debug.spriteInfo(sprite, 32, 32);
	    // game.debug.body(sprite); 
	}





// ------------------------------------------------------------------------
//		GAME FUNCTIONS
// ------------------------------------------------------------------------


	function fire(angle){
		// if enough time has been spend since the last shot 
		// and if there are enough lBullets in the pool
		if (game.time.now > nextFire && lBullets.countDead() > 0)
	    {
	    	// set the time before we can shoot again
	        nextFire = game.time.now + fireRate;

	        // get a "dead" bullet (inactive bullet)
	        let bullet = lBullets.getFirstDead();

	        // and bring it back to life at sprite position
	        bullet.reset(sprite.x - 8, sprite.y);

	        // make the bullet move in the direction wanted
	        bullet.rotation = sprite.rotation;
	        game.physics.arcade.velocityFromRotation(angle, 400, bullet.body.velocity);
	    }

	}


	function hitEnnemy(bullet, player){
		bullet.kill(); // kill the bullet locally
		let enemy = Boats.find({'owner': player.id}).fetch(); // find the owner of the boat you just hit
		let initialHealth = enemy[0].health; // get the old value of enemy health
		let newHealth = initialHealth-1; // decrease it
		Meteor.call('hurtEnemy', enemy[0], newHealth); // update the database
	}

	function hitMyself(player, bullet){
		console.log("I've been hit");
	}

	function boatsCollision(){
		console.log("boats collide")
	}

}




Template.menu.events({
	"click #start-btn": function(){
		$("#menu").css("display", "none");
		startGame();
	}
});






// Template.body.rendered({});

// Template.body.helpers({});

Template.body.events({

	"click #createBoatBtn": function(){
		Meteor.call("insertBoat");

	},

	"click #dropCollectionBtn": function(){
		Meteor.call("clearCollection");
	}

});

Template.statusBar.helpers({
	//
});
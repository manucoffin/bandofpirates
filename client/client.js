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
		500, // size of the canvas created
		500,
		Phaser.AUTO,
		'game-view', // div in which the canvas is appened
		{ 
			preload: preload,
			create: create,
			update: update
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
				if (boatsArray[i].owner != Meteor.user()._id &&
					boatsArray[i].dead != true)
				{
					// then we loop in our local enemy array
					dPlayers.forEach(function(enemy) {
						// and if the id in local array and the one in the db match
						if(enemy.id == boatsArray[i].owner) {
							// we update the coordinates
							enemy.x = boatsArray[i].x;
							enemy.y = boatsArray[i].y;
							enemy.angle = boatsArray[i].angle;

						}

					}, this);


					// we also loop in the bullets array of each boat
					dBullets.forEach(function(bullet) {
						if (bullet.ownerId == boatsArray[i].owner)
						{
							bullet.x = boatsArray[i].bullets[bullet.bulletId].x;
							bullet.y = boatsArray[i].bullets[bullet.bulletId].y;
						}
	
					}, this);
					
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

			// if the current user disconnect
			if(user._id == Meteor.user()._id)
			{
				// remove his boat from the game
				sprite.kill();
				Meteor.call("killBoat", user);
			}

		}
	});


// ------------------------------------------------------------------------
// 		THE GAME
// ------------------------------------------------------------------------









	function preload(){

		// prevent game pausing when loosing focus on browser
		game.stage.disableVisibilityChange = true; 
	
		game.load.tilemap('worldTileMap', 'assets/worldMap.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'assets/tiles/super_mario.png');
    	game.load.image('player','assets/sprites/arrow.png');
    	game.load.image('bullet','assets/sprites/blue_ball.png');

	}








	function create() {

		// ---------------------------------------
	    // 	World map settings:
	    // ---------------------------------------


		game.stage.backgroundColor = '#787878';
	    map = game.add.tilemap('worldTileMap');
	    map.addTilesetImage('SuperMarioTileset', 'tiles');
	    layer = map.createLayer('Background');
	    layer.resizeWorld();
	    game.world.setBounds(0, 0, 1600, 1600);
		// game.physics.startSystem(Phaser.Physics.ARCADE);


		// ---------------------------------------
	    // 	Sprites settings:
	    // ---------------------------------------


	    // local player sprite
		sprite = game.add.sprite(400, 300, 'player');
	    game.physics.enable(sprite, Phaser.Physics.ARCADE);
	    sprite.anchor.setTo(0.5, 0.5);
	    sprite.momentumVelocity = 0;
	    sprite.health = 100;
	    sprite.body.collideWorldBounds=true;


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
			    let dPlayerSprite = game.add.sprite(100, 100, 'player');
			    dPlayerSprite.id = existingBoats[i].owner;
			    dPlayerSprite.anchor.setTo(0.5, 0.5);
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

	}









	function update() {

		sprite.body.velocity.x = 0;
	    sprite.body.velocity.y = 0;
	    sprite.body.angularVelocity = 0;


	    // each loop we decrease the speed of the boat to create the momentum effect
	    if(sprite.momentumVelocity>0)
	    {
	    	sprite.momentumVelocity -= 1;
	    }


	    // Turn Left or Right
	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	        sprite.body.angularVelocity = -200;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	        sprite.body.angularVelocity = 200;
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
	    	lBulletsDatasToSend[bullet.bulletId] = {ownerId: bullet.ownerId, x: bullet.x, y: bullet.y};
	    }, this);
	    

	    // move the boat locally
	    game.physics.arcade.velocityFromAngle(sprite.angle, sprite.momentumVelocity, sprite.body.velocity);
	    
	   	// detect collisions between:
	    game.physics.arcade.overlap(lBullets, dPlayers, hitEnnemy, null, this); // local bullets and ennemy
	    game.physics.arcade.overlap(dBullets, sprite, hitMyself, null, this); // distant bullets and current player
	    // game.physics.arcade.collide(sprite, dPlayers); // two boats

    	// finaly we update the database with new position of the boat
		Meteor.call("updateBoat", 
				Meteor.user(), 
				{	
					x: sprite.body.x, 
					y: sprite.body.y, 
					angle: sprite.angle, 
					health: sprite.health
				},
				lBulletsDatasToSend
				);

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


	function hitEnnemy(bullet){
		bullet.kill();
		console.log("I hit him");
	}

	function hitMyself(bullet){
		bullet.kill();
		console.log("I've been hit");
		sprite.health += -1;
		$("#debug").text(sprite.health);
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
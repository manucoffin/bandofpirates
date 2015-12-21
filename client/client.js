Meteor.subscribe('boats');



Template.game.rendered = function() {

	// retrieve the just-created boat id while we don't have user accounts etc
	var boatId;

	// Meteor.call("insertBoat", function(error, result){
	// 	boatId = result;
	// 	console.log(boatId)
	// });
	
	var olofggdg;

// move the boat locally
// update the db with the position
// broadcast the position
// update all boats position exept the one of the user

	var query = Boats.find({});
	var handle = query.observeChanges({
		// callback each time the boats db changes
		changed: function () {
			var boatsArray = query.fetch();

			// the last boat created 
			let boat = boatsArray[boatsArray.length-1];

			sprite.body.velocity.x = 0;
	    	sprite.body.velocity.y = 0;
	    	sprite.body.angularVelocity = boat.angularVelocity;

			game.physics.arcade.velocityFromAngle(sprite.angle, boat.momentumVelocity, sprite.body.velocity);
			
			// for(var i=0; i<boatsArray.length; i++)
			// {
			// 	// boatsArray[i]
			// }
			// console.log(query.fetch());

		}
	});



// ------------------------------------
//		THE GAME
// ------------------------------------


	var game = new Phaser.Game(
		1024, // size of the canvas created
		768,
		Phaser.AUTO,
		'game-view', // div in which the canvas is appened
		{ 
			preload: preload,
			create: create,
			update: update
		}
	);

	var map;
	var layer;
	var player;
	var sprite;
	var cursors;
	var point = new Phaser.Point();

	function preload(){
	
		game.load.tilemap('worldTileMap', 'assets/worldMap.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'assets/tiles/super_mario.png');
    	game.load.image('player','assets/sprites/guybrush_sprite.png');

	}

	function create() {

		game.stage.backgroundColor = '#787878';
	    map = game.add.tilemap('worldTileMap');
	    map.addTilesetImage('SuperMarioTileset', 'tiles');
	    layer = map.createLayer('Background');
	    layer.resizeWorld();
	    game.world.setBounds(0, 0, 1600, 1600);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// ---------------------------------------
	    // 	Sprite settings:
	    // ---------------------------------------
		sprite = game.add.sprite(400, 300, 'player');
	    game.physics.enable(sprite, Phaser.Physics.ARCADE);
	    sprite.anchor.setTo(0.5, 0.5);
	    sprite.momentumVelocity = 0;
	    // sprite.body.setCircle(44);


	    // to use the keyboard
	    cursors = game.input.keyboard.createCursorKeys();
	    game.camera.follow(sprite);

	}

	function update() {

		// set an object to be send to the database
		let boatProperties = {
			angularVelocity: 0,
			momentumVelocity: 0
		}

		// sprite.body.velocity.x = 0;
	 //    sprite.body.velocity.y = 0;
	 //    sprite.body.angularVelocity = 0;



	    // each loop we decrease the speed of the boat to create the momentum effect
	    if(sprite.momentumVelocity>0)
	    {
	    	sprite.momentumVelocity -= 1;
	    	boatProperties.momentumVelocity = sprite.momentumVelocity;
	    }

	    // on keyboard input, we update the object
	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	        // sprite.body.angularVelocity = -200;
	        boatProperties.angularVelocity = -200;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	        // sprite.body.angularVelocity = 200;
	        boatProperties.angularVelocity = 200;
	    }

	    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	    {
	    	// set the velocity, which create a thrust
	        sprite.momentumVelocity = 200;
	        boatProperties.momentumVelocity = sprite.momentumVelocity;
	    }

	    // set the new point coordinates
	    // game.physics.arcade.velocityFromAngle(sprite.angle, sprite.momentumVelocity, sprite.body.velocity);
	    
	    // finaly we update the database with new properties stored in the object
		// Meteor.call("updateBoat", boatId, sprite.x, sprite.y);
		Meteor.call("updateBoat", boatId, boatProperties);
		
	}
}
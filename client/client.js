Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});







// ------------------------------------------------------------------------
//		BOAT CLASS
// ------------------------------------------------------------------------


class Boat {
	constructor(id, x, y){
		this.id = id;
		this.x = x;
		this.y = y;
	}
}




// move the player's boat locally
// update the db with the new position of player's boat
// update all distant players boats' position locally


Meteor.subscribe('boats'); // get messages send from the server

Template.game.rendered = function() {

	// array of distant players
	var dPlayers;


	// return an array of all created boats
	var query = Boats.find({});
	
	var existingBoats = query.fetch();

	// for(var i=0; i<existingBoats.length; i++)
	// {
	// 	// if owner of the boat is not the user currently logged in
	// 	if ( existingBoats[i].owner != Meteor.user()._id )
	// 	{
	// 		dPlayers.push({
	// 			sprite: "",
	// 			id: ""
	// 		});
	// 	}

	// 	var dPlayer = 
	// }

	var handle = query.observeChanges({
		// callback each time the boats db changes
		changed: function () {


			// need to declare the array again because it is not accessible from here
			let boatsArray = query.fetch();


			// dPlayers.forEach(function (enemy) {
		 //    	enemy.body.x = boatsArray
		 //    });


			

			// loop through all the boats into the database
			for(var i=0; i<boatsArray.length; i++)
			{
				// if the boat is not owned by the current user
				if (boatsArray[i].owner != Meteor.user()._id)
				{
					$("#test").html(boatsArray[i].x + " __ " + boatsArray[i].y);


					// then we loop in our local enemy array
					dPlayers.forEach(function(enemy) {
						// console.log(enemy.id);
						// and if the id in local array and the one in the db match
						if(enemy.id == boatsArray[i].owner) {
							// we update the coordinates
							enemy.x = boatsArray[i].x;
							enemy.y = boatsArray[i].y;
						}
					}, this);

					// populate and update array of distant players with id of players
					// dPlayers[i].id = boatsArray[i].owner;

					// console.log(dPlayers[i].id);

					// move distant players boats
					// dPlayers[i].sprite.body.x = boatsArray[i].x;
					// dPlayers[i].sprite.body.y = boatsArray[i].y;
				}
			}

			// console.log(dPlayers);
		}
	});



	// function createDistantPlayer(){
	// 	let boat = new Boat(30, 30);
	// 	dPlayers.add(boat);
	// }


// ------------------------------------------------------------------------
//		THE GAME
// ------------------------------------------------------------------------







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
	var sprite;
	var cursors;








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

	    dPlayers = game.add.group();
		dPlayers.enableBody = true;
	    dPlayers.physicsBodyType = Phaser.Physics.ARCADE;



	    // initialize the array of distant players
	    for(var i=0; i<existingBoats.length; i++)
		{
			// if owner of the boat is not the user currently logged in
			if ( existingBoats[i].owner != Meteor.user()._id )
			{

			    let dPlayerSprite = game.add.sprite(100, 100, 'player');
			    dPlayerSprite.id = existingBoats[i].owner;

			    dPlayers.add(dPlayerSprite);

			    // dPlayers.create('player');

			    // var boat = new Boat(existingBoats[i].owner, 100, 100);
			    // dPlayers.add(boat);

			    // createDistantPlayer();
			    //dPlayers.createMultiple(50, 'player');
			    // dPlayers.setAll('anchor.x', 0.5);
			    // dPlayers.setAll('anchor.y', 0.5);
			    // dPlayers.setAll('outOfBoundsKill', true);
			    // dPlayers.setAll('checkWorldBounds', true);
			    // dPlayers.forEach(function (enemy) {
			    // 	enemy.id = existingBoats[i].owner;
			    // 	console.log(enemy)
			    // 	// console.log("id enemy : " + enemy.id)
			    // });

				// dPlayers.id = existingBoats[i].owner;
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


	    // on keyboard input, change angle or speed of the boat
	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	        sprite.body.angularVelocity = -200;
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	        sprite.body.angularVelocity = 200;
	    }

	    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	    {
	    	// set the velocity, which create a thrust
	    	// 200 is arbitrary value, greater value increase inertia
	        sprite.momentumVelocity = 200;
	    }

	    // move the boat locally
	    game.physics.arcade.velocityFromAngle(sprite.angle, sprite.momentumVelocity, sprite.body.velocity);
	    
	    // finaly we update the database with new position of the boat
		Meteor.call("updateBoat", Meteor.user(), {x: sprite.body.x, y: sprite.body.y});
		
	}
}











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
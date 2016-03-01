// What we do in this file :
// when the game template is rendered, we initialize the game for local player
// (set up the map, the variables...etc)
// then, when the player move or do anything, we do the changes locally
// and we send player's data to the database, so that each player infos are constantly updated
// so we can get other players datas from the database, and display them locally




// Override Meteor._debug to filter for custom msgs
Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  }
})(Meteor._debug);








Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

// subscription to server publications to pass datas between client/server via the databases
Meteor.subscribe('boats');
Meteor.subscribe('userStatus');
Meteor.subscribe('messages'); // chat messages








function startGame() {

	console.log("starting game...");

	drawJollyRoger(76); // draw the life jauge full

// ------------------------------------------------------------------------
// 		INITIALIZE SETTINGS 
// ------------------------------------------------------------------------




	var game = new Phaser.Game(
		950, // size of the canvas created
		550,
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
	var nextFire = 0;
	var lBulletsDatasToSend = []; // an array of useful datas about bullets that we send in the database
	var cloudsGroup;
	var explosion;

	var query = Boats.find({});	
	var existingBoats = query.fetch(); // all the boats stored in the database
	var myBoat = Boats.find({'owner': Meteor.user()._id}); // get only the boat of current user







	// we need to observe the changes in the database: 
	// each time something change we update the sprite locally
	var handle = myBoat.observeChanges({
		changed: function () {
			// need to declare the array again because it is not accessible from here
 			let myBoatData = myBoat.fetch();

			sprite.maxHealth = myBoatData[0].maxHealth;
			sprite.fireRate = myBoatData[0].fireRate;
			sprite.damages = myBoatData[0].damages;
			sprite.speed = myBoatData[0].speed;

			$("#debug").text(sprite.fireRate + " ____ " +sprite.maxHealth + " ____ "+sprite.damages + " ____ "+sprite.speed)
		}
	})





// ------------------------------------------------------------------------
// 		ON STREAMY MESSAGES
// ------------------------------------------------------------------------




	// Attach an handler for boats datas messages
	Streamy.on('boatsDatas', function(d) {
		// if the emmiter of message is not the client itself
		if(d.data.userId != Meteor.user()._id)
		{
			// then we loop in our local enemy array
			dPlayers.forEach(function(enemy) {
				// and if the id in local array and the one in the db match
				if(enemy.id == d.data.userId) {
					// we update the coordinates
					enemy.x = d.data.x + enemy.width/4;
					enemy.y = d.data.y + enemy.height/4;
					enemy.angle = d.data.angle;
					enemy.nameLabel.x = enemy.x - enemy.width/2;
					enemy.nameLabel.y = enemy.y - 60;

					// change sprite image depending on the angle
				    switch (enemy.angle){
			    	case 0:
			    		enemy.loadTexture('right', 0);
			    		// enemy.body.setSize(50, 20, 0, 20);
			    		break;

			    	case 45:
			    		enemy.loadTexture('bottomRight', 0);
			    		// enemy.body.setSize(40, 30, 3, 15);
			    		break;

			    	case 90:
			    		enemy.loadTexture('bottom', 0);
			    		// enemy.body.setSize(25, 30, 0, 10);
			    		break;

			    	case 135:
			    		enemy.loadTexture('bottomLeft', 0);
			    		// enemy.body.setSize(45, 35, 0, 10);
			    		break;

			    	case -180:
			    		enemy.loadTexture('left', 0);
			    		// enemy.body.setSize(50, 20, 0, 20);
			    		break;	

			    	case -45:
			    		enemy.loadTexture('topRight', 0);
			    		// enemy.body.setSize(40, 30, 3, 15);
			    		break;

			    	case -90:
			    		enemy.loadTexture('top', 0);
			    		// enemy.body.setSize(25, 30, 0, 10);
			    		break;

			    	case -135:
			    		enemy.loadTexture('topLeft', 0);
			    		// enemy.body.setSize(45, 35, 0, 10);
			    		break;

			    	case -180:
			    		enemy.loadTexture('left', 0);
			    		// enemy.body.setSize(50, 20, 0, 20);
			    		break;

			    	default:
			    		enemy.loadTexture('right', 0);
			    		// enemy.body.setSize(50, 20, 0, 20);
			    		break;
			    }

				}

			}, this);




			// we also loop in the bullets array of each boat
			dBullets.forEach(function(bullet) {
				if (bullet.ownerId == d.data.userId)
				{
					// if the bullet is alive
					if(d.data.bullets[bullet.bulletId].alive == true)
					{
						// we update its coordinates
						bullet.x = d.data.bullets[bullet.bulletId].x;
						bullet.y = d.data.bullets[bullet.bulletId].y;
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
	});

	// when a player hits another
	Streamy.on("hitDatas", function(d){

		// we check if the curent user have been hit
		if(d.data.target == Meteor.user()._id)
		{
			// inform the player that he has been hit
			$("#fight-logs").text(d.data.username + " hit you!");

			// if the player still has health then
			if(sprite.health > d.data.damages)
			{
				// we decrease his health
				sprite.health += -d.data.damages;
				$("#health").text(sprite.health);
				// draw the life jauge with new percentage
				let lifePercentage = sprite.health/sprite.maxHealth*100;
				drawJollyRoger(76*lifePercentage/100);

			}
			else
			{
				// play the death animation
				sprite.dead = true;

				// play the animation at the position where the player is
				explosion.x = sprite.x-sprite.width/2;
				explosion.y = sprite.y-sprite.height/2;
				explosion.animations.play("explode", 10, false);
				// once the animation is finished, it triggers the death function				
				

				// we decrese his gold amount
				var goldLost = Math.round(sprite.gold*0.25);
				sprite.gold += -goldLost;

				Meteor.call("updateGold", Meteor.user()._id, -goldLost); // update the database

				// broadcast a message "gold transfer" between the players
				Streamy.broadcast('goldTransfer', { data: 
					{
						senderId: Meteor.user()._id,
						senderUsername: Meteor.user().username,
						target: d.data.userId,
						value: goldLost
					}
				});

				// also broadcast a "death message" to tell the other players that somebody has died and where
				Streamy.broadcast('deathMessage', {data:
					{
						senderId: Meteor.user()._id,
						senderUsername: Meteor.user().username,
						deathPosition: {x:explosion.x, y:explosion.y}
					}
				});

			}
		}
	});


	Streamy.on("goldTransfer", function(d){
		// check if the gold transfer concerns us
		if(d.data.target == Meteor.user()._id)
		{
			// update the gold amount with the gold stolen
			let ammount = d.data.value + 100; // gold stolen + fixed reward to create gold in the game
			sprite.gold += ammount; // update locally
			Meteor.call("updateGold", Meteor.user()._id, ammount); // update the database
		}

	});


	Streamy.on('clouds_datas', function(d){

		for(var i=0; i<cloudsGroup.children.length; i++)
		{
			cloudsGroup.children[i].x = d.positions[i].x;
			cloudsGroup.children[i].y = d.positions[i].y;
		}
	});


	Streamy.on('deathMessage', function(d){
		$("#fight-logs").text(d.data.senderUsername + "'s boat sank!");

		dPlayers.forEach(function(enemy) {
			// if it is the user that has sent the message
			if(enemy.id == d.data.senderId) {
				// create an explosion sprite at its position
				var dExplosion = game.add.sprite(d.data.deathPosition.x, d.data.deathPosition.y, 'explosion');
			    // attach its animation 
			    var dExplode = dExplosion.animations.add('explode');
			    // attach a callback to kill the sprite when the animation is complete
			    dExplode.killOnComplete = true;
			    // and play the animation
				dExplosion.animations.play("explode", 10, false);
			}
		}, this);

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


			// change the coordinates of the player that has disconnected 
			
			//on the database
			Meteor.call("killBoat", user);

			// and locally
			dPlayers.forEach(function(enemy) {
				// find the user who have disconnect
				if(enemy.id == user._id) {
					// send him away
					enemy.x = -1000;
					enemy.y = -1000;
				}
			}, this);
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

    	game.load.spritesheet('explosion','assets/sprites/explosion.png', 40,40);
    
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
	    

	    // get where the boat was on its previous sessions

	    // local player sprite settings
		sprite = game.add.sprite(100, 100, 'right');
	    game.physics.enable(sprite, Phaser.Physics.ARCADE);
	    sprite.anchor.setTo(0.5, 0.5);
	    sprite.momentumVelocity = 0;

	    sprite.fireSide = 90;
	    sprite.body.setSize(40, 40, 5, 5);
	    sprite.body.collideWorldBounds=true;

	    sprite.maxHealth = Boats.find({'owner': Meteor.user()._id}).fetch()[0].maxHealth;
	    sprite.health = sprite.maxHealth;
	    sprite.gold = Boats.find({'owner': Meteor.user()._id}).fetch()[0].gold;
	    sprite.damages = Boats.find({'owner': Meteor.user()._id}).fetch()[0].damages;
	    sprite.fireRate = Boats.find({'owner': Meteor.user()._id}).fetch()[0].fireRate;

	    var rotateSprite = sprite.animations.add('rotateSprite');
	    
	    // add an explosion sprite outside the game view
	    explosion = game.add.sprite(-100, -100, 'explosion');
	    // attach its animation 
	    var explode = explosion.animations.add('explode');
	    // callback when animation is complete
	    explosion.animations.currentAnim.onComplete.add(function(){
	    	// function that reset sprite position, health... etc
			death(sprite);
		}, this);

	    // update the status bar
	    $("#health").text(sprite.maxHealth);





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
			    let dPlayerSprite = game.add.sprite(-1000, -1000, 'right');
			    dPlayerSprite.anchor.setTo(0.5, 0.5);
			    dPlayerSprite.id = existingBoats[i].owner;
			    
			    // add label on remote players
	    		dPlayerSprite.nameLabel = game.add.text(0, 0, 
	    								existingBoats[i].username, 
	    								{ 
	    									font: "28px tream",
	    									stroke: '#000000',
    										strokeThickness: 3, 
	    									fill: "#ffffff", 
	    									align:"center",
	    									wordWrap: true, 
	    									wordWrapWidth: dPlayerSprite.width 
	    								});
			    
	    		// add explosion sprite to each players
	    		// var dExplosion = game.add.sprite(0, 0, 'explosion');
			    // // attach its animation 
			    // var dExplode = dExplosion.animations.add('explode');
			    // dPlayerSprite.addChild(dExplosion);

			    dPlayers.add(dPlayerSprite);

			    // then we loop through bullets array of each boat
			    for(var j=0; j<existingBoats[i].bullets.length; j++)
			    {
			    	// and we create the bullets sprites
			    	let dBulletSprite = game.add.sprite(-1000, -1000, 'bullet');
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

	    
	    addKeyEvents();

	    $("#message-content").focusin(function(){
	    	game.input.onDown.removeAll();
	    	game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
			game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
			game.input.keyboard.removeKey(Phaser.Keyboard.A);
			game.input.keyboard.removeKey(Phaser.Keyboard.E);
	    })

		$("#message-content").focusout(function(){
			addKeyEvents();
		});

		
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


	}









	function update() {



		sprite.body.velocity.x = 0;
	    sprite.body.velocity.y = 0;
	    sprite.body.angularVelocity = 0;

	    // enable collision between player and tiles
	    game.physics.arcade.collide(sprite, layer);
	    game.physics.arcade.collide(lBullets, layer, killBullet);
	    game.physics.arcade.collide(sprite, dPlayers, boatsCollision);


	    // each loop we decrease the speed of the boat to create the momentum effect
	    if(sprite.momentumVelocity>0)
	    {
	    	sprite.momentumVelocity -= 1;
	    	// particleEmitter.emitParticle();
	    }

	    // if the sprite is alive
	    if (sprite.dead != true)
	    {
	    	// change sprite image depending on the angle
		    switch (sprite.angle){
		    	case 0:
		    		sprite.loadTexture('right', 0);
		    		// sprite.body.setSize(50, 20, 0, 20);
		    		break;

		    	case 45:
		    		sprite.loadTexture('bottomRight', 0);
		    		// sprite.body.setSize(40, 30, 3, 15);
		    		break;

		    	case 90:
		    		sprite.loadTexture('bottom', 0);
		    		// sprite.body.setSize(25, 30, 0, 10);
		    		break;

		    	case 135:
		    		sprite.loadTexture('bottomLeft', 0);
		    		// sprite.body.setSize(45, 35, 0, 10);
		    		break;

		    	case -180:
		    		sprite.loadTexture('left', 0);
		    		// sprite.body.setSize(50, 20, 0, 20);
		    		break;	

		    	case -45:
		    		sprite.loadTexture('topRight', 0);
		    		// sprite.body.setSize(40, 30, 3, 15);
		    		break;

		    	case -90:
		    		sprite.loadTexture('top', 0);
		    		// sprite.body.setSize(25, 30, 0, 10);
		    		break;

		    	case -135:
		    		sprite.loadTexture('topLeft', 0);
		    		// sprite.body.setSize(45, 35, 0, 10);
		    		break;

		    	case -180:
		    		sprite.loadTexture('left', 0);
		    		// sprite.body.setSize(50, 20, 0, 20);
		    		break;

		    	default:
		    		sprite.loadTexture('right', 0);
		    		// sprite.body.setSize(50, 20, 0, 20);
		    		break;
		    }
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
	    // game.physics.arcade.collide(sprite, dPlayers); // two boats


		// finaly we update the database with new position of the boat
		// Send a message to all connected sessions (Client & server)
		Streamy.broadcast('boatsDatas', { data: 
			{
				userId: Meteor.user()._id,
				username: Meteor.user().username,
				x: sprite.body.x, 
				y: sprite.body.y,
				width: sprite.width,
				height: sprite.height,
				angle: sprite.angle,
				bullets: lBulletsDatasToSend
			}
		});

	}



	// DEBUG
	function render() {

	    // game.debug.spriteInfo(sprite, 32, 32);
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
	        nextFire = game.time.now + sprite.fireRate;

	        // get a "dead" bullet (inactive bullet)
	        let bullet = lBullets.getFirstDead();

	        // and bring it back to life at sprite position
	        bullet.reset(sprite.x, sprite.y);

	        // make the bullet move in the direction wanted
	        bullet.rotation = sprite.rotation;
	        // send the bullet perpendicularly of the angle of boat
	        // left or right depending on the fireside selected
	        game.physics.arcade.velocityFromRotation(angle+(Math.PI*sprite.fireSide/180), 400, bullet.body.velocity);
	    }
	}


	function hitEnnemy(bullet, player){
		bullet.kill(); // kill the bullet locally
		Streamy.broadcast('hitDatas', { data: 
			{
				userId: Meteor.user()._id,
				username: Meteor.user().username,
				target: player.id,
				damages: sprite.damages
			}
		});
	}


	function killBullet(bullet, layer){
		bullet.kill();
	}

	function boatsCollision(player, dplayer){
		// Decrease health
	}

	function death(player){
	
		$("#fight-logs").text("you are dead");		

		// the player is dead so
		// we reset his position and health
		sprite.x = 100;
		sprite.y = 100;
		sprite.health = sprite.maxHealth;
		drawJollyRoger(76);
		player.dead = false;
		$("#health").text(sprite.health);		

	}




	function addKeyEvents(){
		// handle the sprite rotation
	    rotateLeftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rotateRightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		fireSideLeftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
		fireSideRightButton = game.input.keyboard.addKey(Phaser.Keyboard.E);

	    rotateLeftButton.onDown.add(function(){
	    	// sprite.loadTexture('player2', 0);
	    	if (sprite.angle>=-180)
	    		sprite.angle += -45;
	    	else
	    		sprite.angle += 360;
	    }, this);

	    
	    rotateRightButton.onDown.add(function(){
	    	// sprite.loadTexture('player', 0);
	    	if (sprite.angle<=180)
	    		sprite.angle += 45;
	    	else
	    		sprite.angle += -360;
	    }, this);

	    fireSideLeftButton.onDown.add(function(){
	    	sprite.fireSide = -90;
	    	$("#fireside").text("LEFT");
	    }, this);

	    fireSideRightButton.onDown.add(function(){
	    	sprite.fireSide = 90;
	    	$("#fireside").text("RIGHT");
	    }, this);
	}



	// Save datas every 10 seconds in the database
	let timer = setInterval(function(){
		Meteor.call("updateBoat", 
				Meteor.user(), 
				{
					x: sprite.body.x, 
					y: sprite.body.y, 
					angle: sprite.angle,
					health: sprite.health // do not confuse current health and max health
				},
				lBulletsDatasToSend
				);
	}, 10000);

}









// ------------------------------------------------------------------------
// 		TEMPLATE HANDLERS
// ------------------------------------------------------------------------





Template.menu.events({
	"click #start-btn": function(){
		$("#menu").css("display", "none");
		$("#status-bar").css("display", "block");
		$("#chat").css("display", "block");
		$("#game-container").css("display", "block");

		// check if the looged in user already have a boat
		let userId = Meteor.user()._id;
		var boatExist = Boats.findOne({'owner': userId});

		if(typeof boatExist == 'undefined')
		{
			Meteor.call("insertBoat");
			startGame();
		}
		else
		{
			startGame();
		}
	}
});



Template.body.events({

	"click #dropCollectionBtn": function(){
		Meteor.call("clearCollection");
	},

	"click #logout-btn":function(){

		Meteor.logout();

	}

});

Template.statusBar.helpers({
	'boatData': function(){
		return Boats.find({'owner': Meteor.user()._id});
	}
});


Template.upgradePannel.helpers({
	'boatData': function(){
		return Boats.find({'owner': Meteor.user()._id});
	}
});

Template.upgradePannel.events({
	"click .plus-btn": function(ev){

		let currentStats = Boats.find({'owner': Meteor.user()._id}).fetch()[0];
		let amount = 0;

		// stats object
		stats = {
			maxHealth: 0,
			fireRate: 0,
			damages: 0,
			speed: 0
		}

		// set the increment value and the gold amount
		if(ev.target.id == "health-btn")
		{
			amount = currentStats.maxHealth*1.2;
			// check if the user has enough gold
			if(amount > currentStats.gold)
				return

			stats.maxHealth = 5;
			// for the health we also want to update the status bar
		}
		else if(ev.target.id == "firerate-btn")
		{
			amount = currentStats.fireRate/10*1.2;
			if(amount > currentStats.gold)
				return

			stats.fireRate = 100;
		}
		else if(ev.target.id == "damages-btn")
		{
			amount = currentStats.damages*10*1.2;
			if(amount > currentStats.gold)
				return

			stats.damages = 1;
		}
		else if(ev.target.id == "speed-btn")
		{
			amount = currentStats.speed*10*1.2;
			if(amount > currentStats.gold)
				return

			stats.speed = 1;
		}
			

		Meteor.call("upgradeBoat", Meteor.user()._id, stats);
		// SPEND GOLD
		Meteor.call("updateGold", Meteor.user()._id, -amount);
	}

});



Template.chat.helpers({
	'messages': function(){
		let count = Messages.find().count();
		return Messages.find( {}, { sort: {date : 1}, skip: count-100, limit: 100 } );
	}
});

// Global template helpers
Template.registerHelper('formatDate', function(date) {
	// we use this function to format date in the template
	return moment(date).format('HH:mm'); 
});

Template.chat.events({

	'keypress input': function(event) {
        if (event.keyCode == 13) { // press ENTER key
        	
            let message = $("#message-content").val();
            $("#message-content").val(""); // reset the input field
			Meteor.call("insertMessage", Meteor.user(), message);

            event.stopPropagation();
            return false;
        }
    }
});


Template.chat.onRendered(function () {
	// scroll to the bottom of the div
	var height = $("#messages")[0].scrollHeight;
	$("#messages").scrollTop(height);
	
});

Template.game.rendered = function() {

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

	function preload(){
	
		game.load.tilemap('worldTileMap', 'assets/worldMap.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'assets/tiles/super_mario.png');
    	game.load.image('player','assets/sprites/guybrush_sprite.png');

	}

/*
	function create() {

	    game.stage.backgroundColor = '#787878';
	    map = game.add.tilemap('worldTileMap');
	    map.addTilesetImage('SuperMarioTileset', 'tiles');
	    layer = map.createLayer('Background');
	    layer.resizeWorld();

	    // set the size of the map
	    game.world.setBounds(0, 0, 1024, 768);
    	

	    //  Enable Arcade Physics for the player
	    // game.physics.enable(player, Phaser.Physics.ARCADE);

	    //  Tell it we don't want physics to manage the rotation
	    // player.body.allowRotation = false;
	    // player.body.move = false;

	    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    	game.physics.enable(player, Phaser.Physics.ARCADE);

    	player.body.collideWorldBounds = true;
    	player.anchor.setTo(0.5, 0.5);
    	
    	game.input.onDown.add(moveBoat, this);
    	// game.camera.follow(player);

	}

	function update(){

	}


	function moveBoat(pointer) {
		//  300 = 300 pixels per second = the speed the sprite will move at, regardless of the distance it has to travel
		var duration = (game.physics.arcade.distanceToPointer(player, pointer) / 300) * 1000;
		tween = game.add.tween(player).to( {x: pointer.worldX, y: pointer.worldY}, duration, Phaser.Easing.Linear.None);

	    tween.start();

	}

	*/

	var static1;
	var static2;
	var sprite;
	var cursors;

	function create() {

		game.stage.backgroundColor = '#787878';
	    map = game.add.tilemap('worldTileMap');
	    map.addTilesetImage('SuperMarioTileset', 'tiles');
	    layer = map.createLayer('Background');
	    layer.resizeWorld();
	    game.world.setBounds(0, 0, 1600, 1600);

		//	Enable p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);

	    //  Make things a bit more bouncey
	    // game.physics.p2.restitution = 0.8;

	    //  Add a sprite
		sprite = game.add.sprite(400, 300, 'player');
	    game.physics.p2.enable(sprite);
	    // sprite.body.setCircle(44);

	    // to use the keyboard
	    cursors = game.input.keyboard.createCursorKeys();

	    game.camera.follow(sprite);

	}

	function update() {

	    if (cursors.left.isDown)
	    {
	    	sprite.body.rotateLeft(80);
	    }
	    else if (cursors.right.isDown)
	    {
	    	sprite.body.rotateRight(80);
	    }
	    else
	    {
	        sprite.body.setZeroRotation();
	    }

	    if (cursors.up.isDown)
	    {
	    	sprite.body.thrust(100);
	    }
	    else if (cursors.down.isDown)
	    {
	    	sprite.body.reverse(100);
	    }

	}
}

Template.game.rendered = function() {

	var game = new Phaser.Game(
		800, // size of the canvas created
		600,
		Phaser.CANVAS,
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
	var dest;
	var s;

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
	    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    	

	    game.camera.follow(player);

	    player.anchor.setTo(0.5, 0.5);

	    //  Enable Arcade Physics for the player
	    game.physics.enable(player, Phaser.Physics.ARCADE);

	    //  Tell it we don't want physics to manage the rotation
	    player.body.allowRotation = false;
	    player.body.move = false;

	    game.input.onDown.add(moveBoat, this);

	}

	function update(){

	}


	function moveBoat(pointer) {
		//  300 = 300 pixels per second = the speed the sprite will move at, regardless of the distance it has to travel
		var duration = (game.physics.arcade.distanceToPointer(player, pointer) / 500) * 1000;
		tween = game.add.tween(player).to( {x: pointer.worldX, y: pointer.worldY}, duration, Phaser.Easing.Linear.None);

	    tween.start();

	}

}

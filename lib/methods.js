Meteor.methods({

	insertBoat : function() {
		console.log("insert new boat");
		return Boats.insert({
			// BOAT DATA
			x: 100,
			y: 100,
			angle: 0,
			bullets: null,
			dead: false,
			gold: 100,
			health: 100,

			// UPGRADABLE STATS
			fireRate: 1000,
			maxHealth: 100,
			damages: 10,
			speed: 1,

			// LEADERBOARDS DATA
			score: 1000,
			nbKills: 0,
			nbDeath: 0,

			// USER DATA
			createdAt: new Date(), // current time
			owner: Meteor.userId(), // _id of logged in user
        	username: Meteor.user().username, // username of logged in user
        	connected: false // connexion status
		});
	},

	updateConnStatus: function(userId, status){
		Boats.update({'owner': userId}, 
		{$set: 
			{
				'connected': status
			} 
		})
	},

	updateBoat : function(user, boatDatas, bulletsArray) {
		console.log(user.username + " boat is being updated...")
		Boats.update({'owner': user._id}, 
		{$set: 
			{
				'x': boatDatas.x, 
				'y': boatDatas.y,
				'angle': boatDatas.angle,
				'bullets': bulletsArray, // group of bullet's sprites
				'health': boatDatas.health
			} 
		})
	},

	updateGold: function(user, ammount){
		Boats.update({'owner': user}, 
		{$inc: 
			{
				'gold': ammount
			} 
		})
	},

	hurtEnemy: function(user, newHealth){
		Boats.update({'owner': user.owner}, 
		{$set: 
			{
				'health': newHealth,
			} 
		})
	},

	upgradeBoat: function(user, stats){

		Boats.update({'owner': user}, 
		{$inc: 
			{
				fireRate: stats.fireRate,
				maxHealth: stats.maxHealth,
				damages: stats.damages,
				speed: stats.speed
			} 
		})
	},

	updateNbDeath: function(userId){
		Boats.update({'owner': userId}, 
		{$inc: 
			{
				nbDeath: 1
			} 
		})
	},

	updateNbKills: function(userId){
		Boats.update({'owner': userId}, 
		{$inc: 
			{
				nbKills: 1
			} 
		})
	},

	updateScore: function(userId, increment){
		Boats.update({'owner': userId}, 
		{$inc: 
			{
				score: increment
			} 
		})
	},

	killBoat: function(user){
		Boats.update({'owner': user._id}, 
		{$set: 
			{
				// 'dead': true,
				'x': -1000, 
				'y': -1000 
			} 
		})
	},

	respawn: function(user){
		Boats.update({'owner': user._id}, 
		{$set: 
			{
				'x': Math.round(Math.random()*500),
				'y': Math.round(Math.random()*500)
			} 
		})
	},

	insertMessage: function(user, message){
		return Messages.insert({
			'userId': user._id,
			'username': user.username,
			'message': message,
			'date': new Date()
		});
	},

	// useful function to remove all elements of a collection without reseting meteor
	clearCollection : function() {
		console.log("drop all collection");
		return Messages.remove({})
	}

});
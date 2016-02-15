Meteor.methods({

	insertBoat : function() {
		console.log("insert new boat");
		return Boats.insert({
			x: 100,
			y: 100,
			angle: 0,
			bullets: null,
			dead: false,
			gold: 100,

			// UPGRADABLE STATS
			fireRate: 1000,
			health: 100,
			damages: 0,
			speed: 0,

			// USER DATA
			createdAt: new Date(), // current time
			owner: Meteor.userId(), // _id of logged in user
        	username: Meteor.user().username // username of logged in user
		});
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
				'health': boatDatas.health,
				'gold': boatDatas.gold
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
				health: stats.health,
				damages: stats.damages,
				speed: stats.speed
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

	// useful function to remove all elements of a collection without reseting meteor
	clearCollection : function() {
		console.log("drop all collection");
		return Boats.remove({})
	}

});
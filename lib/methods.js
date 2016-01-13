Meteor.methods({

	insertBoat : function() {
		console.log("insert new boat");
		return Boats.insert({
			x: 0,
			y: 0,
			angle: 0,
			health: 10,
			bullets: null,
			dead: false,
			createdAt: new Date(), // current time
			owner: Meteor.userId(), // _id of logged in user
        	username: Meteor.user().username // username of logged in user
		});
	},

	updateBoat : function(user, boatDatas, bulletsArray) {
		Boats.update({'owner': user._id}, 
		{$set: 
			{
				'x': boatDatas.x, 
				'y': boatDatas.y,
				'angle': boatDatas.angle,
				'health': boatDatas.health,
				'bullets': bulletsArray // group of bullet's sprites
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
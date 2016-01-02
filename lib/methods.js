Meteor.methods({

	insertBoat : function() {
		console.log("insert new boat");
		return Boats.insert({
			x: 0,
			y: 0,
			angle: 0,
			health: 10,
			bullets: null,
			createdAt: new Date(), // current time
			owner: Meteor.userId(), // _id of logged in user
        	username: Meteor.user().username // username of logged in user
		});
	},

	updateBoat : function(user, boatDatas, bulletsArray) {

		// find the boat that is owned by the logged in user
		// var query = Boats.find({'owner': user._id}).fetch();

		// console.log(user._id);
		// query is an array of elements of collection, so don't forget the []
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

	// useful function to remove all elements of a collection without reseting meteor
	clearCollection : function() {
		console.log("drop all collection");
		return Boats.remove({})
	}

});
Meteor.methods({

	insertBoat : function() {
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

	updateBoat : function(userId, boatDatas, bulletsArray) {
		// find the boat that is owned by the logged in user
		var query = Boats.find({'owner': userId._id}).fetch();

		// query is an array of elements of collection, so don't forget the []
		Boats.update(query[0]._id, 
			{$set: 
				{ 	
					'x': boatDatas.x, 
					'y': boatDatas.y,
					'angle': boatDatas.angle,
					'bullets': bulletsArray // group of bullet's sprites
				} 
			})
	},

	// useful function to remove all elements of a collection without reseting meteor
	clearCollection : function() {
		return Boats.remove({})
	},

	insertBullet : function() {

	}

});

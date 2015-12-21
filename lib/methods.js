Meteor.methods({

	insertBoat : function() {
		return Boats.insert({
			angularVelocity: 0,
			momentumVelocity: 0,
			x: 0,
			y: 0,
			createdAt: new Date() // current time
		});
	},

	updateBoat : function(boatId, boatObject) {
		Boats.update(boatId, 
			{$set: 
				{ 	
					'angularVelocity': boatObject.angularVelocity, 
					'momentumVelocity': boatObject.momentumVelocity
				} 
			})
	}

});

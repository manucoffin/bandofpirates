Meteor.methods({

	insertBoat : function() {
		return Boats.insert({
			timer: 0,
			createdAt: new Date() // current time
		});
	},

	updateBoat : function(boatId, timer) {
		Boats.update(boatId, {$set : {'timer': timer}});
	}

});

// Meteor.startup(function () {
	
// });





// ------------------------------------------------------------------------
// 		COLLECTIONS PUBLICATION
// ------------------------------------------------------------------------






Meteor.publish('boats', function() {
	return Boats.find({});
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

Meteor.publish("messages", function() {
  return Messages.find({});
});




	



// ------------------------------------------------------------------------
// 		CLOUDS HANDLING
// ------------------------------------------------------------------------






var cloudsPositions = [];
for (var i = 0; i < 40; i++) {
	cloudsPositions[i] = {x: Math.random()*1600, y: Math.random()*1600};
};

// Generate a random wind direction
let wind = {dx: Math.random()*2, dy: Math.random()*2};


let serverUpdate = setInterval(function(){

	for (var i = 0; i < 40; i++) {
		let newX, newY;

		if(cloudsPositions[i].x < 1600)
		{
			newX = cloudsPositions[i].x + wind.dx;	
		}
		else
		{
			newX = 0;
		}
		
		if(cloudsPositions[i].y < 1600)
		{
			newY = cloudsPositions[i].y + wind.dy;	
		}
		else
		{
			newY = 0;
		}
		

		cloudsPositions[i] = {x: newX, y: newY};
	};
	
	Streamy.broadcast('clouds_datas',
		{
			positions: cloudsPositions
		}
	);

}, 300);
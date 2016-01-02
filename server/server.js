Meteor.startup(function () {
	Meteor.publish('boats', function() {
		return Boats.find({});
	});
});



// Meteor.publish('bullets', function() {
// 	return Bullets.find({});
// }); 
Meteor.startup(function () {

});


Meteor.publish('boats', function() {
	return Boats.find({});
}); 
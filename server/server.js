Meteor.startup(function () {
	
});

Meteor.publish('boats', function() {
	return Boats.find({});
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});
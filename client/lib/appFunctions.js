userStatusLiveUpdate = function(user, status){
	$("#liveUpdateDiv").css("opacity", "1");
	$("#liveUpdateDiv").text(user + status);
	if(status==" is online")
		$("#liveUpdateDiv").css("color", "rgb(0,255,0)");
	else
		$("#liveUpdateDiv").css("color", "rgb(255,96,61)");
	window.setTimeout(function(){
		$( "#liveUpdateDiv" ).fadeTo( "slow" , 0, function() {
			// Animation complete.
		});
	}, 2000)
},

updateFightLogs = function(string, arr){
	arr.unshift(string);
	if(arr.length>2)
		arr.pop();
	
	var htmlString = "";
	for (var i=0; i<arr.length; i++){
		htmlString += "<p>"+arr[i]+"</p>";
	}

	$("#fight-logs").html(htmlString);
}

scrollDownChat = function(){
	// scroll to the bottom of the div
	var height = $("#messages")[0].scrollHeight;
	$("#messages").scrollTop(height);
}
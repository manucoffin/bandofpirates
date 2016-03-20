updateLifeBar = function (userSprite, newWidth) {

	userSprite.barSprite.x = userSprite.x - userSprite.width/2 + 5;
	userSprite.barSprite.y = userSprite.y + 35;
	userSprite.barSprite.width = newWidth;

}

calculateScore = function(enemyScore, playerScore, result){
	
	let increment = 0;

	if(result === "win")
	{
		increment = Math.round(enemyScore - playerScore)+30;
	}
	else if(result === "loose")
	{
		increment = 30-Math.round(enemyScore - playerScore);
	}
		

	if(increment<1)
		increment = 1;
	else if(increment>30)
		increment = 30;

	return increment;
}
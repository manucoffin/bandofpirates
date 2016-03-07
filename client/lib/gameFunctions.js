updateLifeBar = function (userSprite, newWidth) {

	userSprite.barSprite.x = userSprite.x - userSprite.width/2 + 5;
	userSprite.barSprite.y = userSprite.y + 35;
	userSprite.barSprite.width = newWidth;

}
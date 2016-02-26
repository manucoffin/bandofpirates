drawJollyRoger = function(rectHeight) {
	
	var canvas = document.getElementById('jolly-roger-canvas');
	var context = canvas.getContext('2d');
	var tempCanvas = document.getElementById('temp-canvas');
	var tempContext = tempCanvas.getContext('2d');

	var squareWidth = 150;
	// var rectHeight = 76;
	var circleRadius = 35;
	var shapeOffset = 50;
	var operationOffset = 150;


	var thisOperation = "source-atop";

	tempContext.save();

	// clear temp context
	tempContext.clearRect(0, 0, canvas.width, canvas.height);
	context.clearRect(0, 0, canvas.width, canvas.height);


	// draw skull (source)

	// calque2/Groupe/Trac transparent
	tempContext.save();
	tempContext.save();
	tempContext.beginPath();

	// calque2/Groupe/Trac transparent/Trac
	tempContext.moveTo(35.4, 24.2);
	tempContext.bezierCurveTo(36.5, 24.7, 36.2, 24.2, 36.3, 23.8);
	tempContext.bezierCurveTo(36.5, 23.4, 36.1, 17.9, 36.5, 17.5);
	tempContext.bezierCurveTo(36.8, 17.0, 37.5, 14.8, 37.5, 14.8);
	tempContext.bezierCurveTo(37.5, 14.8, 38.0, 13.5, 38.2, 13.4);
	tempContext.bezierCurveTo(38.4, 13.3, 38.2, 9.3, 38.2, 9.3);
	tempContext.bezierCurveTo(38.2, 9.3, 40.7, 5.7, 41.0, 6.1);
	tempContext.bezierCurveTo(41.4, 6.5, 40.0, 8.1, 39.4, 9.2);
	tempContext.bezierCurveTo(38.7, 10.4, 39.1, 12.0, 39.1, 12.0);
	tempContext.bezierCurveTo(39.1, 12.0, 39.3, 13.9, 38.7, 14.4);
	tempContext.bezierCurveTo(38.2, 14.9, 37.6, 15.9, 37.5, 17.4);
	tempContext.bezierCurveTo(37.5, 18.9, 36.5, 21.0, 37.5, 23.6);
	tempContext.bezierCurveTo(37.5, 23.6, 37.5, 24.2, 37.3, 24.4);
	tempContext.bezierCurveTo(37.0, 24.7, 36.8, 25.1, 36.9, 25.8);
	tempContext.bezierCurveTo(37.0, 26.6, 36.2, 26.9, 36.2, 26.9);
	tempContext.bezierCurveTo(36.2, 26.9, 36.1, 27.2, 35.5, 27.3);
	tempContext.bezierCurveTo(34.9, 27.3, 35.0, 27.7, 35.4, 29.0);
	tempContext.bezierCurveTo(35.9, 30.3, 36.4, 30.9, 36.4, 30.9);
	tempContext.bezierCurveTo(36.4, 30.9, 36.5, 31.5, 37.9, 31.4);
	tempContext.bezierCurveTo(39.2, 31.4, 40.1, 31.4, 40.3, 31.0);
	tempContext.bezierCurveTo(40.4, 30.7, 41.9, 30.1, 43.7, 31.8);
	tempContext.bezierCurveTo(45.5, 33.6, 46.3, 35.5, 46.3, 35.5);
	tempContext.bezierCurveTo(46.3, 35.5, 46.4, 36.0, 47.6, 36.0);
	tempContext.bezierCurveTo(48.8, 36.0, 49.1, 35.8, 49.1, 35.8);
	tempContext.bezierCurveTo(49.1, 35.8, 50.0, 35.8, 49.3, 36.9);
	tempContext.bezierCurveTo(48.6, 38.0, 48.6, 39.0, 48.8, 39.4);
	tempContext.bezierCurveTo(49.1, 39.9, 50.1, 40.5, 50.5, 39.2);
	tempContext.bezierCurveTo(50.9, 37.8, 50.6, 37.5, 50.6, 37.5);
	tempContext.bezierCurveTo(50.6, 37.5, 49.9, 36.9, 50.1, 36.6);
	tempContext.bezierCurveTo(50.3, 36.3, 50.1, 35.9, 50.6, 35.8);
	tempContext.bezierCurveTo(51.2, 35.7, 51.7, 35.9, 51.5, 36.3);
	tempContext.bezierCurveTo(51.4, 36.7, 51.2, 37.2, 51.5, 37.7);
	tempContext.bezierCurveTo(51.8, 38.1, 51.4, 38.5, 51.4, 38.9);
	tempContext.bezierCurveTo(51.4, 39.3, 51.4, 39.7, 52.0, 39.7);
	tempContext.bezierCurveTo(52.6, 39.7, 52.7, 38.9, 52.9, 38.7);
	tempContext.bezierCurveTo(53.1, 38.6, 53.4, 37.7, 52.9, 37.4);
	tempContext.bezierCurveTo(52.5, 37.0, 52.7, 35.9, 53.2, 35.9);
	tempContext.bezierCurveTo(53.7, 35.9, 53.9, 36.0, 54.1, 36.6);
	tempContext.bezierCurveTo(54.3, 37.2, 54.3, 37.1, 54.0, 37.4);
	tempContext.bezierCurveTo(53.7, 37.7, 53.7, 38.1, 53.7, 38.7);
	tempContext.bezierCurveTo(53.7, 39.2, 53.6, 39.7, 54.8, 39.6);
	tempContext.bezierCurveTo(56.0, 39.5, 55.6, 38.8, 55.7, 38.3);
	tempContext.bezierCurveTo(55.7, 37.7, 55.1, 36.7, 55.3, 36.2);
	tempContext.bezierCurveTo(55.6, 35.8, 56.3, 35.6, 56.3, 36.6);
	tempContext.bezierCurveTo(56.3, 37.5, 55.9, 38.5, 56.5, 39.5);
	tempContext.bezierCurveTo(57.0, 40.5, 57.7, 39.7, 57.7, 39.7);
	tempContext.bezierCurveTo(57.7, 39.7, 58.2, 38.9, 57.7, 37.9);
	tempContext.bezierCurveTo(57.3, 36.8, 57.1, 36.4, 57.9, 35.8);
	tempContext.bezierCurveTo(58.8, 35.2, 58.4, 34.4, 58.4, 34.4);
	tempContext.bezierCurveTo(58.4, 34.4, 59.6, 32.3, 60.9, 31.3);
	tempContext.bezierCurveTo(62.3, 30.3, 64.2, 30.5, 64.2, 30.5);
	tempContext.bezierCurveTo(64.2, 30.5, 67.0, 29.9, 67.2, 28.8);
	tempContext.bezierCurveTo(67.5, 27.8, 67.9, 26.6, 67.9, 26.6);
	tempContext.bezierCurveTo(67.9, 26.6, 68.2, 25.9, 67.0, 25.4);
	tempContext.bezierCurveTo(65.8, 25.0, 65.5, 25.1, 65.3, 22.8);
	tempContext.bezierCurveTo(65.0, 20.5, 65.5, 18.8, 65.5, 18.8);
	tempContext.bezierCurveTo(65.5, 18.8, 66.0, 18.1, 66.3, 19.8);
	tempContext.bezierCurveTo(66.5, 21.5, 66.3, 23.3, 66.3, 23.3);
	tempContext.bezierCurveTo(66.3, 23.3, 66.5, 24.1, 67.3, 23.1);
	tempContext.bezierCurveTo(68.1, 22.1, 69.6, 21.0, 69.6, 12.1);
	tempContext.bezierCurveTo(69.6, 12.1, 69.5, 10.1, 68.3, 8.8);
	tempContext.bezierCurveTo(67.2, 7.5, 64.2, 3.3, 64.2, 3.3);
	tempContext.bezierCurveTo(64.2, 3.3, 61.4, 0.0, 57.0, 0.0);
	tempContext.lineTo(49.3, 0.0);
	tempContext.bezierCurveTo(49.3, 0.0, 45.8, 0.4, 45.3, 1.0);
	tempContext.bezierCurveTo(44.9, 1.5, 42.5, 1.6, 42.5, 1.6);
	tempContext.bezierCurveTo(42.5, 1.6, 41.2, 2.4, 40.2, 3.3);
	tempContext.bezierCurveTo(39.3, 4.3, 37.8, 5.4, 37.5, 6.2);
	tempContext.bezierCurveTo(37.2, 7.0, 35.9, 8.0, 35.5, 10.6);
	tempContext.bezierCurveTo(35.0, 13.3, 34.0, 15.2, 34.6, 18.0);
	tempContext.bezierCurveTo(35.1, 20.9, 34.3, 23.8, 35.4, 24.2);
	tempContext.closePath();

	// calque2/Groupe/Trac transparent/Trac
	tempContext.moveTo(55.1, 18.1);
	tempContext.bezierCurveTo(56.5, 16.4, 58.7, 16.7, 58.7, 16.7);
	tempContext.bezierCurveTo(61.5, 16.9, 61.3, 17.5, 62.2, 18.0);
	tempContext.bezierCurveTo(63.1, 18.6, 63.3, 20.1, 63.4, 20.9);
	tempContext.bezierCurveTo(63.5, 21.6, 63.2, 23.7, 62.2, 24.9);
	tempContext.bezierCurveTo(61.2, 26.1, 60.3, 26.2, 59.4, 26.2);
	tempContext.bezierCurveTo(58.5, 26.2, 57.4, 25.3, 57.1, 24.9);
	tempContext.bezierCurveTo(56.8, 24.4, 54.4, 21.3, 54.3, 20.9);
	tempContext.bezierCurveTo(54.2, 20.5, 53.7, 19.7, 55.1, 18.1);
	tempContext.closePath();

	// calque2/Groupe/Trac transparent/Trac
	tempContext.moveTo(51.3, 24.5);
	tempContext.bezierCurveTo(51.4, 23.9, 51.8, 23.8, 52.0, 23.3);
	tempContext.bezierCurveTo(52.2, 22.8, 52.5, 22.7, 52.5, 22.7);
	tempContext.bezierCurveTo(53.1, 22.7, 53.3, 23.8, 53.2, 23.9);
	tempContext.bezierCurveTo(53.2, 24.0, 54.0, 25.0, 54.2, 25.6);
	tempContext.bezierCurveTo(54.5, 26.1, 55.3, 26.7, 55.2, 27.1);
	tempContext.bezierCurveTo(55.2, 27.5, 55.9, 29.3, 55.7, 30.1);
	tempContext.bezierCurveTo(55.5, 30.9, 54.5, 31.5, 54.3, 31.6);
	tempContext.bezierCurveTo(54.0, 31.6, 53.6, 31.3, 53.2, 30.5);
	tempContext.bezierCurveTo(52.9, 29.7, 52.4, 29.3, 52.2, 29.3);
	tempContext.bezierCurveTo(52.0, 29.3, 51.2, 30.8, 50.9, 31.0);
	tempContext.bezierCurveTo(50.7, 31.1, 50.1, 31.3, 49.9, 30.4);
	tempContext.bezierCurveTo(49.6, 29.6, 49.9, 29.1, 50.1, 28.7);
	tempContext.bezierCurveTo(50.2, 28.3, 50.4, 27.2, 50.5, 26.6);
	tempContext.bezierCurveTo(50.6, 26.0, 51.2, 25.1, 51.3, 24.5);
	tempContext.closePath();

	// calque2/Groupe/Trac transparent/Trac
	tempContext.moveTo(43.7, 17.4);
	tempContext.bezierCurveTo(44.2, 16.7, 47.2, 16.5, 47.2, 16.5);
	tempContext.bezierCurveTo(48.3, 16.4, 49.8, 18.5, 50.2, 19.1);
	tempContext.bezierCurveTo(50.6, 19.7, 50.0, 21.0, 48.8, 23.2);
	tempContext.bezierCurveTo(47.7, 25.4, 47.6, 25.5, 45.2, 26.0);
	tempContext.bezierCurveTo(42.7, 26.6, 42.9, 26.2, 41.1, 24.3);
	tempContext.bezierCurveTo(39.2, 22.5, 41.4, 19.0, 41.4, 19.0);
	tempContext.bezierCurveTo(41.4, 19.0, 43.2, 18.0, 43.7, 17.4);
	tempContext.closePath();
	tempContext.fillStyle = "rgb(220, 218, 218)";
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(47.5, 38.2);
	tempContext.bezierCurveTo(47.6, 37.1, 47.8, 36.7, 47.3, 36.7);
	tempContext.bezierCurveTo(47.3, 36.7, 45.9, 37.5, 45.8, 38.0);
	tempContext.bezierCurveTo(45.7, 38.5, 45.9, 38.8, 46.5, 38.8);
	tempContext.bezierCurveTo(47.1, 38.9, 47.4, 39.4, 47.5, 38.2);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(41.4, 43.5);
	tempContext.bezierCurveTo(42.4, 44.1, 42.8, 44.4, 42.9, 44.7);
	tempContext.bezierCurveTo(43.0, 45.0, 44.2, 46.1, 44.5, 46.3);
	tempContext.bezierCurveTo(44.7, 46.4, 46.3, 47.6, 46.3, 48.1);
	tempContext.bezierCurveTo(46.4, 48.5, 47.0, 48.5, 47.0, 48.5);
	tempContext.bezierCurveTo(47.0, 48.5, 52.1, 49.2, 52.5, 49.2);
	tempContext.bezierCurveTo(53.0, 49.2, 55.8, 49.5, 55.8, 49.5);
	tempContext.bezierCurveTo(55.8, 49.5, 56.3, 49.7, 57.4, 48.6);
	tempContext.bezierCurveTo(58.5, 47.6, 60.6, 45.2, 61.5, 44.5);
	tempContext.bezierCurveTo(62.4, 43.7, 63.3, 42.9, 63.5, 40.5);
	tempContext.bezierCurveTo(63.8, 38.1, 64.3, 35.3, 63.5, 34.4);
	tempContext.bezierCurveTo(63.5, 34.4, 62.9, 33.4, 62.4, 34.1);
	tempContext.bezierCurveTo(62.0, 34.9, 61.5, 34.8, 61.4, 34.9);
	tempContext.bezierCurveTo(61.3, 35.1, 60.5, 35.7, 60.4, 36.5);
	tempContext.bezierCurveTo(60.2, 37.4, 60.0, 38.4, 60.0, 39.0);
	tempContext.bezierCurveTo(60.0, 39.6, 59.1, 40.7, 59.0, 41.3);
	tempContext.bezierCurveTo(59.0, 41.9, 58.1, 42.8, 58.0, 42.9);
	tempContext.bezierCurveTo(57.9, 43.0, 57.0, 43.3, 56.8, 42.5);
	tempContext.bezierCurveTo(56.6, 41.8, 56.5, 40.8, 56.3, 40.9);
	tempContext.bezierCurveTo(56.1, 41.0, 55.4, 41.8, 55.4, 41.8);
	tempContext.bezierCurveTo(55.4, 41.8, 55.3, 43.0, 55.1, 43.2);
	tempContext.bezierCurveTo(55.0, 43.4, 54.6, 43.9, 54.0, 43.7);
	tempContext.bezierCurveTo(53.5, 43.4, 53.6, 43.0, 53.8, 42.8);
	tempContext.bezierCurveTo(53.9, 42.7, 54.3, 40.8, 53.0, 40.7);
	tempContext.bezierCurveTo(51.8, 40.7, 51.6, 41.8, 51.7, 42.4);
	tempContext.bezierCurveTo(51.9, 42.9, 52.3, 43.5, 52.0, 43.8);
	tempContext.bezierCurveTo(51.7, 44.1, 51.7, 43.9, 51.3, 43.8);
	tempContext.bezierCurveTo(50.9, 43.7, 50.5, 43.3, 50.5, 42.4);
	tempContext.bezierCurveTo(50.5, 41.6, 50.6, 41.4, 50.0, 41.0);
	tempContext.bezierCurveTo(49.4, 40.7, 49.1, 40.6, 49.2, 41.6);
	tempContext.bezierCurveTo(49.3, 42.5, 49.1, 43.7, 49.0, 43.8);
	tempContext.bezierCurveTo(48.8, 43.9, 48.6, 43.3, 48.5, 42.9);
	tempContext.bezierCurveTo(48.5, 42.5, 48.7, 41.9, 47.9, 41.3);
	tempContext.bezierCurveTo(47.0, 40.7, 46.7, 40.7, 46.4, 41.4);
	tempContext.bezierCurveTo(46.1, 42.1, 46.7, 42.6, 46.7, 42.6);
	tempContext.bezierCurveTo(46.7, 42.6, 46.9, 43.1, 46.4, 43.2);
	tempContext.bezierCurveTo(45.8, 43.3, 44.5, 41.9, 44.5, 41.9);
	tempContext.bezierCurveTo(44.5, 41.9, 43.7, 41.3, 43.5, 38.5);
	tempContext.bezierCurveTo(43.3, 35.6, 42.6, 35.1, 42.5, 35.1);
	tempContext.bezierCurveTo(42.4, 35.1, 41.8, 34.1, 41.8, 34.1);
	tempContext.bezierCurveTo(41.8, 34.1, 41.2, 32.7, 40.5, 32.6);
	tempContext.bezierCurveTo(39.9, 32.6, 39.5, 32.6, 39.5, 33.5);
	tempContext.bezierCurveTo(39.5, 34.4, 39.6, 35.8, 40.0, 36.7);
	tempContext.bezierCurveTo(40.5, 37.7, 40.4, 39.7, 40.5, 40.4);
	tempContext.bezierCurveTo(40.5, 41.1, 40.6, 42.2, 40.6, 42.2);
	tempContext.bezierCurveTo(40.6, 42.2, 40.3, 42.8, 41.4, 43.5);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(74.6, 67.8);
	tempContext.lineTo(74.6, 66.4);
	tempContext.bezierCurveTo(74.5, 64.7, 72.7, 64.7, 72.7, 64.7);
	tempContext.bezierCurveTo(66.9, 63.3, 57.3, 59.5, 50.2, 56.8);
	tempContext.bezierCurveTo(43.1, 54.1, 33.3, 46.5, 33.3, 46.5);
	tempContext.bezierCurveTo(64.0, 64.4, 74.7, 63.0, 74.7, 63.0);
	tempContext.bezierCurveTo(78.3, 61.3, 77.0, 60.7, 77.0, 60.7);
	tempContext.bezierCurveTo(29.2, 52.9, 0.0, 10.8, 0.0, 10.8);
	tempContext.bezierCurveTo(-0.6, 26.1, 19.6, 42.8, 33.3, 52.5);
	tempContext.bezierCurveTo(47.0, 62.2, 58.9, 64.4, 58.9, 64.4);
	tempContext.bezierCurveTo(58.9, 64.4, 72.7, 68.2, 73.9, 68.2);
	tempContext.bezierCurveTo(75.0, 68.2, 74.6, 67.8, 74.6, 67.8);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(82.5, 62.8);
	tempContext.bezierCurveTo(83.8, 61.7, 85.2, 59.1, 85.3, 58.9);
	tempContext.bezierCurveTo(85.4, 58.7, 87.0, 57.3, 87.2, 57.3);
	tempContext.bezierCurveTo(87.3, 57.3, 89.0, 56.8, 89.1, 56.6);
	tempContext.bezierCurveTo(89.1, 56.4, 89.5, 56.1, 88.8, 55.6);
	tempContext.bezierCurveTo(88.2, 55.2, 87.2, 53.6, 86.0, 53.6);
	tempContext.bezierCurveTo(84.8, 53.6, 84.4, 53.6, 83.3, 54.6);
	tempContext.bezierCurveTo(82.2, 55.6, 81.7, 56.7, 81.7, 57.4);
	tempContext.bezierCurveTo(81.7, 58.2, 80.2, 61.3, 75.8, 63.4);
	tempContext.bezierCurveTo(75.8, 63.4, 74.7, 63.7, 75.3, 65.1);
	tempContext.bezierCurveTo(75.9, 66.5, 76.1, 66.7, 76.0, 67.3);
	tempContext.bezierCurveTo(75.8, 67.9, 75.6, 70.0, 75.6, 70.0);
	tempContext.bezierCurveTo(75.6, 70.0, 74.8, 71.4, 74.4, 71.8);
	tempContext.bezierCurveTo(74.0, 72.1, 73.9, 72.5, 72.7, 72.5);
	tempContext.bezierCurveTo(71.5, 72.5, 69.9, 71.8, 69.9, 71.8);
	tempContext.bezierCurveTo(69.9, 71.8, 67.9, 71.3, 67.8, 72.5);
	tempContext.bezierCurveTo(67.6, 73.8, 67.4, 74.3, 67.4, 74.3);
	tempContext.bezierCurveTo(67.4, 74.3, 67.3, 74.9, 68.5, 75.3);
	tempContext.bezierCurveTo(69.7, 75.7, 69.9, 76.0, 72.4, 76.0);
	tempContext.bezierCurveTo(75.0, 76.1, 75.8, 75.7, 76.8, 75.1);
	tempContext.bezierCurveTo(77.8, 74.5, 78.1, 74.9, 79.1, 72.3);
	tempContext.bezierCurveTo(80.1, 69.7, 80.6, 69.7, 81.2, 65.6);
	tempContext.bezierCurveTo(81.2, 65.6, 81.2, 64.0, 82.5, 62.8);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(92.1, 66.3);
	tempContext.bezierCurveTo(92.7, 64.4, 92.5, 63.8, 92.5, 63.8);
	tempContext.bezierCurveTo(92.5, 63.8, 92.7, 62.9, 91.7, 63.0);
	tempContext.lineTo(84.9, 63.1);
	tempContext.bezierCurveTo(84.9, 63.1, 84.4, 62.8, 83.7, 63.7);
	tempContext.bezierCurveTo(82.9, 64.6, 82.0, 65.4, 82.2, 66.5);
	tempContext.bezierCurveTo(82.5, 67.7, 82.6, 68.0, 83.5, 68.2);
	tempContext.bezierCurveTo(84.5, 68.4, 89.6, 68.2, 89.6, 68.2);
	tempContext.bezierCurveTo(89.6, 68.2, 91.4, 68.2, 92.1, 66.3);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(92.9, 69.6);
	tempContext.bezierCurveTo(92.9, 69.6, 91.6, 68.3, 90.5, 69.3);
	tempContext.bezierCurveTo(90.5, 69.3, 90.0, 70.0, 91.4, 70.9);
	tempContext.bezierCurveTo(92.8, 71.8, 93.6, 71.4, 93.6, 71.4);
	tempContext.bezierCurveTo(93.6, 71.4, 94.2, 70.7, 92.9, 69.6);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(98.5, 63.5);
	tempContext.bezierCurveTo(97.8, 62.9, 97.2, 62.1, 95.4, 62.0);
	tempContext.bezierCurveTo(95.4, 62.0, 94.5, 61.8, 94.5, 61.7);
	tempContext.bezierCurveTo(94.6, 61.6, 93.5, 61.8, 93.2, 62.1);
	tempContext.bezierCurveTo(93.0, 62.3, 92.2, 63.6, 93.7, 63.5);
	tempContext.bezierCurveTo(93.7, 63.5, 94.8, 63.6, 94.2, 64.4);
	tempContext.bezierCurveTo(93.7, 65.3, 92.5, 66.3, 93.2, 68.0);
	tempContext.bezierCurveTo(93.8, 69.7, 95.0, 70.2, 95.2, 70.2);
	tempContext.bezierCurveTo(95.4, 70.2, 95.9, 70.8, 97.7, 68.3);
	tempContext.lineTo(98.9, 66.9);
	tempContext.bezierCurveTo(98.9, 66.9, 99.1, 66.8, 99.1, 65.6);
	tempContext.bezierCurveTo(99.1, 64.4, 99.2, 64.1, 98.5, 63.5);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(14.5, 70.1);
	tempContext.bezierCurveTo(13.6, 70.2, 12.7, 71.0, 11.8, 70.7);
	tempContext.bezierCurveTo(10.8, 70.4, 9.9, 70.4, 9.9, 69.8);
	tempContext.bezierCurveTo(9.9, 69.8, 9.5, 68.7, 11.1, 68.9);
	tempContext.bezierCurveTo(12.7, 69.2, 15.1, 70.0, 14.9, 66.4);
	tempContext.bezierCurveTo(14.6, 62.9, 12.1, 64.2, 11.8, 64.4);
	tempContext.bezierCurveTo(11.4, 64.6, 7.5, 66.7, 7.4, 67.7);
	tempContext.bezierCurveTo(7.3, 68.7, 7.2, 69.5, 7.8, 70.4);
	tempContext.bezierCurveTo(8.4, 71.3, 9.3, 72.3, 11.1, 72.3);
	tempContext.bezierCurveTo(12.9, 72.3, 14.5, 72.3, 14.9, 71.4);
	tempContext.bezierCurveTo(15.2, 70.5, 15.3, 70.0, 14.5, 70.1);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(24.2, 64.4);
	tempContext.bezierCurveTo(24.2, 64.4, 24.1, 63.6, 21.3, 64.0);
	tempContext.bezierCurveTo(21.3, 64.0, 17.2, 63.9, 16.6, 66.3);
	tempContext.bezierCurveTo(16.0, 68.6, 15.7, 69.0, 15.7, 69.0);
	tempContext.bezierCurveTo(15.7, 69.0, 15.3, 69.6, 16.8, 69.6);
	tempContext.bezierCurveTo(18.3, 69.7, 21.4, 69.8, 21.5, 69.6);
	tempContext.bezierCurveTo(21.7, 69.5, 23.7, 69.0, 24.2, 69.0);
	tempContext.bezierCurveTo(24.7, 69.1, 25.3, 68.8, 25.1, 67.4);
	tempContext.bezierCurveTo(24.8, 66.1, 24.2, 64.4, 24.2, 64.4);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(37.8, 71.7);
	tempContext.bezierCurveTo(36.0, 72.2, 33.8, 72.3, 33.4, 71.6);
	tempContext.bezierCurveTo(33.0, 70.9, 31.9, 70.5, 32.4, 67.5);
	tempContext.bezierCurveTo(32.4, 67.5, 33.0, 66.0, 33.0, 65.3);
	tempContext.bezierCurveTo(33.0, 64.6, 32.6, 64.2, 32.1, 64.0);
	tempContext.bezierCurveTo(31.7, 63.9, 29.5, 61.2, 29.2, 60.6);
	tempContext.bezierCurveTo(29.2, 60.6, 27.7, 56.7, 27.2, 55.9);
	tempContext.bezierCurveTo(26.7, 55.1, 26.0, 53.5, 26.0, 53.5);
	tempContext.bezierCurveTo(26.0, 53.5, 25.8, 53.1, 24.2, 53.5);
	tempContext.bezierCurveTo(22.6, 53.9, 21.1, 55.1, 21.1, 55.4);
	tempContext.bezierCurveTo(21.2, 55.6, 21.2, 56.5, 21.9, 56.6);
	tempContext.bezierCurveTo(22.6, 56.6, 22.9, 57.7, 23.4, 58.3);
	tempContext.bezierCurveTo(23.8, 59.0, 24.8, 62.0, 24.9, 63.2);
	tempContext.bezierCurveTo(24.9, 64.4, 25.6, 67.2, 26.6, 68.2);
	tempContext.bezierCurveTo(27.6, 69.2, 27.5, 70.8, 28.5, 72.1);
	tempContext.bezierCurveTo(29.5, 73.4, 31.6, 75.5, 33.6, 75.6);
	tempContext.bezierCurveTo(35.5, 75.8, 39.0, 75.3, 39.5, 74.8);
	tempContext.bezierCurveTo(40.0, 74.3, 39.9, 73.6, 39.9, 73.3);
	tempContext.bezierCurveTo(39.9, 73.0, 39.9, 73.0, 39.9, 73.0);
	tempContext.bezierCurveTo(39.9, 73.0, 39.5, 71.2, 37.8, 71.7);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(35.1, 62.9);
	tempContext.bezierCurveTo(35.6, 62.9, 37.5, 63.0, 39.5, 61.9);
	tempContext.bezierCurveTo(41.5, 60.8, 42.9, 60.4, 43.2, 60.3);
	tempContext.bezierCurveTo(43.5, 60.3, 44.2, 60.0, 43.6, 59.7);
	tempContext.bezierCurveTo(43.1, 59.5, 41.8, 58.7, 41.8, 58.7);
	tempContext.bezierCurveTo(41.8, 58.7, 41.0, 58.4, 39.9, 58.7);
	tempContext.bezierCurveTo(39.9, 58.7, 33.1, 61.1, 32.6, 61.2);
	tempContext.bezierCurveTo(32.2, 61.3, 32.2, 61.8, 32.9, 62.1);
	tempContext.bezierCurveTo(33.5, 62.5, 34.5, 62.9, 35.1, 62.9);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(48.7, 62.3);
	tempContext.bezierCurveTo(47.6, 61.8, 46.6, 61.1, 46.6, 61.1);
	tempContext.bezierCurveTo(46.6, 61.1, 45.7, 60.5, 44.2, 61.5);
	tempContext.bezierCurveTo(44.2, 61.5, 41.0, 62.9, 40.7, 62.9);
	tempContext.bezierCurveTo(40.4, 62.9, 38.8, 62.9, 38.1, 63.3);
	tempContext.bezierCurveTo(37.3, 63.7, 34.0, 65.6, 34.3, 66.8);
	tempContext.bezierCurveTo(34.6, 68.0, 35.4, 67.8, 35.8, 67.9);
	tempContext.bezierCurveTo(36.3, 67.9, 39.8, 66.7, 39.9, 66.6);
	tempContext.bezierCurveTo(40.1, 66.5, 44.6, 65.2, 44.9, 64.7);
	tempContext.bezierCurveTo(45.1, 64.1, 48.6, 63.2, 48.9, 63.1);
	tempContext.bezierCurveTo(49.2, 63.0, 49.8, 62.7, 48.7, 62.3);
	tempContext.closePath();
	tempContext.fill();

	// calque2/Groupe/Trac
	tempContext.beginPath();
	tempContext.moveTo(60.4, 49.1);
	tempContext.bezierCurveTo(59.9, 49.5, 58.0, 51.3, 56.7, 51.7);
	tempContext.bezierCurveTo(55.3, 52.1, 55.3, 52.5, 56.1, 53.3);
	tempContext.bezierCurveTo(56.8, 54.1, 58.2, 54.0, 58.2, 54.0);
	tempContext.bezierCurveTo(58.2, 54.0, 60.1, 52.5, 61.4, 52.4);
	tempContext.bezierCurveTo(62.6, 52.3, 73.1, 44.7, 73.5, 44.1);
	tempContext.bezierCurveTo(73.9, 43.5, 78.7, 40.7, 78.7, 40.7);
	tempContext.bezierCurveTo(72.2, 48.3, 61.4, 53.6, 61.4, 53.6);
	tempContext.bezierCurveTo(61.4, 53.6, 58.8, 54.3, 60.5, 55.0);
	tempContext.bezierCurveTo(62.2, 55.6, 66.5, 55.0, 66.5, 55.0);
	tempContext.bezierCurveTo(103.5, 31.1, 102.3, 9.4, 102.3, 9.4);
	tempContext.bezierCurveTo(102.3, 8.8, 100.5, 11.7, 100.5, 11.7);
	tempContext.bezierCurveTo(99.9, 13.9, 96.0, 18.0, 95.3, 19.0);
	tempContext.bezierCurveTo(94.7, 20.0, 82.2, 32.7, 81.2, 33.9);
	tempContext.bezierCurveTo(80.2, 35.1, 64.2, 47.1, 63.3, 47.5);
	tempContext.bezierCurveTo(62.4, 47.9, 60.9, 48.8, 60.4, 49.1);
	tempContext.closePath();
	tempContext.fill();
	tempContext.restore();
	tempContext.restore();









	// set global composite
	tempContext.globalCompositeOperation = thisOperation;



	// draw rectangle (destination)
	tempContext.beginPath();
	tempContext.rect(0, 76-Math.round(rectHeight), squareWidth, Math.round(rectHeight));
	tempContext.fillStyle = 'red'
	tempContext.fill();
	tempContext.restore();


	// copy drawing from tempCanvas onto visible canvas
	context.drawImage(tempCanvas, 0, 0);
}
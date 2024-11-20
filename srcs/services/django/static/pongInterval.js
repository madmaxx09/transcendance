			//---------- Canvas infos ----------------------------------------------------------------------


			const canvas = document.getElementById("myCanvas");
			const ctx = canvas.getContext("2d");
			const navbar = document.querySelector('nav.navbar');
			let padelHeight;
			let padelWidth;
			let oldWidth;
			let oldHeight;
			let navbarHeight;

			handleWindowSize();

			//----------- Ball coordinates -----------------------------------------------------------------

			let x = canvas.width / 2;
			let y = canvas.height - 10;

			//---------- Ball vectors/size/bounce angles/speed----------------------------------------------

			let dx = (canvas.width / 2) / 200;
			let dy = -1 * ((canvas.height / 2) / 200);
			const ballRadius = 10;
			let relativeIntersectionY = 0;
			let normalizedIntersectionY = 0;
			let bounceAngle = 0;
			let ballSpeed = canvas.width / 250;

			//---------- Paddle size/coordinates/state------------------------------------------------------

			let leftPaddle = (canvas.height - paddleHeight) / 2;
			let rightPaddle = (canvas.height - paddleHeight) / 2;
			let leftPaddleDownPressed = false;
			let leftPaddleUpPressed = false;
			let rightPaddleDownPressed = false;
			let rightPaddleUpPressed = false;

			//---------- Interval is the current running "loop" --------------------------------------------

			let interval = 0;
			let oldTime = new Date();
			let matchDebut = new Date();

			//---------- Players related informations ------------------------------------------------------

			let leftScore = 0;
			let rightScore = 0;
			let playersCount = 8;
			let	players = [
				{name:"Player 1", score:0, alive:true},
				{name:"Player 2", score:0, alive:true},
				{name:"Player 3", score:0, alive:true},
				{name:"Player 4", score:0, alive:true},
				{name:"Player 5", score:0, alive:true},
				{name:"Player 6", score:0, alive:true},
				{name:"Player 7", score:0, alive:true},
				{name:"Player 8", score:0, alive:true}
			];
			let tournamentId = 0;
			let tempMatchId = 0;
			let _matches = [];
			let postIndex = 0;

			//---------- Menu related informations ---------------------------------------------------------

			let boxHover = false;
			let menuBool = true;

			//---------- player1 and player2 are the players currently playing a match ---------------------

			// let alias;
			let player1 = "Player 1";
			let player2 = "Player 2";
			let winner = 0;
			let tournamentWinner = 0;
			let index = 0;
			let aiDir = 0;
			let difficultyCoeff = 0.3;

			//---------- gameMode 0 => SOLO ---------- gameMode 1 => DUO ---------- gameMode 2 => TOURNAMENT

			let gameMode = 0;

			//---------- Matchmaking related variables -----------------------------------------------------

			let totalPoints = 0;
			let matchmakingIndex = 0;
			let foundPair = 0;
			let loopDirection = 0;

			//----------------------------------------------------------------------------------------------

			function resetWholeGame()
			{
				resetGame();
				_matches = [];
				postIndex = 0;
				player1 = "Player 1";
				player2 = "Player 2";
				winner = 0;
				tournamentWinner = 0;
				index = 0;
				gameMode = 1;
				totalPoints = 0;
				matchmakingIndex = 0;
				foundPair = 0;
				loopDirection = 0;
				playersCount = 1;
				tempMatchId = 0;
				players = [
				{name:"Player 1", score:0, alive:true},
				{name:"Player 2", score:0, alive:true},
				{name:"Player 3", score:0, alive:true},
				{name:"Player 4", score:0, alive:true},
				{name:"Player 5", score:0, alive:true},
				{name:"Player 6", score:0, alive:true},
				{name:"Player 7", score:0, alive:true},
				{name:"Player 8", score:0, alive:true}
			];
			}

			function resetGame()
			{
				x = canvas.width / 2;
				y = canvas.height - 10;
				dx = (canvas.width / 2) / 200;
				dy = -1 * ((canvas.height / 2) / 200);
				leftPaddle = (canvas.height - paddleHeight) / 2;
				rightPaddle = (canvas.height - paddleHeight) / 2;
				leftScore = 0;
				rightScore = 0;
				ballSpeed = canvas.width / 250;
				menuBool = true;
				aiDir = 0;
			}

			function cleanseTournamentArray()
			{
				winner = 0;
				tournamentWinner = 0;
				matchmakingIndex = 0;
				loopDirection = 0;
				for(let z = 0; z < 8; z++)
				{
					players[z].score = 0;
					players[z].alive = true;
				}
				_matches = [];
				postIndex = 0;
				totalPoints = 0;
				findNextMatch();
			}

			function drawMenu()
			{
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawStartSoloMenu();
				if (winner != 0)
					drawMenuScore();
				if (gameMode === 2 && tournamentWinner === 0)
					drawAnnouncementMenu();
			}

			function drawStartSoloMenu()
			{
				drawStartSoloMenuBox(boxHover);
				drawStartSoloMenuText(boxHover);
			}

			function drawStartSoloMenuBox(boxHover)
			{
				if (boxHover === false){
					ctx.fillStyle = "rgb(255 255 255 / 0%)";
					ctx.lineWidth = 3;
					ctx.strokeStyle = 'red';
					ctx.stroke();
				}
				else
					ctx.fillStyle = 'red';
				ctx.beginPath();
				ctx.roundRect((canvas.width / 3), (canvas.height / 3), (canvas.width / 3), (canvas.height / 3), 5);
				ctx.fill();
			}

			function drawStartSoloMenuText(boxHover)
			{
				ctx.font = canvas.height/8 + "px Audiowide";
				if (boxHover === false)
					ctx.fillStyle = 'red';
				else
					ctx.fillStyle = 'black';
				ctx.textAlign="center";
				ctx.textBaseline = "middle";
				ctx.fillText(`PLAY`, canvas.width / 2, (canvas.height / 2));
			}

			function drawMenuScore()
			{
				ctx.font = canvas.height/10 + "px Audiowide";
				ctx.fillStyle = 'red';
				ctx.textAlign="center";
				ctx.textBaseline = "middle";
				if (tournamentWinner === 0)
					ctx.fillText(`${winner} has won !`, canvas.width / 2, canvas.height / 6);
				else
				{
					ctx.font = canvas.height/15 + "px Audiowide";
					ctx.fillText(`${tournamentWinner} has won the tournament !`, canvas.width / 2, canvas.height / 6);
				}
			}

			function drawAnnouncementMenu() {
				ctx.font = canvas.height / 12 + "px Audiowide";
				ctx.fillStyle = 'red';
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText("Next match", canvas.width / 2, 4.5 * canvas.height / 6);
				ctx.fillText(`${player1} VS ${player2}`, canvas.width / 2, 5.5 * canvas.height / 6);
			}


			function findNextMatch()
			{
				foundPair = 0;
				while (totalPoints < playersCount - 1)
				{
					while (matchmakingIndex < playersCount - 1 && foundPair < 2 && loopDirection === 0)
					{
						if (matchmakingIndex === playersCount - 2)
							loopDirection = 1;
						if (players[matchmakingIndex].alive === true && foundPair === 0)
						{
							player1 = players[matchmakingIndex].name;
							foundPair++;
							matchmakingIndex++;
						}
						else if (players[matchmakingIndex].alive === true && foundPair === 1 && players[matchmakingIndex].name != player1)
						{
							player2 = players[matchmakingIndex].name;
							foundPair++;
							matchmakingIndex++;
						}
						else
							matchmakingIndex++;
					}
					while (matchmakingIndex >= 0 && foundPair < 2 && loopDirection === 1)
					{
						if (matchmakingIndex === 0)
							loopDirection = 0;
						if (players[matchmakingIndex].alive === true && foundPair === 0)
						{
							player1 = players[matchmakingIndex].name;
							foundPair++;
							if (matchmakingIndex != 0)
								matchmakingIndex--;
						}
						else if (players[matchmakingIndex].alive === true && foundPair === 1 && players[matchmakingIndex].name != player1)
						{
							player2 = players[matchmakingIndex].name;
							foundPair++;
							if (matchmakingIndex != 0)
								matchmakingIndex--;
						}
						else
						{
							if (matchmakingIndex != 0)
								matchmakingIndex--;
						}
					}
					if (foundPair === 2)
						break ;
				}
			}

			function drawBall()
			{
				ctx.beginPath();
				ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.closePath();
			}

			function predict()
			{
				let xPredict = x;
				let yPredict = y;
				let dxPredict = dx;
				let dyPredict = dy;
				if (Date.now() - oldTime.getTime() >= 1000)
				{
					oldTime = new Date();
					if (dx > 0)
					{
						//Predicts where the ball hits the left Y axis
						while (xPredict + dxPredict < canvas.width - ballRadius - (paddleWidth / 2))
						{
							xPredict += dxPredict;
							yPredict += dyPredict;
							if (yPredict + dyPredict > canvas.height - ballRadius || yPredict + dyPredict < ballRadius)
								dyPredict = -dyPredict;
						}
						//Randomize the hit according to difficulty coefficient
						yPredict = yPredict + ((Math.random() * (difficultyCoeff - (-difficultyCoeff)) + (-difficultyCoeff)) * (paddleHeight / 2));
						//Calculate how many key strokes are needed to get the paddle to the Y index
						if (yPredict > rightPaddle + (paddleHeight / 2))
						{
							while (yPredict > rightPaddle + (paddleHeight / 2))
							{
								yPredict -= 7;
								aiDir--;
							}
						}
						else if (yPredict < rightPaddle + (paddleHeight / 2))
						{
							while (yPredict < rightPaddle + (paddleHeight / 2))
							{
								yPredict += 7;
								aiDir++;
							}
						}

					}
				}
			}

			function draw()
			{
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawBall();
				drawLeftPaddle();
				drawRightPaddle();
				drawScore();
				x += dx;
				y += dy;
				if (gameMode === 0)
				{
					predict();
					if (aiDir < 0)
					{
						aiDir++;
						simulateKeyPress("ArrowDown");
					}
					else if (aiDir > 0)
					{
						aiDir--;
						simulateKeyPress("ArrowUp");
					}
				}
				if (x + dx - (paddleWidth / 2) < ballRadius)
				{
					if (y > leftPaddle && y < leftPaddle + paddleHeight)
					{
						relativeIntersectionY = (leftPaddle + (paddleHeight / 2)) - y;
						normalizedIntersectionY = (relativeIntersectionY / (paddleHeight / 2));
						bounceAngle = normalizedIntersectionY * (5*Math.PI/12);
						if (ballSpeed < canvas.width / 100)
							ballSpeed += 0.2;
						dx = ballSpeed*Math.cos(bounceAngle);
						dy = ballSpeed*-Math.sin(bounceAngle);
					}
					else
					{
						rightScore++;
						if (rightScore === 3)
						{
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							clearInterval(interval);
							winner = player2;
							displayCurrentMatchStats();
							if (gameMode != 2)
								backendPost("/post/match/", player1, player2, gameMode, winner, leftScore, rightScore, matchDebut, (Date.now() - matchDebut) / 1000);
							if (gameMode === 2)
							{
								tempMatchId++;
								totalPoints++;
								_matches[postIndex] = [player1, player2, gameMode, winner, leftScore, rightScore, matchDebut, ((Date.now() - matchDebut) / 1000)];
								postIndex++;
								if (totalPoints === playersCount - 1)
								{
									tournamentWinner = player2;
									backendPost("/post/tournament/", tournamentWinner, _matches);
									setBlock(_matches, tournamentWinner, postIndex);
									tournamentId++;
								}
								index = 0;
								while (index < playersCount - 1)
								{
									if (player1.localeCompare(players[index].name) === 0)
										players[index].alive = false;
									if (player2.localeCompare(players[index].name) === 0)
										players[index].score++;
									index++;
								}
								findNextMatch();
							}
							resetGame();
							interval = setInterval(drawMenu, 10);
						}
						else
						{
							clearInterval(interval);
							interval = null;
							x = canvas.width / 2;
							y = canvas.height - 10;
							dx = -1 * (canvas.width / 2) / 200;
							dy = -1 * (canvas.height / 2) / 200;
							leftPaddle = (canvas.height - paddleHeight) /2;
							rightPaddle = (canvas.height - paddleHeight) /2;
							ballSpeed = canvas.width / 250;
							interval = setInterval(draw, 8);
						}
					}
				}
				else if (x + dx > canvas.width - ballRadius - (paddleWidth / 2))
				{
					if (y > rightPaddle && y < rightPaddle + paddleHeight)
					{
						relativeIntersectionY = (rightPaddle + (paddleHeight / 2)) - y;
						normalizedIntersectionY = (relativeIntersectionY / (paddleHeight / 2));
						bounceAngle = normalizedIntersectionY * (5*Math.PI/12);
						if (ballSpeed < canvas.width / 100)
							ballSpeed += 0.2;
						dx = -ballSpeed*Math.cos(bounceAngle);
						dy = ballSpeed*-Math.sin(bounceAngle);
					}
					else
					{
						leftScore++;
						if (leftScore === 3)
						{
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							clearInterval(interval);
							winner = player1;
							displayCurrentMatchStats();
							if (gameMode != 2)
								backendPost("/post/match/", player1, player2, gameMode, winner, leftScore, rightScore, matchDebut, (Date.now() - matchDebut) / 1000);
							if (gameMode === 2)
							{
								tempMatchId++;
								totalPoints++;
								_matches[postIndex] = [player1, player2, gameMode, winner, leftScore, rightScore, matchDebut, ((Date.now() - matchDebut) / 1000)];
								postIndex++;
								if (totalPoints === playersCount - 1)
								{
									tournamentWinner = player1;
									backendPost("/post/tournament/", tournamentWinner, _matches);
									setBlock(_matches, tournamentWinner, postIndex);
									tournamentId++;
								}
								index = 0;
								while (index < playersCount - 1)
								{
									if (player1.localeCompare(players[index].name) === 0)
										players[index].score++;
									if (player2.localeCompare(players[index].name) === 0)
										players[index].alive = false;
									index++;
								}
								findNextMatch();
							}
							resetGame();
							interval = setInterval(drawMenu, 10);
						}
						else
						{
							clearInterval(interval);
							interval = null;
							x = canvas.width / 2;
							y = canvas.height - 10;
							dx = (canvas.width / 2) / 200;
							dy = -1 * ((canvas.height / 2) / 200);
							leftPaddle = (canvas.height - paddleHeight) / 2;
							rightPaddle = (canvas.height - paddleHeight) / 2;
							ballSpeed = canvas.width / 250;
							interval = setInterval(draw, 8);
						}
					}
				}
				if (y + dy > canvas.height - ballRadius || y + dy < ballRadius)
					dy = -dy;

				if (leftPaddleDownPressed)
				{
					leftPaddle = Math.min(leftPaddle + 7, canvas.height - paddleHeight);
				}
				else if (leftPaddleUpPressed)
				{
					leftPaddle = Math.max(leftPaddle - 7, 0);
				}

				if (rightPaddleDownPressed)
				{
					rightPaddle = Math.min(rightPaddle + 7, canvas.height - paddleHeight);
				}
				else if (rightPaddleUpPressed)
				{
					rightPaddle = Math.max(rightPaddle - 7, 0);
				}
			}

			function drawLeftPaddle()
			{
				ctx.beginPath();
				ctx.rect(0, leftPaddle, paddleWidth, paddleHeight);
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.closePath();
			}

			function drawRightPaddle()
			{
				ctx.beginPath();
				ctx.rect(canvas.width - paddleWidth, rightPaddle, paddleWidth, paddleHeight);
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.closePath();
			}

			function drawScore()
			{
				ctx.font = canvas.height/20 + "px Audiowide";
				ctx.fillStyle = 'white';
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillText(`${player1}: ${leftScore}`, canvas.width / 100, 5.5 * canvas.height / 80);
				ctx.fillText(`${player2}: ${rightScore}`, canvas.width / 100, 5.5 * canvas.height / 300);
			}

			function handleWindowSize(){

				navbarHeight = navbar.offsetHeight;
				if ((window.innerHeight - navbarHeight) * 3/2 <= window.innerWidth)
				{
					canvas.height = window.innerHeight - navbarHeight;
					canvas.width = canvas.height * 3/2;
				}
				else
				{
					canvas.height = (window.innerWidth + navbarHeight) * 2/3;
					canvas.width = window.innerWidth - navbarHeight; 
				}
				if (canvas.height > window.innerHeight - navbarHeight)
					canvas.height = window.innerHeight - navbarHeight;

				paddleHeight = canvas.height / 4.5;
				paddleWidth = canvas.width / 140;
			}

			//---------- EVENT LISTENERS -------------------------------------------------------------------

			document.addEventListener("keydown", keyDownHandler, false);
			document.addEventListener("keyup", keyUpHandler, false);
			document.addEventListener("mousemove", mouseMoveHandler, false);
			document.addEventListener("click", mouseClickHandler, false);
			document.addEventListener("mousemove", function(e) {
					const mousePos = getMousePos(canvas, e);
			});

			window.addEventListener( 'resize', onWindowResize, false );
			function onWindowResize() {

				handleWindowSize();
				resetGame();
			}

			function simulateKeyPress(key) {
				// Simulate keydown event
				const keydownEvent = new KeyboardEvent('keydown', { key: key, isTrusted: false });
				document.dispatchEvent(keydownEvent);
				// Simulate keyup event after a short delay (for continuous pressing, you can adjust or skip this)
				setTimeout(() => {
					const keyupEvent = new KeyboardEvent('keyup', { key: key, isTrusted: false });
					document.dispatchEvent(keyupEvent);
				}, 8); // Delay in milliseconds, you can adjust as needed
			}

			function getMousePos(canvas, evt) {
					// Get the bounding rectangle of the canvas
					const rect = canvas.getBoundingClientRect();
					// Calculate mouse position within the canvas, accounting for scroll offset
					const x = evt.clientX - rect.left;
					const y = evt.clientY - rect.top;
					return { x: x, y: y };
			}

			function mouseMoveHandler(e)
			{
				const mousePos = getMousePos(canvas, e);
				const relativeX = mousePos.x;
				const relativeY = mousePos.y;
				if (relativeX > canvas.width / 3 && relativeX < 2 * canvas.width / 3 && relativeY > canvas.height / 3 && relativeY < 2 * canvas.height / 3) {
						boxHover = true;
				}
				else
				{
					boxHover = false;
				}
			}

			function mouseClickHandler(e)
			{
				const mousePos = getMousePos(canvas, e);
				const relativeX = mousePos.x;
				const relativeY = mousePos.y;
				if (relativeX > canvas.width / 3 && relativeX < 2 * canvas.width / 3 && relativeY > canvas.height / 3 && relativeY < 2 * canvas.height / 3 && menuBool === true && document.getElementsByClassName('content-game')[0].style.display === "block") {
					menuBool = false;
					if (tournamentWinner != 0)
						cleanseTournamentArray();
					winner = 0;
					matchDebut = new Date();
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					clearInterval(interval);
					interval = setInterval(draw, 8);
				}
			}


			function keyDownHandler(e)
			{
				if (e.key === "Up" || e.key === "ArrowUp")
				{
					e.preventDefault();
					if (gameMode != 0)
						rightPaddleUpPressed = true;
					else if (!e.isTrusted)
						rightPaddleUpPressed = true;
				}
				else if (e.key === "a" || e.key === "A")
				{
					leftPaddleUpPressed = true;
				}
				else if (e.key === "z" || e.key === "Z")
				{
					leftPaddleDownPressed = true;
				}
				else if (e.key === "Down" || e.key === "ArrowDown")
				{
					e.preventDefault();
					if (gameMode != 0)
						rightPaddleDownPressed = true;
					else if (!e.isTrusted)
						rightPaddleDownPressed = true;
				}
			}

			function keyUpHandler(e)
			{
				if (e.key === "Up" || e.key === "ArrowUp")
				{
					if (gameMode != 0)
						rightPaddleUpPressed = false;
					else if (!e.isTrusted)
						rightPaddleUpPressed = false;
				}
				else if (e.key === "a" || e.key === "A")
				{
					leftPaddleUpPressed = false;
				}
				else if (e.key === "z" || e.key === "Z")
				{
					leftPaddleDownPressed = false;
				}
				else if (e.key === "Down" || e.key === "ArrowDown")
				{
					if (gameMode != 0)
						rightPaddleDownPressed = false;
					else if (!e.isTrusted)
						rightPaddleDownPressed = false;
				}
			}
			interval = setInterval(drawMenu, 10);

			//---------- onClick functions for game mode ---------------------------------------------------

			function onClickEasy()
			{
				clearInterval(interval);
				resetWholeGame();
				gameMode = 0;
				player1 = "Player 1";
				player2 = "Easy";
				difficultyCoeff = 0.3;
				interval = setInterval(drawMenu, 10);
			};

			function onClickMedium()
			{
				clearInterval(interval);
				resetWholeGame();
				gameMode = 0;
				player1 = "Player 1";
				player2 = "Medium";
				difficultyCoeff = 0.6;
				interval = setInterval(drawMenu, 10);
			};

			function onClickHard()
			{
				clearInterval(interval);
				resetWholeGame();
				gameMode = 0;
				player1 = "Player 1";
				player2 = "Hard";
				difficultyCoeff = 0.9;
				interval = setInterval(drawMenu, 10);
			};
			function onClickDuo()
			{
				clearInterval(interval);
				resetWholeGame();
				gameMode = 1;
				interval = setInterval(drawMenu, 10);
			};

			function onClickTournament()
			{
				clearInterval(interval);
				resetWholeGame();
				gameMode = 2;
				interval = setInterval(drawMenu, 10);
			};

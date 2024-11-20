window.addEventListener("load", async function() {

	await backendPost("/get/currentuser/");
	// Check the result and modify the button accordingly
	if (buffer.error === "User is not logged in") {
		document.getElementById("logInButton").innerHTML = `
			<a class="btn btn-outline-light" href="#login">Log in</a>
		`;
	}
	else if (buffer.error) {
		document.getElementById("logInButton").innerHTML = `
			<p class="text-right text-light">${buffer.error}</p>
		`;
	}
	else {
		await getAvatar();
		if (buffer.avatar_url){
			document.getElementById("logInButton").innerHTML = `
			<div class="dropdown">
			<a class="dropdown-toggle text-light" type="button" id="dropdownProfileButton" data-bs-toggle="dropdown" aria-expanded="false"><img class="rounded-circle" src="${buffer.avatar_url}" alt="profile" width="40rem" height="40rem" id="avatarProfile"></a>
			<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownProfileButton">
			<li><a class="dropdown-item" href="#profile" onclick="displayProfilePage()">Profile</a></li>
			<li><a class="btn btn-link dropdown-item" role="button" onclick="logOut()"><i class="bi bi-power" style="font-size: 1.5rem; color: red;"></i></a></li>
			</ul>
			</div>
			`;
			document.getElementById('avatar').src = buffer.avatar_url;
		}
		else if (buffer.error) {
			document.getElementById("logInButton").innerHTML = `
				<p class="text-right text-light">${buffer.error}</p>
			`;
		}
	}
	window.location.href="#home";
});

function displayNextMatch() {

	document.getElementById('informationOutput').innerText = `${player1} - ${player2}`;
}

async function displayLeaderboard() {

	await backendPost("/get/bestplayers/");
	if (buffer.error){
		document.getElementById('informationOutput').innerText = buffer.error;
		return;
	}
	const playersList = buffer.message
	if (playersList.length === 0){
		document.getElementById('informationOutput').innerText = "No players found";
	}
	else{
		document.getElementById('informationOutput').innerText = null;
	for (let i = 0; i < playersList.length && playersList; i++){
		if (i === 0)
			document.getElementById('informationOutput').innerText += `${i} - ${playersList[i].username} (${playersList[i].matches_won} ${playersList[i].matches_won < 2 ? "win" : "wins"})\n`;
		else
			document.getElementById('informationOutput').innerText += `${i} - ${playersList[i].username} (${playersList[i].matches_won} ${playersList[i].matches_won < 2 ? "win" : "wins"})\n`;
	}
	}
}

function displayCurrentMatchStats(){

	document.getElementById("matchStatsOutput").innerHTML = `
		<h3 class="text-light">Statistics of the match : ${player1} - ${player2}</h3>
		<p class="text-light">Points won by ${player1} : ${leftScore}</p>
		<p class="text-light">Points won by ${player2} : ${rightScore}</p>
		<p class="text-light">Points played : ${leftScore + rightScore}</p>
		<p class="text-light">Winner is : ${leftScore > rightScore ? player1 : player2}</p>
	`;
	document.getElementById("player1StatsOutput").innerHTML = `
		<h3 class="text-light">Statistics of ${player1}</h3>
		<p class="text-light">Points won : ${leftScore}</p>
		<p class="text-light">Points lost : ${rightScore}</p>
		<p class="text-light">Accuracy : ${Math.round(leftScore/(rightScore + leftScore)*100)}%</p>
	`;
	document.getElementById("player2StatsOutput").innerHTML = `
		<h3 class="text-light">Statistics of ${player2}</h3>
		<p class="text-light">Points won : ${rightScore}</p>
		<p class="text-light">Points lost : ${leftScore}</p>
		<p class="text-light">Accuracy : ${Math.round(rightScore/(rightScore + leftScore)*100)}%</p>
	`;
}

var currInputPlayer;
function searchAndDisplayPlayerStats(){

	currInputPlayer = document.getElementById('searchPlayerInput');
	displayGlobalStats();
}

async function displayGlobalStats() {

	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/globalstats/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Global statistics of ${currInputPlayer.value}</h3>
		<p class="text-light">Points won : ${buffer.message.pointsWon}</p>
		<p class="text-light">Points lost : ${buffer.message.pointsLost}</p>
		<p class="text-light">Points played : ${buffer.message.pointsPlayed}</p>
		<p class="text-light">Matches won : ${buffer.message.matchesWon}</p>
		<p class="text-light">Matches lost : ${buffer.message.matchesLost}</p>
		<p class="text-light">Matches played : ${buffer.message.matchesPlayed}</p>
	`;
	}
}

async function displaySoloStats(){

	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/solostats/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Solo statistics of ${currInputPlayer.value}</h3>
		<p class="text-light">Points won : ${buffer.message.pointsWon}</p>
		<p class="text-light">Points lost : ${buffer.message.pointsLost}</p>
		<p class="text-light">Points played : ${buffer.message.pointsPlayed}</p>
		<p class="text-light">Matches won : ${buffer.message.matchesWon}</p>
		<p class="text-light">Matches lost : ${buffer.message.matchesLost}</p>
		<p class="text-light">Matches played : ${buffer.message.matchesPlayed}</p>
	`;
	}
}

async function displayDuoStats(){

	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/duostats/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Duo statistics of ${currInputPlayer.value}</h3>
		<p class="text-light">Points won : ${buffer.message.pointsWon}</p>
		<p class="text-light">Points lost : ${buffer.message.pointsLost}</p>
		<p class="text-light">Points played : ${buffer.message.pointsPlayed}</p>
		<p class="text-light">Matches won : ${buffer.message.matchesWon}</p>
		<p class="text-light">Matches lost : ${buffer.message.matchesLost}</p>
		<p class="text-light">Matches played : ${buffer.message.matchesPlayed}</p>
	`;
	}
}

async function displayTournamentStats(){

	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/tournamentstats/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Tournament statistics of ${currInputPlayer.value}</h3>
		<p class="text-light">Points won : ${buffer.message.pointsWon}</p>
		<p class="text-light">Points lost : ${buffer.message.pointsLost}</p>
		<p class="text-light">Points played : ${buffer.message.pointsPlayed}</p>
		<p class="text-light">Matches won : ${buffer.message.matchesWon}</p>
		<p class="text-light">Matches lost : ${buffer.message.matchesLost}</p>
		<p class="text-light">Matches played : ${buffer.message.matchesPlayed}</p>
		<p class="text-light">Tournament won : ${buffer.message.tournamentsWon}</p>
		<p class="text-light">Tournament lost : ${buffer.message.tournamentsLost}</p>
		<p class="text-light">Tournament played : ${buffer.message.tournamentsPlayed}</p>
	`;
	}
}

async function displayVictoriesAndDefeatsGraph(){

	// Create a PieChart and Legend instance to display a graph and its legend
	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/victories/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
		return;
	}
	const victories = buffer.message.matchesWon;
	await backendPost("/get/defeats/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`
		return;
	}
	const defeats = buffer.message.matchesLost;

	if (victories === 0 && defeats === 0){
		document.getElementById("playerStatsOutput").innerHTML = `
			<h3 class="text-light">Graphic statistics of ${currInputPlayer.value} : Number of victories and defeats</h3>
			<p class="text-light">No matches found</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Graphic statistics of ${currInputPlayer.value} : Number of victories and defeats</h3>
		<div class="row d-flex align-item-center">
			<canvas id="myPlayerChart"></canvas>
		</div>
		<div class="row d-flex align-item-center">
			<div class="text-light" for="myPlayerChartLegend"></div>
		</div>
	`;

	const canvas = document.getElementById('myPlayerChart');
	const parentWidth = canvas.parentElement.clientWidth;

	canvas.width = parentWidth;
	canvas.height = parentWidth;

	const chartOptions = {
		canvas: canvas,
		seriesName: "Number of match victories and defeats",
		padding: 20,
		data: {
			"Victories": victories,
			"Defeats": defeats
		},
		colors: ["#80DEEA", "#FFE082"]
	};

	var myPiechart = new PieChart(chartOptions);
	myPiechart.draw();

	const legendOptions = {
		canvas: canvas,
		div: "myPlayerChartLegend",
		data: {
			"Victories": victories,
			"Defeats": defeats
		},
		colors: ["#80DEEA", "#FFE082"]
	};
	var myPieChartLegend = new Legend(legendOptions);
	myPieChartLegend.drawLegend();
	}
}

async function displayVictoriesByModeGraph(){

	// Create a BarChart and Legend instance to display a graph and its legend
	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/victoriesbymode/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
		return;
	}
	const soloWins = buffer.message.SoloMatchesWins;
	const duoWins = buffer.message.DuoMatchesWins;
	const tournamentWins = buffer.message.TournamentMatchesWins;
	if (soloWins === 0 && duoWins === 0 && tournamentWins === 0){
		document.getElementById("playerStatsOutput").innerHTML = `
			<h3 class="text-light">Graphic statistics of ${currInputPlayer.value} : Number of victories by game mode</h3>
			<p class="text-light">No matches or no wins found</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Graphic statistics of ${currInputPlayer.value} :  Number of victories by game mode</h3>
		<div class="row d-flex align-item-center">
			<canvas id="myPlayerChart"></canvas>
		</div>
		<div class="row d-flex align-item-center">
			<div class="text-light" for="myPlayerChartLegend"></div>
		</div>
	`;

	const canvas = document.getElementById('myPlayerChart');
	const parentWidth = canvas.parentElement.clientWidth;

	canvas.width = parentWidth;
	canvas.height = parentWidth;

	const barChartOptions = {
		canvas: canvas,
		seriesName:" Number of victories by game mode",
		padding: 20,
		data: {
			"Solo": soloWins,
			"Duo": duoWins,
			"Tournament": tournamentWins,
		},
		colors: ["#80DEEA", "#FFE082", "#FFAB91"]
	};

	var myBarChart = new BarChart(barChartOptions);
	myBarChart.draw();

	const legendOptions = {
		canvas: canvas,
		div: "myPlayerChartLegend",
		data: {
			"Solo": soloWins,
			"Duo": duoWins,
			"Tournament": tournamentWins,
		},
		colors: ["#80DEEA", "#FFE082", "#FFAB91"]
	};
	var myBarChartLegend = new Legend(legendOptions);
	myBarChartLegend.drawLegend();
	}
}

async function displayPointsByMatchGraph(){

	// Create a PlotChart and Legend instance to display a graph and its legend
	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}
	await backendPost("/get/pointsbymatch/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
		return;
	}
	const pointsOverTime = buffer.message.matches;
	if (pointsOverTime.length === 0){
		document.getElementById("playerStatsOutput").innerHTML = `
			<h3 class="text-light">Graphic statistics of ${currInputPlayer.value} : Number of points</h3>
			<p class="text-light">No matches found</p>
		`;
		return;
	}
	for (let i = 0; i < pointsOverTime.length; i++){
		if (pointsOverTime[i] > 0)
			break;
		else if (i === pointsOverTime.length - 1){
			document.getElementById("playerStatsOutput").innerHTML = `
				<h3 class="text-light">Graphic statistics of ${currInputPlayer.value} : Number of points</h3>
				<p class="text-light">No points won</p>
			`;
			return;
		}
	}
	document.getElementById("playerStatsOutput").innerHTML = `
		<h3 class="text-light">Graphic stats of ${currInputPlayer.value} : Number of points</h3>
		<div class="row d-flex align-item-center">
			<canvas id="myPlayerChart"></canvas>
		</div>
		<div class="row d-flex align-item-center">
			<div class="text-light" for="myPlayerChartLegend"></div>
		</div>
	`;

	const canvas = document.getElementById('myPlayerChart');
	const parentWidth = canvas.parentElement.clientWidth;

	canvas.width = parentWidth;
	canvas.height = parentWidth;

	var mapping = {};
	for (let i = 0; i < pointsOverTime.length; i++) {
		mapping["Match " + i] = pointsOverTime[i];
	}

	const plotChartOptions = {
		canvas: canvas,
			seriesName:"Number of points per match",
			padding:20,
			linePlotWidth:2,
			data: mapping,
			colors: ["#80DEEA", "#FFE082", "#FFAB91", "#CE93D8"]
	};

	var myPlotChart = new PlotChart(plotChartOptions);
	myPlotChart.draw();

	const legendOptions = {
		canvas: canvas,
		div: "myPlayerChartLegend",
		data: mapping,
		colors: ["#80DEEA", "#FFE082", "#FFAB91", "#CE93D8"]
	};

	var myPlotChartLegend = new Legend(legendOptions);
	myPlotChartLegend.drawLegend();
}

async function displayMatchStats(){

	if (!currInputPlayer){
		document.getElementById("playerStatsOutput").innerHTML = `
			<p class="text-light">No players selected</p>
		`;
		return;
	}

	await backendPost("/get/matchstats/", currInputPlayer.value);
	if (buffer.error){
		document.getElementById("playerStatsOutput").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
		return;
	}
	const matches = JSON.parse(buffer.message);
	if (matches.length === 0){
		document.getElementById("playerStatsOutput").innerHTML = `
			<h3 class="text-light">Match history of ${currInputPlayer.value}</h3>
			<p class="text-light">No matches found</p>
		`;
	}
	else{
	document.getElementById("playerStatsOutput").innerHTML = `
			<h3 class="text-light">Match history of ${currInputPlayer.value}</h3>
		`;
	for (let i = 0; i < matches.length; i++){
		let date = new Date(matches[i].fields.date);
		document.getElementById("playerStatsOutput").innerHTML += `
			<h5 class="text-light">Match ${i}</h5>
			<p class="text-light">${matches[i].fields.player1} (${matches[i].fields.player1_points}) - ${matches[i].fields.player2} (${matches[i].fields.player2_points})</p>
			<p class="text-light">Mode : ${matches[i].fields.mode == 0 ? 'Solo' : matches[i].fields.mode == 1 ? 'Duo' : 'Tournament'}</p>
			<p class="text-light">Date : ${date.toLocaleString()}</p>
			<p class="text-light">Match time :  ${Math.ceil(matches[i].fields.match_time)} seconds</p>
		`;
	}
	}
}

async function displayProfilePage(){

	await backendPost("/get/currentuser/");
	if (buffer.message){
		const currentUser = buffer.message;
		displayUsername(currentUser);
		await getAvatar();
		if (buffer.avatar_url){
			document.getElementById('avatar').src = buffer.avatar_url;
			document.getElementById('avatarProfile').src = buffer.avatar_url;
		}
		else if (buffer.error) {
			document.getElementById("logInButton").innerHTML = `
				<p class="text-right text-light">${buffer.error}</p>
			`;
		}
		displayFriendsList();
	}
}

document.getElementById("avatarForm").addEventListener('submit', async function(){

	await getAvatar();
	if (buffer.avatar_url){
		document.getElementById('avatar').src = buffer.avatar_url;
		document.getElementById('avatarProfile').src = buffer.avatar_url;
	}
	else if (buffer.error) {
		document.getElementById("logInButton").innerHTML = `
			<p class="text-right text-light">${buffer.error}</p>
		`;
	}
});

async function displayUsername(currentUser){

	document.getElementById("usernameProfileOutput").innerText = currentUser;
	await backendPost("/get/victories/", currentUser);
	if (buffer.error)
		document.getElementById("victoriesProfileOutput").innerText = buffer.error;
	else
		document.getElementById("victoriesProfileOutput").innerText = `${buffer.message.matchesWon} ${buffer.message.matchesWon < 2 ? " win" : " wins"}`;
	await backendPost("/get/defeats/", currentUser);
	if (buffer.error)
		document.getElementById("defeatsProfileOutput").innerText = buffer.error;
	else
		document.getElementById("defeatsProfileOutput").innerText = `${buffer.message.matchesLost} ${buffer.message.matchesLost < 2 ? " loss" : " losses"}`;
}

async function uploadAvatar(){

	const fileInput = document.getElementById("avatar_img");

	if (fileInput.files.length === 0) {
		document.getElementById("avatarOutput").innerText = "Please select a file";
		return;
	}
	await postAvatar(fileInput);
	if (buffer.error)
		document.getElementById("avatarOutput").innerText = buffer.error;
	else{
		await getAvatar();
		if (buffer.avatar_url){
			document.getElementById('avatar').src = buffer.avatar_url;
			document.getElementById('avatarProfile').src = buffer.avatar_url;
		}
		else if (buffer.error) {
			document.getElementById("logInButton").innerHTML = `
				<p class="text-right text-light">${buffer.error}</p>
			`;
		}
	}
}

async function searchAndAddFriend(){

	var input = document.getElementById('searchProfileInput');
	await backendPost("/post/addfriend/", input.value);
	if (buffer.error){
		document.getElementById("addFriendOutput").innerText = buffer.error;
	}
	else{
		document.getElementById("addFriendOutput").innerText = buffer.message;
		displayFriendsList();
	}
}

async function displayFriendsList() {

	// Loop here to display friend requests
	await backendPost("/get/friendrequests/");
	if (buffer.error){
		document.getElementById("requestsList").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
	}
	else{
		const requestsList = buffer.message.requests;
		document.getElementById("requestsList").innerHTML = null;
	for (let i = 0; i < requestsList.length; i++){
		document.getElementById("requestsList").innerHTML += `
			<li class="d-flex inline align-items-center mt-2">
				<h5>${requestsList[i]}</h5>
				<button type="button" class="btn btn-outline-light ms-2" onclick="acceptFriendRequest('${requestsList[i]}')"><i class="bi bi-check-circle" style="font-size: 1.5rem"></i></button>
				<button type="button" class="btn btn-outline-light ms-3" onclick="declineFriendRequest('${requestsList[i]}')"><i class="bi bi-slash-circle" style="font-size: 1.5rem"></i></button>
			</li>
		`
	}
	}
	// Loop here to display friends list
	await backendPost("/get/friendslist/")
	if (buffer.error){
		document.getElementById("friendsList").innerHTML = `
		<p class="text-light">${buffer.error}</p>
		`;
	}
	else{
		const friendsList = buffer.message.friends;
		document.getElementById("friendsList").innerHTML = null;
	for (let i = 0; i < friendsList.length; i++){
		await backendPost("/get/isuserconnected/", friendsList[i]);
		if (buffer.error){
			document.getElementById("friendsList").innerHTML += `
				<p class="text-light">${buffer.error}</p>
			`;
		}
		else{
			if (buffer.message === "True"){
				// If friend is online display a 'green circle'
				document.getElementById("friendsList").innerHTML += `
					<li class="d-flex inline align-items-center mt-2">
						<h5>${friendsList[i]}</h5>
						<img class="ms-2" src="static/img/icons8-online-24.png" alt="online" width="24" height="24">
						<button type="button" class="btn btn-outline-light ms-3" onclick="removeFriend('${friendsList[i]}')"><i class="bi bi-trash" style="font-size: 1.5rem"></i></button>
					</li>
				`;
			}
			else{
				// Else display a 'red circle'
				document.getElementById("friendsList").innerHTML += `
					<li class="d-flex inline align-items-center mt-2">
						<h5>${friendsList[i]}</h5>
						<img class="ms-2" src="static/img/icons8-offline-24.png" alt="offline" width="24" height="24">
						<button type="button" class="btn btn-outline-light ms-3" onclick="removeFriend('${friendsList[i]}')"><i class="bi bi-trash" style="font-size: 1.5rem"></i></button>
					</li>
				`;
			}
		}
	}
	}
}

async function acceptFriendRequest(requestor){

	await backendPost("/post/addfriend/", requestor);
	if (buffer.error)
		document.getElementById("friendsListOutput").innerText = buffer.error;
	else
		displayFriendsList();
}

async function declineFriendRequest(requestor){

	await backendPost("/post/declinefriendrequest/", requestor);
	if (buffer.error)
		document.getElementById("friendsListOutput").innerText = buffer.error;
	else
		displayFriendsList();
}

async function removeFriend(friend){

	await backendPost("/post/removefriend/", friend);
	if (buffer.error)
		document.getElementById("friendsListOutput").innerText = buffer.error;
	else
		displayFriendsList();
}

async function updateLogInButton(){

	await backendPost("/get/currentuser/");

	// Check the result and modify the button accordingly
	if (buffer.error === "User is not logged in") {
		document.getElementById("logInButton").innerHTML = `
			<a class="btn btn-outline-light" href="#login">Log in</a>
		`;
	} else if (buffer.error) {
		document.getElementById("logInButton").innerHTML = `
			<p class="text-right text-light">${buffer.error}</p>
		`;
	} else {
		await getAvatar();
		if (buffer.avatar_url){
			document.getElementById("logInButton").innerHTML = `
			<div class="dropdown">
			<a class="dropdown-toggle text-light" type="button" id="dropdownProfileButton" data-bs-toggle="dropdown" aria-expanded="false"><img class="rounded-circle" src="${buffer.avatar_url}" alt="profile" width="40rem" height="40rem" id="avatarProfile"></a>
			<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownProfileButton">
			<li><a class="dropdown-item" href="#profile" onclick="displayProfilePage()">Profile</a></li>
			<li><a class="btn btn-link dropdown-item" role="button" onclick="logOut()"><i class="bi bi-power" style="font-size: 1.5rem; color: red;"></i></a></li>
			</ul>
			</div>
			`;
		document.getElementById('avatar').src = buffer.avatar_url;
		}
		else if (buffer.error) {
			document.getElementById("logInButton").innerHTML = `
				<p class="text-right text-light">${buffer.error}</p>
			`;
		}
	}
	document.getElementById("logInButton").removeAttribute("style");
}

async function logIn(){

	var frm = document.querySelector('#logInForm');
	var username = frm.querySelector('input[type=text]');
	var password = frm.querySelector('input[type=password]');

	await backendPost("/login/", username.value, password.value);
	if (buffer.error){
		document.getElementById("logInOutput").innerText = buffer.error;
	}
	else{
		window.location.href = "#home";
		frm.reset();
	}
}

async function logOut(){

	await backendPost("/logout/");
	if (buffer.error){
		document.getElementById("logInButton").innerHTML = `
			<p class="text-right text-light">${buffer.error}</p>
		`;
	}
	else{
		window.location.href = "#home";
		updateLogInButton();
	}
}

async function signUp(){

	var frm = document.querySelector('#signUpForm');
	var username = frm.querySelector('input[type=text]');
	var password = frm.querySelector('input[type=password]');

	await backendPost("/register/", username.value, password.value);
	if (buffer.error){
		document.getElementById("signUpOutput").innerText = buffer.error;
	}
	else{
		window.location.href = "#home";
		frm.reset();
	}
}

async function updateUsername(){

	var frm = document.querySelector('#updateUsernameForm');
	var input = frm.querySelector('input[type=text]');

	await backendPost("/post/username/", input.value);
	if (buffer.error){
		document.getElementById("updateUsernameOutput").innerText = buffer.error;
	}
	else{
		document.getElementById("updateUsernameOutput").innerText = buffer.message;
		displayUsername(document.getElementById("newUsernameInput").value);
		frm.reset();
	}
}

async function updatePassword(){

	var frm = document.querySelector('#updatePasswordForm');
	var input = frm.querySelector('input[type=password]');

	await backendPost("/post/password/", input.value);
	if (buffer.error){
		document.getElementById("updatePasswordOutput").innerText = buffer.error;
	}
	else{
		document.getElementById("updatePasswordOutput").innerText = buffer.message;
		frm.reset();
	}
}

function addPlayerToForm(){

	// Count the current number of input fields
	const playersNumber = document.querySelectorAll('#tournamentInputs #playerInputs .col-12').length;

	if (playersNumber == 8)
		return;
	// Create a new div element for the input field
	const newInputDiv = document.createElement('div');
	newInputDiv.classList.add('col-12');
	newInputDiv.classList.add('mt-2');

	const newLabel = document.createElement('label');
	newLabel.setAttribute('for', 'player' + (playersNumber + 1) + 'Tournament');
	newLabel.classList.add('form-label');
	newLabel.textContent = 'Alias *';

	// Create new input
	const newInput = document.createElement('input');
	newInput.type = 'text';
	newInput.classList.add('form-control');
	newInput.name = 'player' + (playersNumber + 1);
	newInput.id = 'player' + (playersNumber + 1) + 'Tournament';
	newInput.placeholder = 'Alias';
	newInput.maxLength = '15';
	newInput.required = ' ';

	// Add the label and input to the div
	newInputDiv.appendChild(newLabel);
	newInputDiv.appendChild(newInput);

	// Add the new div to the field container
	document.querySelector('#tournamentInputs #playerInputs').appendChild(newInputDiv);
}

function removePlayerFromForm(){

	const playersNumber = document.querySelectorAll('#tournamentInputs #playerInputs .col-12').length;
	const divInputs = document.querySelectorAll('#tournamentInputs #playerInputs .col-12');

	if (playersNumber <= 3)
		return;

	divInputs[divInputs.length - 1].remove();
}

async function checkInputsAndPlayTournament(){

	var frm = document.querySelector('#tournamentForm');
	var inputs = frm.querySelectorAll('input[type=text]');

	var classArr = [];
	for(var i = 0; i < inputs.length; i++){
		const value = inputs[i].value;
		if (value.includes(" ")){
			document.getElementById('tournamentOutputText').innerText = 'Wrong entry: "' + value + '" contains spaces';
			return false;
		}
		else if (classArr.includes(value)){
			document.getElementById('tournamentOutputText').innerText = 'Wrong entry: "' + value + '" is duplicated';
			return false;
		}
		if (value === ''){
			document.getElementById('tournamentOutputText').innerText = 'Please fill in all the fields';
			return false;
		}
		classArr.push(value);
	}
	onClickTournament();
	for (var i = 0; i < inputs.length; i++)
		players[i].name = inputs[i].value;
	playersCount = inputs.length;
	findNextMatch();
	hideAllContentDivs();
	document.getElementsByClassName('content-game')[0].style.display='block';
	window.location.href = "#game";
}

async function checkInputAndPlay(){

	var frm = document.querySelector('#duoForm');
	var inputs = frm.querySelectorAll('input[type=text]');

	var classArr = [];
	for(var i = 0; i < inputs.length; i++){
		const value = inputs[i].value;
		if (value.includes(" ")){
			document.getElementById('duoOutputText').innerText = 'Wrong entry: "' + value + '" contains spaces';
			return false;
		}
		else if (classArr.includes(value)){
			document.getElementById('duoOutputText').innerText = 'Wrong entry: "' + value + '" is duplicated';
			return false;
		}
		if (value === ''){
			document.getElementById('duoOutputText').innerText = 'Please fill in all the fields';
			return false;
		}
		classArr.push(value);
	}
	onClickDuo();
	player1 = inputs[0].value;
	player2 = inputs[1].value;
	hideAllContentDivs();
	document.getElementsByClassName('content-game')[0].style.display='block';
	window.location.href = "#game";
}

window.addEventListener('hashchange', async function (e) {

	var currentFragment = window.location.hash.substring(1);
	var fragmentsArray = ["home", "game", "duo", "tournament", "stats", "profile", "blockchain", "login", "signup"];

	for (let fragment of fragmentsArray){
		if (currentFragment === fragment){
			if (currentFragment !== "login" && currentFragment !== "signup")
				await updateLogInButton();
			cleanPage(currentFragment);
			hideAllContentDivs();
			page = 'content-' + currentFragment;
			document.getElementsByClassName(page)[0].style.display='block';
			if (currentFragment === "game")
				window.location.href = "#game";
			else
				scroll();
			break;
		}
	}
});

function scroll() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

function cleanPage(currentFragment){

	if (currentFragment === "login"){
		document.getElementById("logInForm").reset();
		document.getElementById("logInOutput").innerText = null;
		document.getElementById("logInButton").style.display='none';
	}
	if (currentFragment === "signup"){
		document.getElementById("signUpForm").reset();
		document.getElementById("signUpOutput").innerText = null;
		document.getElementById("logInButton").style.display='none';
	}
	if (currentFragment === "home"){
		document.getElementById("modeButtonOutputText").innerText = null;
		document.getElementById("duoButtonOutputText").innerText = null;
		document.getElementById("tournamentButtonOutputText").innerText = null;
	}
	if (currentFragment === "game"){
		document.getElementById("informationOutput").innerText = null;
		document.getElementById("player1StatsOutput").innerHTML = null;
		document.getElementById("matchStatsOutput").innerHTML = null;
		document.getElementById("player2StatsOutput").innerHTML = null;
	}
	if (currentFragment === "stats"){
		document.getElementById("playerStatsOutput").innerHTML = null;
		document.getElementById("searchPlayerInput").value = '';
		currInputPlayer = '';
	}
	if (currentFragment === "profile"){
		document.getElementById("avatarForm").reset();
		document.getElementById("fileName").innerText = "No File chosen";
		document.getElementById("avatarOutput").innerText = null;
		document.getElementById("searchProfileInput").value = '';
		document.getElementById("updateUsernameForm").reset();
		document.getElementById("updatePasswordForm").reset();
		document.getElementById("addFriendOutput").innerText = null;
		document.getElementById("friendsListOutput").innerText = null;
		document.getElementById("updateUsernameOutput").innerText = null;
		document.getElementById("updatePasswordOutput").innerText = null;
	}
	if (currentFragment === "blockchain"){
		document.getElementById("tournamentIdInput").value = '';
		document.getElementById("blockchainOutput").innerHTML = null;
	}
	if (currentFragment === "duo"){
		var frm = document.getElementById("duoForm");
		frm.reset();
		document.getElementById("duoOutputText").innerText = null;
	}
	if (currentFragment === "tournament"){
		var frm = document.getElementById("tournamentForm");
		frm.reset();
		document.getElementById("tournamentOutputText").innerText = null;
	}
}
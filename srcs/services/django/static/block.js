function setBlock(tournamentMatches, tournamentWinner, matchesNumber){

	let data = [];

	nodeUrl = "http://ganache:7545";
	for (let match of tournamentMatches){
		let data_info = [];
		data_info.push(match[0]); //player1
		data_info.push(match[1]); //player2
		data_info.push(match[3]); //winner
		data_info.push(match[4]); //player1_points
		data_info.push(match[5]); //player2_points
		data.push(data_info);
	}
	backendPost("/get/setblock/", nodeUrl, tournamentWinner, matchesNumber, data);
}

async function getBlock(){

	const tournamentId = document.getElementById("tournamentIdInput").value;
	if (tournamentId < 0 || tournamentId.length === 0){
		document.getElementById('blockchainOutput').innerHTML = `
			<p>Negative or NaN value not allowed</p>
		`;
		return;
	}
	nodeUrl = "http://ganache:7545";
	await backendPost("/get/getblock/", nodeUrl, tournamentId);
	if (buffer.error){
		let startIndex = buffer.error.search("message");
		if (startIndex !== -1){
			let valueStartIndex = buffer.error.indexOf("'", startIndex + 8);
			let valueEndIndex = buffer.error.indexOf("'", valueStartIndex + 1);
			if (valueStartIndex !== -1 && valueEndIndex !== -1) {
				const message = buffer.error.substring(valueStartIndex + 1, valueEndIndex);
				document.getElementById('blockchainOutput').innerHTML = `
					<p>${message}</p>
				`;
			}
			else {
				document.getElementById('blockchainOutput').innerHTML = `
					<p>The value of the message could not be extracted</p>
				`;
			}
		}
		else {
			document.getElementById('blockchainOutput').innerHTML = `
				<p>${buffer.error}</p>
			`;
		}
	}
	else{
		generateCubeHTML();
	}
}

function generateCubeHTML(){

	document.getElementById('blockchainOutput').innerHTML = `
		<div class="container">
	`;
	for (let i = 0; i < buffer.scores.length; i++){
		document.getElementById('blockchainOutput').innerHTML += `
			<h3 class="text-white text-center">Match ${i}</h3>
			<p class="text-white text-center">${buffer.scores[i][0]} (${buffer.scores[i][3]}) - ${buffer.scores[i][1]} (${buffer.scores[i][4]})</p>
		`;
	}
	document.getElementById('blockchainOutput').innerHTML += `
			<h3 class="text-white text-center">Tournament Winner : ${buffer.winner}</h3>
		</div>
	`;
}

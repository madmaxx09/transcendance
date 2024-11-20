// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
contract TournamentScores{

	uint mapSize;
	mapping(uint256 => Match[]) public tournamentMatches;
	mapping(uint256 => string) public tournamentWinners;

	struct Match {
		string	player1;
		string	player2;
		string	winner;
		uint256	pointsPlayer1;
		uint256	pointPlayer2;
	}

	constructor(){
		mapSize = 0;
	}

	function setTournamentMatches(uint256 _tournamentId, string[] memory _players1, string[]  memory _players2, string[]  memory _matchesWinners,
		uint256[] memory _pointsPlayers1, uint256[] memory _pointsPlayers2, string memory _tournamentWinner, uint256 _matchesNumber) public {
		for (uint256 i = 0; i < _matchesNumber; i++)
			tournamentMatches[_tournamentId].push(Match(_players1[i], _players2[i], _matchesWinners[i], _pointsPlayers1[i], _pointsPlayers2[i]));
		mapSize++;
		tournamentWinners[_tournamentId] = _tournamentWinner;
	}

	function getTournamentMatches(uint256 _tournamentId) public view returns (Match[] memory) {

		require(tournamentMatches[_tournamentId].length > 0, "Tournament matches not found for this ID");
		return (tournamentMatches[_tournamentId]);
	}

	function getTournamentWinner(uint256 _tournamentId) public view returns (string memory) {

		require(bytes(tournamentWinners[_tournamentId]).length > 0, "Tournament winner not found for this ID");
		return (tournamentWinners[_tournamentId]);
	}

	function getTournamentId() public view returns (uint){

		return (mapSize);
	}
}

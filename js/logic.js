$(document).ready(function() {
	var gameTable = $(".game-table").find("tbody"), previousGamesTable = $(".previous-games"),
	p1, turn, score = { x: 0, o: 0 }, returnToGameBtn = $(".return-to-game"),
	player = $(".player"), turnField = $(".turn"), scoreField = $(".score"), data, game = 1,
	gameField = $(".game");
	scoreField.html(score.x + " / " + score.o);
	buildTable();
	buildPreviousGamesTable();

	$(".clear-history").on("click", function(e) {
		e.preventDefault();

		if(confirm("Are you sure?")) {
			localStorage.clear();
			previousGamesTable.find("tbody").html("");
		}
	})

	function buildPreviousGamesTable() {
		var k = 2, tbody = previousGamesTable.find("tbody");
		tbody.html("");
		delete localStorage.currentGame;
		for (var i in localStorage) {
			if (i.indexOf("game") > -1) {
				if (k < 2) { 
					k++;
				} else {
					tbody.append("<tr>");
					k = 0;
				}
				tbody.find("tr:last")
				.append("<td id='" + i + "'>" + i + "</td>");
			}

		}
		tbody.on("click", "td", reviewGame);
	}

	function reviewGame(e) {
		e.preventDefault();

		var id = $(this).attr("id");
		if (!localStorage.hasOwnProperty("currentGame")) localStorage.setItem("currentGame", gameTable.html());
		gameTable.html(localStorage.getItem(id));
		gameField.html(id);

		returnToGameBtn.removeClass("hidden").off("click").on("click", function(e) {
			e.preventDefault();

			returnToGameBtn.addClass("hidden");
			gameField.html(game);
			gameTable.html(localStorage.getItem("currentGame"));
			delete localStorage.currentGame;
		});
	}

	function buildTable() {
		turn = 0;
		p1 = false;
		data = [ [0, 0, 0],
		[0, 0, 0],
		[0, 0, 0] ];
		gameTable.html("");
		gameField.html(game);
		player.html("X");
		turnField.html(turn + 1);
		for (var i = 0; i < 9; i++) {
			if (i % 3 === 0) gameTable.append("<tr>");
			gameTable.find("tr:last").append("<td id='" + i + "'></td>");
		}

		gameTable.off("click").on("click", "td", makeMove);
	}

	function makeMove(e) {
		e.preventDefault();
		var $this = $(this), index = $this.attr("id"), sign;

		$this.on("click", function (e) { e.stopPropagation(); });
		data[Math.floor(index / 3)][index % 3] = p1 ? 1 : -1;	 	
		p1 ? (p1 = false, sign = "<span class='red'>X</span>") : (p1 = true, sign = "<span class='blue'>O");
		turnField.html(++turn);
		$this.add(player).html(sign);	 	

		if (turn > 4) {
			var winner = isWin(data), endGame = turn === 9;
			if (winner || endGame) {
				winner === "X" ? score.x++ : score.o++;
				scoreField.html(score.x + " / " + score.o);
				if (winner) alert(winner + " player wins!");
				if (!winner && endGame) alert("Draw");
				localStorage.setItem("game#" + Math.floor(Math.random() * (1 + 10000)) , gameTable.html());
				game++;
				buildTable();
				buildPreviousGamesTable();
			}
		}
	}

	function isWin(arr) {
		var horizontLine, verticalLine, diagonalLine = { a: 0, b: 0 };
		for (var i = 0; i < arr.length; i++) {
			horizontLine = 0; 
			verticalLine = 0;
			for (var k = 0; k < arr[i].length; k++) {
				horizontLine += arr[i][k];
				verticalLine += arr[k][i]; 	
				if (k === i) {
					if (i === 1) diagonalLine.b += arr[i][k];
					diagonalLine.a += arr[i][k];
				} else {
					if (k !== 1 && i !== 1) diagonalLine.b += arr[i][k]
				}

			if (horizontLine === 3 || verticalLine === 3 || diagonalLine.a === 3 || diagonalLine.b === 3) {
				return "X";
			} else if (horizontLine === -3 || verticalLine === -3 || diagonalLine.a === -3 || diagonalLine.b === -3) {
				return "O";
			}

		}

	}
}
});
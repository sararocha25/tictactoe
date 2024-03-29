var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

var myMove = false;

var score1 = 0;

var score2 = 0;

if (myMove) {
    makeMove();
}

function restartGame() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    myMove = false;
    $('div').removeClass('notEmpty');
    updateMove();
}

$(document).ready(function() {
    $(".square").click(function() {

        if($(this).hasClass('notEmpty')) {
            console.log('notEmpty');
        } else {
            var cell = $(this).attr("id")
            var row = parseInt(cell[1])
            var col = parseInt(cell[2])
            $(this).addClass('notEmpty');
            if (!myMove) {
                board[row][col] = false;
                myMove = true;
                updateMove();
                makeMove();
            }
        }
    });
    $("#restart").click(restartGame);
});

function updateMove() {
    updateButtons();
    
    var winner = getWinner(board);
    
    $("#winner").text(winner == 1 ? "Computer Won!" : winner == 0 ? "You Won!" : winner == -1 ? "Tie!" : "");
    
    
    if(winner == 1) {
        score2++;
        $('#score2').html(score2);
    } else if (winner == 0) {
        score1++;
        $('#score1').html(score1);
    }

    $(".turn").html(myMove ? 'O' : 'X');
}

function getWinner(board) {
   
    // Check if someone won
    vals = [true, false];
    var allNotNull = true;
    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];
        
        // Check rows, columns, and diagonals
        var diagonalComplete1 = true;
        var diagonalComplete2 = true;
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagonalComplete1 = false;
            }
            if (board[2 - i][i] != value) {
                diagonalComplete2 = false;
            }
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] == null) {
                    allNotNull = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagonalComplete1 || diagonalComplete2) {
            return value ? 1 : 0;
            myMove = false;
        }
    }
    if (allNotNull) {
        return -1;
    }
    return null;
}
    
function updateButtons() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $("#c" + i + "" + j).text(board[i][j] == false ? "x" : board[i][j] == true ? "o" : "");
            if (board[i][j] == true) {
              $("#c" + i + "" + j).addClass('notEmpty');
            }
        }
    }
}

function makeMove() {
    setTimeout(function() {
        board = minimaxMove(board);
        console.log(numNodes);
        console.log('selected');
        console.log(board);
        myMove = false;
        updateMove();
    }, 600);
}

function minimaxMove(board) {
    numNodes = 0;
    return recurseMinimax(board, true)[1];
}

var numNodes = 0;

function recurseMinimax(board, player) {
    numNodes++;
    var winner = getWinner(board);
    if (winner != null) {
        switch(winner) {
            case 1:
                // AI wins
                return [1, board]
            case 0:
                // opponent wins
                return [-1, board]
            case -1:
                // Tie
                return [0, board];
        }
    } else {
        // Next states
        var nextVal = null;
        var nextBoard = null;
        
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    board[i][j] = player;
                    var value = recurseMinimax(board, !player)[0];
                    if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                        nextBoard = board.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}

updateMove();
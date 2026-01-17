
const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

export const checkWinner = (squares) => {
    for (let i = 0; i < WIN_COMBOS.length; i++) {
        const [a, b, c] = WIN_COMBOS[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: WIN_COMBOS[i] };
        }
    }
    return null;
};

export const isDraw = (squares) => {
    return squares.every((square) => square !== null) && !checkWinner(squares);
};

export const getBestMove = (squares, aiPlayer) => {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';

    // Clone to avoid mutation
    const board = [...squares];

    // Minimax Algorithm
    const minimax = (currentBoard, depth, isMaximizing) => {
        let result = checkWinner(currentBoard);
        if (result) {
            return result.winner === aiPlayer ? 10 - depth : depth - 10;
        }
        if (currentBoard.every(square => square !== null)) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!currentBoard[i]) {
                    currentBoard[i] = aiPlayer;
                    let score = minimax(currentBoard, depth + 1, false);
                    currentBoard[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!currentBoard[i]) {
                    currentBoard[i] = opponent;
                    let score = minimax(currentBoard, depth + 1, true);
                    currentBoard[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
};

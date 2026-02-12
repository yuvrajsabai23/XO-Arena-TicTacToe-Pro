// AI Difficulty levels for XO Arena
// Grandmaster is free, others are premium

export const DIFFICULTY = {
  ROOKIE: 'rookie',
  PRO: 'pro',
  GRANDMASTER: 'grandmaster',
  CHAOS: 'chaos'
};

export const difficultyConfig = {
  rookie: {
    id: 'rookie',
    name: 'Rookie',
    description: 'Easy AI - Makes random moves',
    free: false,
    storeId: 'difficulty_pack',
    price: 4.99
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Medium AI - Plays well but makes mistakes',
    free: false,
    storeId: 'difficulty_pack',
    price: 4.99
  },
  grandmaster: {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Unbeatable AI - Perfect strategy',
    free: true
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    description: 'Unpredictable AI - Random genius or blunder',
    free: false,
    storeId: 'difficulty_pack',
    price: 4.99
  }
};

export const difficultyPack = {
  id: 'difficulty_pack',
  name: 'AI Difficulty Pack',
  description: 'Unlock Rookie, Pro, and Chaos AI modes',
  storeId: 'difficulty_pack',
  price: 4.99,
  includes: ['rookie', 'pro', 'chaos']
};

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

// Get available moves
const getAvailableMoves = (squares) => {
    return squares.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
};

// Random move for Rookie difficulty
const getRandomMove = (squares) => {
    const available = getAvailableMoves(squares);
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
};

// Worst move for Chaos mode (opposite of best)
const getWorstMove = (squares, aiPlayer) => {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';
    const board = [...squares];

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

    let worstMove = -1;
    let worstScore = Infinity;

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score < worstScore) {
                worstScore = score;
                worstMove = i;
            }
        }
    }

    return worstMove;
};

export const getBestMove = (squares, aiPlayer, difficulty = DIFFICULTY.GRANDMASTER) => {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';
    const board = [...squares];

    // Rookie: Always random
    if (difficulty === DIFFICULTY.ROOKIE) {
        return getRandomMove(squares);
    }

    // Chaos: 50% best move, 50% worst move
    if (difficulty === DIFFICULTY.CHAOS) {
        if (Math.random() < 0.5) {
            return getWorstMove(squares, aiPlayer);
        }
        // Fall through to optimal move
    }

    // Minimax Algorithm for optimal play
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
    let moves = [];

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = null;
            moves.push({ index: i, score });
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    // Pro: 70% optimal, 30% suboptimal (but not worst)
    if (difficulty === DIFFICULTY.PRO && Math.random() < 0.3) {
        // Sort moves by score and pick a suboptimal one
        moves.sort((a, b) => b.score - a.score);
        if (moves.length > 1) {
            // Pick second or third best move
            const suboptimalIndex = Math.min(1 + Math.floor(Math.random() * 2), moves.length - 1);
            return moves[suboptimalIndex].index;
        }
    }

    return bestMove;
};

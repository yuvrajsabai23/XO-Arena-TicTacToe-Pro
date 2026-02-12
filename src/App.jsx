import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnitX from './components/UnitX';
import CoreO from './components/CoreO';
import Arbiter from './components/Arbiter';
import StartScreen from './components/StartScreen';
import HowToPlay from './components/HowToPlay';
import GameOverlay from './components/GameOverlay';
import StoreScreen from './components/StoreScreen';
import DifficultySelector from './components/DifficultySelector';
import CoinDisplay, { GameConsumables } from './components/CoinDisplay';
import { checkWinner, isDraw, getBestMove, DIFFICULTY } from './logic/minimax';
import { audio } from './logic/audio';
import { applyTheme } from './themes/themes';
import { getSelectedItems, setSelectedItem } from './store/purchases';
import { syncPurchases } from './store/msStore';
import {
  getHints, getUndos, getShields, getWinStreak,
  useHint, useUndo, incrementWinStreak, resetWinStreak
} from './store/coinManager';

// App States
const APP_STATE = {
  HOME: 'HOME',
  MODE_SELECT: 'MODE_SELECT',
  DIFFICULTY_SELECT: 'DIFFICULTY_SELECT',
  GAME: 'GAME',
  STORE: 'STORE',
};

import ModeSelection from './components/ModeSelection';

const App = () => {
  // App State
  const [appState, setAppState] = useState(APP_STATE.HOME);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Game Config
  const [gameMode, setGameMode] = useState('PvAI'); // 'PvAI' or 'PvP'

  // Customization State
  const [currentTheme, setCurrentTheme] = useState('default');
  const [currentSkin, setCurrentSkin] = useState('default');
  const [currentDifficulty, setCurrentDifficulty] = useState(DIFFICULTY.GRANDMASTER);

  // Game State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [shakeIndex, setShakeIndex] = useState(null);

  // Consumables State
  const [hints, setHints] = useState(0);
  const [undos, setUndos] = useState(0);
  const [shields, setShields] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [hintSquare, setHintSquare] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [bonusCoinsEarned, setBonusCoinsEarned] = useState(0);

  // Logic Lock
  const isProcessing = React.useRef(false);

  // Initialize on mount
  useEffect(() => {
    audio.init();
    window.audio = audio; // Expose for debugging/testing

    // Load saved preferences
    const saved = getSelectedItems();
    setCurrentTheme(saved.theme || 'default');
    setCurrentSkin(saved.skin || 'default');
    setCurrentDifficulty(saved.difficulty || DIFFICULTY.GRANDMASTER);

    // Apply saved theme
    applyTheme(saved.theme || 'default');

    // Sync purchases from Microsoft Store
    syncPurchases();

    // Load consumables
    updateConsumables();
  }, []);

  // Update consumables from storage
  const updateConsumables = () => {
    setHints(getHints());
    setUndos(getUndos());
    setShields(getShields());
    setWinStreak(getWinStreak());
  };

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(currentTheme);
    setSelectedItem('theme', currentTheme);
  }, [currentTheme]);

  // Save skin preference
  useEffect(() => {
    setSelectedItem('skin', currentSkin);
  }, [currentSkin]);

  // Save difficulty preference
  useEffect(() => {
    setSelectedItem('difficulty', currentDifficulty);
  }, [currentDifficulty]);

  const handleStart = () => {
    setAppState(APP_STATE.MODE_SELECT);
    // CRITICAL FIX: Resume context on user gesture to allow BGM
    if (audio.audioCtx && audio.audioCtx.state === 'suspended') {
      audio.audioCtx.resume();
    }
    audio.speak("Welcome to X O Arena. Select your protocol.");
  };

  const handleStore = () => {
    setAppState(APP_STATE.STORE);
  };

  const selectMode = (mode) => {
    setGameMode(mode);
    if (mode === 'PvAI') {
      setAppState(APP_STATE.DIFFICULTY_SELECT);
    } else {
      setAppState(APP_STATE.GAME);
      resetGame();
      audio.startBGM();
      audio.speak("Multiplayer Engaged.");
    }
  };

  const selectDifficulty = (difficulty) => {
    setCurrentDifficulty(difficulty);
    setAppState(APP_STATE.GAME);
    resetGame();
    audio.startBGM();

    const diffNames = {
      rookie: 'Rookie',
      pro: 'Pro',
      grandmaster: 'Grandmaster',
      chaos: 'Chaos'
    };
    audio.speak(`Initiating ${diffNames[difficulty]} Protocol.`);
  };

  const handleHome = () => {
    audio.stopBGM(); // Stop music when leaving game
    setAppState(APP_STATE.HOME);
    setWinner(null);
  };

  const toggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handlePurchaseComplete = () => {
    // Reload preferences after purchase
    const saved = getSelectedItems();
    setCurrentTheme(saved.theme || 'default');
    setCurrentSkin(saved.skin || 'default');
    setCurrentDifficulty(saved.difficulty || DIFFICULTY.GRANDMASTER);
    applyTheme(saved.theme || 'default');
    // Update consumables
    updateConsumables();
  };

  // AI Turn Logic
  useEffect(() => {
    if (gameMode === 'PvAI' && !isXNext && !winner && !isDraw(squares) && appState === APP_STATE.GAME) {
      setIsAiThinking(true);
      isProcessing.current = true; // Lock for AI

      const timeout = setTimeout(() => {
        const bestMove = getBestMove(squares, 'O', currentDifficulty);
        if (bestMove !== -1) {
          handleMove(bestMove, true); // Verified move from AI
        }
        setIsAiThinking(false);
        isProcessing.current = false; // Unlock after AI
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [isXNext, winner, squares, gameMode, appState, currentDifficulty]);

  const handleMove = (index, isAiParams = false) => {
    // Logic Gate:
    // 1. If square is taken
    // 2. If game is over
    // 3. If logic is locked (processing) AND it's not the AI call itself
    if (squares[index] || winner || (isProcessing.current && !isAiParams)) {
      if (squares[index] && !isProcessing.current) {
        triggerShake(index);
        audio.playSFX('error');
      }
      return;
    }

    // Strict Turn Check for PvAI: If it's AI turn (O) and this call is NOT from AI, block it.
    if (gameMode === 'PvAI' && !isXNext && !isAiParams) {
      return;
    }

    // Lock immediate re-entries (Double-click protection)
    if (!isAiParams) {
      isProcessing.current = true;
      // Unlock shortly after state update propagates, or keep locked if passing to AI
      if (gameMode === 'PvP') {
        setTimeout(() => { isProcessing.current = false; }, 300);
      }
      // If PvAI, the useEffect will pick up the turn change and keep it locked.
    }

    // Save move history for undo (before making the move)
    setMoveHistory(prev => [...prev, { squares: [...squares], isXNext }]);

    const newSquares = [...squares];
    const player = isXNext ? 'X' : 'O';
    newSquares[index] = player;
    setSquares(newSquares);

    // Clear hint when move is made
    setHintSquare(null);

    audio.playSFX('move'); // Play Move Sound

    const result = checkWinner(newSquares);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      audio.playSFX('win'); // Play Win Sound

      // Handle win streak (only for player X wins in PvAI)
      if (gameMode === 'PvAI' && result.winner === 'X') {
        const streakResult = incrementWinStreak();
        setWinStreak(streakResult.winStreak);
        if (streakResult.bonusCoins > 0) {
          setBonusCoinsEarned(streakResult.bonusCoins);
        }
        audio.speak("Victory.");
      } else if (gameMode === 'PvAI' && result.winner === 'O') {
        // Player lost - reset win streak (shield may protect)
        const streakResult = resetWinStreak();
        setWinStreak(streakResult.winStreak);
        setShields(getShields());
        audio.speak(streakResult.shieldUsed ? "Shield activated. Streak protected." : "Defeated.");
      } else {
        audio.speak(result.winner === 'X' ? "Player X wins." : "Player O wins.");
      }

      isProcessing.current = false; // Release lock on end game
    } else if (isDraw(newSquares)) {
      setWinner('draw');
      audio.speak("Stalemate.");
      isProcessing.current = false; // Release lock on end game
    } else {
      setIsXNext(!isXNext);
      // Logic handled by useEffect
    }
  };

  const triggerShake = (index) => {
    setShakeIndex(index);
    setTimeout(() => setShakeIndex(null), 500);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
    setHintSquare(null);
    setMoveHistory([]);
    setBonusCoinsEarned(0);
    isProcessing.current = false; // Ensure unlocked
  };

  // Handle hint usage
  const handleHint = () => {
    if (winner || isAiThinking) return;
    if (hints <= 0) {
      audio.playSFX('error');
      return;
    }

    // Use a hint
    const result = useHint();
    if (result.success) {
      setHints(result.remaining);

      // Get the best move for current player
      const currentPlayer = isXNext ? 'X' : 'O';
      const bestMove = getBestMove(squares, currentPlayer, DIFFICULTY.GRANDMASTER);

      if (bestMove !== -1) {
        setHintSquare(bestMove);
        audio.speak("Hint revealed.");

        // Clear hint after 3 seconds
        setTimeout(() => setHintSquare(null), 3000);
      }
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (winner || isAiThinking || moveHistory.length === 0) return;
    if (undos <= 0) {
      audio.playSFX('error');
      return;
    }

    const result = useUndo();
    if (result.success) {
      setUndos(result.remaining);

      // In PvAI, undo both player and AI moves
      if (gameMode === 'PvAI' && moveHistory.length >= 2) {
        // Restore to state before last two moves
        const prevState = moveHistory[moveHistory.length - 2];
        setSquares(prevState.squares);
        setIsXNext(prevState.isXNext);
        setMoveHistory(moveHistory.slice(0, -2));
      } else if (gameMode === 'PvP' && moveHistory.length >= 1) {
        // Restore to state before last move
        const prevState = moveHistory[moveHistory.length - 1];
        setSquares(prevState.squares);
        setIsXNext(prevState.isXNext);
        setMoveHistory(moveHistory.slice(0, -1));
      }

      setHintSquare(null);
      audio.speak("Move undone.");
    }
  };

  // --- RENDER HELPERS ---

  if (appState === APP_STATE.HOME) {
    return (
      <>
        <StartScreen
          onStart={handleStart}
          onHowToPlay={() => setShowHowToPlay(true)}
          onStore={handleStore}
        />
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
      </>
    );
  }

  if (appState === APP_STATE.MODE_SELECT) {
    return <ModeSelection onSelect={selectMode} onBack={handleHome} />;
  }

  if (appState === APP_STATE.DIFFICULTY_SELECT) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <DifficultySelector
          selectedDifficulty={currentDifficulty}
          onSelect={selectDifficulty}
          onBack={() => setAppState(APP_STATE.MODE_SELECT)}
        />
      </div>
    );
  }

  if (appState === APP_STATE.STORE) {
    return (
      <StoreScreen
        onBack={handleHome}
        onPurchaseComplete={handlePurchaseComplete}
      />
    );
  }

  // GAME VIEW
  const difficultyLabel = {
    rookie: 'Rookie',
    pro: 'Pro',
    grandmaster: 'Grandmaster',
    chaos: 'Chaos'
  };

  const status = winner
    ? (winner === 'draw' ? "Stalemate" : `${winner === 'X' ? 'Unit X' : 'Core O'} Wins`)
    : (gameMode === 'PvAI' && !isXNext
        ? `${difficultyLabel[currentDifficulty]} Thinking...`
        : (isXNext ? "Player X Turn" : "Player O Turn"));

  return (
    <div className="flex-center" style={{ flexDirection: 'column', height: '100vh', gap: '1.5rem', padding: '10px' }}>

      {/* Top Bar */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        right: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50
      }}>
        {/* Coin Display */}
        <CoinDisplay compact onCoinClick={handleStore} />

        {/* Audio Toggle */}
        <button
          onClick={toggleMute}
          style={{ padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Header */}
      <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem', marginTop: '50px' }}>
        <div style={{ width: '50px', height: '50px' }}>
          <Arbiter />
        </div>
        <h1 style={{ fontSize: '1rem', letterSpacing: '2px', opacity: 0.7, margin: 0 }}>XO ARENA</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {gameMode === 'PvAI' && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
              {difficultyLabel[currentDifficulty]} Mode
            </span>
          )}
          {winStreak > 0 && (
            <span style={{
              fontSize: '0.7rem',
              color: '#ff4500',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              🔥 {winStreak} Streak
            </span>
          )}
        </div>
      </div>

      {/* Board */}
      <div
        className="glass-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '20px',
          borderRadius: '24px',
          width: 'min(90vw, 400px)',
          aspectRatio: '1/1',
          background: 'rgba(30, 41, 59, 0.5)'
        }}
      >
        {squares.map((square, i) => (
          <div
            key={i}
            onClick={() => handleMove(i)}
            className={`flex-center ${shakeIndex === i ? 'shake' : ''}`}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid var(--color-cyan)',
              borderRadius: '12px',
              cursor: (!square && !winner && (!isAiThinking || gameMode === 'PvP')) ? 'pointer' : 'default',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          >
            <AnimatePresence>
              {square === 'X' && <div style={{ padding: '15%' }}><UnitX skin={currentSkin} /></div>}
              {square === 'O' && <div style={{ padding: '15%' }}><CoreO skin={currentSkin} /></div>}
            </AnimatePresence>

            {winningLine?.includes(i) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: square === 'X' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                  boxShadow: square === 'X' ? '0 0 20px var(--color-cyan)' : '0 0 20px var(--color-violet)'
                }}
              />
            )}

            {/* Hint Highlight */}
            {hintSquare === i && !square && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ fontSize: '24px' }}
                >
                  💡
                </motion.span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Game Consumables (Hint/Undo) */}
      {!winner && gameMode === 'PvAI' && (
        <GameConsumables
          hints={hints}
          undos={undos}
          shields={shields}
          winStreak={winStreak}
          onHintClick={handleHint}
          onUndoClick={handleUndo}
        />
      )}

      {/* Status & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          {status}
        </div>

        {/* IN-GAME CONTROLS (Only visible if no winner yet, to avoid clutter with overlay) */}
        {!winner && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={resetGame}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}
            >
              RESTART
            </button>
            <button
              onClick={handleHome}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}
            >
              HOME
            </button>
          </div>
        )}
      </div>

      {/* Winner Overlay */}
      {winner && (
        <GameOverlay
          winner={winner}
          onRestart={resetGame}
          onHome={handleHome}
        />
      )}
    </div>
  );
};

export default App;

import { useState } from 'react';
import Board from './Board';
import { GameBoard, currentPlayer, INITIAL_BOARD_STATE } from '../models/GameBoard';
import { Position } from '../types';
import { Player } from '../models/Players';

const Game = () => {
    const [game, setGame] = useState(new GameBoard(INITIAL_BOARD_STATE, currentPlayer.WHITE));
    const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
    const [highlightedCopies, setHighlightedCopies] = useState<Position[]>([]);
    const [highlightedJumps, setHighlightedJumps] = useState<Position[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const [currentTurn, setCurrentTurn] = useState<currentPlayer>(currentPlayer.WHITE);
    const [whitePlayer, setWhitePlayer] = useState<Player>();
    const [blackPlayer, setBlackPlayer] = useState<Player>();

    const setPiecesForPossibleMoves = (possibleCopies: Position[], possibleJumps: Position[]) => {
        setHighlightedCopies(possibleCopies);
        setHighlightedJumps(possibleJumps);
    };

    const resetBoardHighlights = () => {
        setHighlightedCopies([]);
        setHighlightedJumps([]);
    };

    const handleSquareClick = (clickedPosition: Position) => {
        if (!selectedPiece) {
            handleNoSelectedPiece(clickedPosition);
        } else {
            handleAlreadySelectedPiece(clickedPosition);
        }
    };

    const handleNoSelectedPiece = (clickedPosition: Position) => {
        if (game.isPositionOwnedByCurrentPlayer(clickedPosition)) {
            selectAndHighlightPiece(clickedPosition);
        } else {
            console.error("The clicked piece doesn't belong to the current player.");
            setFeedback("It's not your turn.");
        }
    };

    const selectAndHighlightPiece = (position: Position) => {
        setSelectedPiece(position);
        console.log('Selected piece: ', position);

        const possibleMoves = game.getPossibleMoves(position);
        console.log('Possible moves: ', possibleMoves);

        setPiecesForPossibleMoves(possibleMoves.copies, possibleMoves.jumps);
    };

    const handleAlreadySelectedPiece = (clickedPosition: Position) => {
        if (isSamePosition(clickedPosition, selectedPiece)) {
            deselectPiece();
        } else {
            attemptMoveTo(clickedPosition);
        }
    };

    const isSamePosition = (pos1: Position, pos2: Position | null) => {
        if (!pos2) return false;
        return pos1.row === pos2.row && pos1.col === pos2.col;
    };

    const deselectPiece = () => {
        setSelectedPiece(null);
        resetBoardHighlights();
    };
    const switchTurn = () => {
        setCurrentTurn(prevTurn =>
            prevTurn === currentPlayer.WHITE ? currentPlayer.BLACK : currentPlayer.WHITE
        );
    };

    const attemptMoveTo = (destination: Position) => {
        if (!selectedPiece) return; // This should never happen.
        const moveSuccessful = game.makeMove(selectedPiece, destination);

        if (moveSuccessful) {
            console.log(game.getScores());
            deselectPiece();
            setFeedback('');
            switchTurn();
        } else {
            console.error('Invalid destination.');
            setFeedback("Can't move there.");
        }
    };

    return (
        <div className="flex flex-col items-center text-white">
            <div>
                <div
                    className={`transform p-1 text-white transition-transform ${
                        currentTurn === currentPlayer.WHITE ? 'scale-105' : 'scale-95'
                    }`}
                >
                    It's {currentTurn === currentPlayer.WHITE ? 'White' : 'Black'}'s turn.
                </div>
            </div>

            <Board
                board={game.board}
                selectedPiece={selectedPiece}
                highlightedCopies={highlightedCopies}
                highlightedJumps={highlightedJumps}
                handleSquareClick={handleSquareClick}
            />

            <div className="feedback-label">{feedback}</div>
        </div>
    );
};

export default Game;

import { useCallback, useEffect, useState } from 'react';
import Board from './Board';
import { GameBoard, PlayerColor, INITIAL_BOARD_STATE } from '../models/GameBoard';
import { Position, PlayerType } from '../types';
import { createPlayer, Player } from '../models/Players';

interface GameProps {
    whitePlayerType: PlayerType;
    blackPlayerType: PlayerType;
}

const Game = ({ whitePlayerType, blackPlayerType }: GameProps) => {
    const [whitePlayer] = useState(() => createPlayer(whitePlayerType, PlayerColor.WHITE));
    const [blackPlayer] = useState(() => createPlayer(blackPlayerType, PlayerColor.BLACK));
    const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);
    const [game] = useState(new GameBoard(INITIAL_BOARD_STATE, PlayerColor.WHITE));
    const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
    const [highlightedCopies, setHighlightedCopies] = useState<Position[]>([]);
    const [highlightedJumps, setHighlightedJumps] = useState<Position[]>([]);
    const [feedback, setFeedback] = useState<string>('');

    const setPiecesForPossibleMoves = (possibleCopies: Position[], possibleJumps: Position[]) => {
        setHighlightedCopies(possibleCopies);
        setHighlightedJumps(possibleJumps);
    };

    const resetBoardHighlights = () => {
        setHighlightedCopies([]);
        setHighlightedJumps([]);
    };

    const handleSquareClick = async (clickedPosition: Position) => {
        if (currentPlayer.getPlayerType() === 'human') {
            try {
                const movePositions = await currentPlayer.makeMove(game, clickedPosition);
                switch (movePositions.length) {
                    case 0:
                        deselectPiece();
                        break;
                    case 1:
                        selectAndHighlightPiece(movePositions[0]);
                        break;
                    case 2:
                        attemptMoveTo(movePositions[0], movePositions[1]);
                        break;
                }
            } catch (error: any) {
                console.error(error.message);
                setFeedback(error.message);
            }
        }
    };

    const selectAndHighlightPiece = (position: Position) => {
        setSelectedPiece(position);

        const possibleMoves = game.getPossibleMoves(position);

        setPiecesForPossibleMoves(possibleMoves.copies, possibleMoves.jumps);
    };

    const changePlayerTurn = useCallback(() => {
        game.switchTurn();
        setCurrentPlayer(prevPlayer => (prevPlayer === whitePlayer ? blackPlayer : whitePlayer));
    }, [whitePlayer, blackPlayer, game]);

    const deselectPiece = useCallback(() => {
        setSelectedPiece(null);
        resetBoardHighlights();
    }, []);

    const attemptMoveTo = useCallback(
        (start: Position, destination: Position) => {
            const moveSuccessful = game.makeMove(start, destination);

            if (moveSuccessful) {
                // console.log(game.getScores());
                deselectPiece();
                setFeedback('');
                changePlayerTurn();
            } else {
                // console.error('Invalid destination.');
                setFeedback("Can't move there.");
            }
        },
        [game, deselectPiece, changePlayerTurn]
    );
    useEffect(() => {
        const makeAgentMove = async () => {
            if (currentPlayer.getPlayerType() !== 'human') {
                try {
                    const movePositions = await currentPlayer.makeMove(game);
                    if (movePositions && movePositions.length === 2) {
                        attemptMoveTo(movePositions[0], movePositions[1]);
                    }
                } catch (error: any) {
                    console.error(error.message);
                    setFeedback(error.message);
                }
            }
        };
        makeAgentMove();
    }, [currentPlayer, attemptMoveTo, game]);

    return (
        <div className="inline-flex flex-col items-center space-y-2 text-white">
            <div className="flex h-16 w-full flex-row rounded bg-black/80">
                <div className="flex-grow px-4 py-1 text-lg font-semibold text-white ">
                    <div className="">Turn : {currentPlayer.color.toUpperCase()}</div>

                    <div className="">Score : {game.getScores()[currentPlayer.color]}</div>
                </div>
                <button
                    className="m-2 w-24 rounded bg-sky-500 text-black"
                    onClick={changePlayerTurn}
                >
                    Pass
                </button>
            </div>
            <div className="flex rounded bg-black/60 p-1">
                <Board
                    board={game.board}
                    selectedPiece={selectedPiece}
                    highlightedCopies={highlightedCopies}
                    highlightedJumps={highlightedJumps}
                    handleSquareClick={handleSquareClick}
                />
            </div>
            <div className="h-20 min-w-full max-w-xs rounded bg-black/80 p-1">
                <div className="p-2 font-bold">{feedback}</div>
            </div>
        </div>
    );
};

export default Game;

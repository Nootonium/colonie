import { useState } from 'react';
import Cell from './Cell';
import { GameBoard, currentPlayer, INITIAL_BOARD_STATE } from '../models/GameBoard';

const Board = () => {
    const [game, setGame] = useState(new GameBoard(INITIAL_BOARD_STATE, currentPlayer.WHITE));
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isPieceSelected, setIsPieceSelected] = useState(false);

    const handleSquareClick = (rowIndex, colIndex) => {
        // Check if the move is valid according to game rules
        // Update the board state
        // Switch the current turn (toggle between 'white' and 'black')
    };
    // i need to elevate the state of the board to the game component then pass the representation of the board to the board component
    return (
        <div className="flex justify-center p-1">
            <div className="grid grid-cols-7 gap-1">
                {game.board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            value={cell}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Board;

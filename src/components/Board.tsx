import Cell from './Cell';
import { CellValue, Position } from '../types';

interface BoardProps {
    board: CellValue[][];
    handleSquareClick: (position: Position) => void;
    selectedPiece: Position | null;
    highlightedCopies: Position[];
    highlightedJumps: Position[];
}

const Board = ({
    board,
    selectedPiece,
    highlightedCopies,
    highlightedJumps,
    handleSquareClick,
}: BoardProps) => {
    return (
        <div className="flex justify-center ">
            <div className="grid grid-cols-7 gap-1">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const pos = { row: rowIndex, col: colIndex };
                        const isSelected =
                            pos.row === selectedPiece?.row && pos.col === selectedPiece?.col;
                        const isCopyHighlighted = highlightedCopies.some(
                            hPos => hPos.row === pos.row && hPos.col === pos.col
                        );
                        const isJumpHighlighted = highlightedJumps.some(
                            hPos => hPos.row === pos.row && hPos.col === pos.col
                        );

                        let cellValue = cell;
                        if (isSelected) cellValue = 'blue';
                        if (isCopyHighlighted) cellValue = 'red';
                        if (isJumpHighlighted) cellValue = 'green';

                        return (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                value={cellValue}
                                onClick={() => handleSquareClick({ row: rowIndex, col: colIndex })}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Board;

import { Position } from '../types';

enum PlayerColor {
    WHITE = 'white',
    BLACK = 'black',
}

enum MoveType {
    COPY,
    JUMP,
    INVALID,
}

type BoardState = (PlayerColor | null)[][];

const INITIAL_BOARD_STATE: BoardState = Array(7)
    .fill(null)
    .map((_, rowIndex) => {
        return Array(7)
            .fill(null)
            .map((_, colIndex) => {
                if (rowIndex === 0 && colIndex === 3) return PlayerColor.BLACK;
                if (rowIndex === 6 && colIndex === 3) return PlayerColor.WHITE;
                return null;
            });
    });

class GameBoard {
    board: BoardState;
    currentTurn: PlayerColor;

    constructor(newBoard: BoardState, currentTurn: PlayerColor) {
        this.board = newBoard;
        this.currentTurn = currentTurn;
    }

    isMoveValid(start: Position, target: Position): MoveType {
        const rowDiff = Math.abs(target.row - start.row);
        const colDiff = Math.abs(target.col - start.col);

        if (this.board[start.row][start.col] !== this.currentTurn) return MoveType.INVALID;

        if (this.board[target.row][target.col] !== null) return MoveType.INVALID;

        if (rowDiff <= 1 && colDiff <= 1) return MoveType.COPY;

        if ((rowDiff === 2 && colDiff <= 2) || (colDiff === 2 && rowDiff <= 2))
            return MoveType.JUMP;

        return MoveType.INVALID;
    }

    getAdjacentPieces(position: Position): Position[] {
        const { row, col } = position;
        const directions = [-1, 0, 1];
        const adjacentPositions: Position[] = [];

        for (const dRow of directions) {
            for (const dCol of directions) {
                if (dRow !== 0 || dCol !== 0) {
                    adjacentPositions.push({ row: row + dRow, col: col + dCol });
                }
            }
        }

        return adjacentPositions.filter(
            pos =>
                pos.row >= 0 &&
                pos.row < this.board.length &&
                pos.col >= 0 &&
                pos.col < this.board[0].length
        );
    }

    makeMove(start: Position, target: Position): boolean {
        const moveType = this.isMoveValid(start, target);

        if (moveType === MoveType.INVALID) {
            console.error('Invalid move!');
            return false;
        }

        this.board[target.row][target.col] = this.currentTurn;

        if (moveType === MoveType.JUMP) {
            this.board[start.row][start.col] = null;
        }

        this.convertOpponentPieces(target);

        return true;
    }

    convertOpponentPieces(position: Position): void {
        const adjacentPieces = this.getAdjacentPieces(position);
        const opponent = this.currentTurn === 'white' ? 'black' : 'white';

        for (const cell of adjacentPieces) {
            if (this.board[cell.row][cell.col] === opponent) {
                this.board[cell.row][cell.col] = this.currentTurn;
            }
        }
    }

    switchTurn(): void {
        if (this.currentTurn === PlayerColor.WHITE) {
            this.currentTurn = PlayerColor.BLACK;
        } else {
            this.currentTurn = PlayerColor.WHITE;
        }
    }

    isGameComplete(): boolean {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    getScores(): { white: number; black: number } {
        let whiteScore = 0;
        let blackScore = 0;

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 'white') {
                    whiteScore++;
                } else if (this.board[i][j] === 'black') {
                    blackScore++;
                }
            }
        }

        return {
            white: whiteScore,
            black: blackScore,
        };
    }

    getWinner() {
        const { white, black } = this.getScores();
        if (white === 0) {
            return 'black';
        } else if (black === 0) {
            return 'white';
        }

        if (white > black) {
            return 'white';
        } else if (white < black) {
            return 'black';
        } else {
            return 'draw';
        }
    }

    isPositionOwnedByCurrentPlayer(position: Position): boolean {
        return this.board[position.row][position.col] === this.currentTurn;
    }

    getCopyPositions(position: Position): Position[] {
        const adjacent = this.getAdjacentPieces(position);

        return adjacent.filter(pos => this.board[pos.row][pos.col] === null);
    }
    getJumpPositions(position: Position): Position[] {
        const { row, col } = position;
        const possibleJumps: Position[] = [
            { row: row - 2, col: col },
            { row: row + 2, col: col },
            { row: row, col: col - 2 },
            { row: row, col: col + 2 },

            { row: row - 2, col: col - 2 },
            { row: row - 2, col: col + 2 },
            { row: row + 2, col: col - 2 },
            { row: row + 2, col: col + 2 },

            { row: row - 1, col: col - 2 },
            { row: row - 1, col: col + 2 },
            { row: row + 1, col: col - 2 },
            { row: row + 1, col: col + 2 },

            { row: row - 2, col: col - 1 },
            { row: row - 2, col: col + 1 },
            { row: row + 2, col: col - 1 },
            { row: row + 2, col: col + 1 },
        ];

        return possibleJumps.filter(
            pos =>
                pos.row >= 0 &&
                pos.row < this.board.length &&
                pos.col >= 0 &&
                pos.col < this.board[0].length &&
                this.board[pos.row][pos.col] === null
        );
    }

    getPossibleMoves(position: Position): { copies: Position[]; jumps: Position[] } {
        if (!this.isPositionOwnedByCurrentPlayer(position)) return { copies: [], jumps: [] };

        return {
            copies: this.getCopyPositions(position),
            jumps: this.getJumpPositions(position),
        };
    }
    getPositionsOfPlayer(playerColor: PlayerColor): Position[] {
        const positions: Position[] = [];

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === playerColor) {
                    positions.push({ row: i, col: j });
                }
            }
        }

        return positions;
    }
}

export { GameBoard, PlayerColor, INITIAL_BOARD_STATE, MoveType };

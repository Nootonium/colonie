import Position from './Position';

enum currentPlayer {
    WHITE = 'white',
    BLACK = 'black',
}

enum MoveType {
    COPY,
    JUMP,
    INVALID,
}

type BoardState = (currentPlayer | null)[][];

const INITIAL_BOARD_STATE: BoardState = Array(7)
    .fill(null)
    .map((_, rowIndex) => {
        return Array(7)
            .fill(null)
            .map((_, colIndex) => {
                if (rowIndex === 0 && colIndex === 3) return currentPlayer.BLACK;
                if (rowIndex === 6 && colIndex === 3) return currentPlayer.WHITE;
                return null;
            });
    });

class GameBoard {
    board: BoardState;
    currentTurn: currentPlayer;

    constructor(newBoard: BoardState, currentTurn: currentPlayer) {
        this.board = newBoard;
        this.currentTurn = currentTurn;
    }

    isMoveValid(start: Position, target: Position): MoveType {
        const rowDiff = Math.abs(target.row - start.row);
        const colDiff = Math.abs(target.col - start.col);

        // Check for piece presence
        if (this.board[start.row][start.col] !== this.currentTurn) return MoveType.INVALID;

        // Check for empty target
        if (this.board[target.row][target.col] !== null) return MoveType.INVALID;

        // Copy Move
        if (rowDiff <= 1 && colDiff <= 1) return MoveType.COPY;

        // Jump Move
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
                // Skip the center (0, 0) direction which represents the original position
                if (dRow !== 0 || dCol !== 0) {
                    adjacentPositions.push({ row: row + dRow, col: col + dCol });
                }
            }
        }

        // Filter out positions that are outside the board's boundaries.
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

        // Update the board
        this.board[target.row][target.col] = this.currentTurn;

        if (moveType === MoveType.JUMP) {
            // If it's a jump move, clear the starting position.
            this.board[start.row][start.col] = null;
        }

        // Convert opponent pieces
        this.convertOpponentPieces(target);

        // Switch the current turn
        this.switchTurn();

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
        if (this.currentTurn === currentPlayer.WHITE) {
            this.currentTurn = currentPlayer.BLACK;
        } else {
            this.currentTurn = currentPlayer.WHITE;
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
        // Logic to determine the winner.
        const { white, black } = this.getScores();
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
        // Get adjacent positions
        const adjacent = this.getAdjacentPieces(position);

        // Filter for positions that are empty
        return adjacent.filter(pos => this.board[pos.row][pos.col] === null);
    }
    getJumpPositions(position: Position): Position[] {
        const { row, col } = position;
        const possibleJumps: Position[] = [
            { row: row - 2, col: col },
            { row: row + 2, col: col },
            { row: row, col: col - 2 },
            { row: row, col: col + 2 },
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
}

export { GameBoard, currentPlayer, INITIAL_BOARD_STATE };

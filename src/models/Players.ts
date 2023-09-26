import { Position } from '../types';
import { MoveType, PlayerColor, GameBoard } from './GameBoard';

export type PlayerType = 'human' | 'local-agent' | 'server-bot';

export abstract class Player {
    color: PlayerColor;
    abstract getPlayerType(): PlayerType;
    abstract makeMove(gameState: GameBoard, clickedPosition?: Position): Promise<Position[]>;
    constructor(color: PlayerColor) {
        this.color = color;
    }
}
export class HumanPlayer extends Player {
    private selectedPosition: Position | null = null;

    async makeMove(gameState: GameBoard, clickedPosition: Position): Promise<Position[]> {
        // First click: selecting a piece
        if (!this.selectedPosition) {
            // Ensure the clicked position belongs to the current player
            if (gameState.isPositionOwnedByCurrentPlayer(clickedPosition)) {
                this.selectedPosition = clickedPosition;
                return [clickedPosition];
            } else {
                throw new Error("The clicked piece doesn't belong to the current player.");
            }
        }
        // Second click: choosing the destination for the selected piece
        else {
            if (gameState.isPositionOwnedByCurrentPlayer(clickedPosition)) {
                this.selectedPosition = clickedPosition; // Swap selection
                return [clickedPosition];
            } else {
                const moveType = gameState.isMoveValid(this.selectedPosition, clickedPosition);
                if (moveType !== MoveType.INVALID) {
                    const move = [this.selectedPosition, clickedPosition];
                    this.selectedPosition = null;
                    return move;
                } else {
                    this.selectedPosition = null;
                    return [];
                }
            }
        }
    }

    getPlayerType(): PlayerType {
        return 'human';
    }
}

export class RandomAgentPlayer extends Player {
    async makeMove(gameState: GameBoard): Promise<Position[]> {
        const playerColor = this.color;
        const allPiecePositions = gameState.getPositionsOfPlayer(playerColor);

        if (allPiecePositions.length === 0) {
            throw new Error('No pieces left for the player.');
        }

        const validPiece = this.getRandomPieceWithValidMoves(gameState, allPiecePositions);
        if (!validPiece) {
            throw new Error('No valid moves for any pieces.');
        }

        const randomMove = this.getRandomMove(gameState, validPiece);
        return [validPiece, randomMove];
    }

    private getRandomPieceWithValidMoves(
        gameState: GameBoard,
        pieces: Position[]
    ): Position | null {
        const shuffledPieces = this.shuffleArray([...pieces]);

        for (const piece of shuffledPieces) {
            const possibleMoves = gameState.getPossibleMoves(piece);
            if (possibleMoves.copies.length > 0 || possibleMoves.jumps.length > 0) {
                return piece;
            }
        }

        return null;
    }

    private getRandomMove(gameState: GameBoard, piece: Position): Position {
        const { copies, jumps } = gameState.getPossibleMoves(piece);
        const allMoves = [...copies, ...jumps];
        const randomIndex = Math.floor(Math.random() * allMoves.length);
        return allMoves[randomIndex];
    }

    private shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getPlayerType(): PlayerType {
        return 'local-agent';
    }
}

export class ServerAgentPlayer extends Player {
    async makeMove(gameState: any): Promise<Position[]> {
        // Send the gameState to the server.
        const response = await fetch('server_endpoint', {
            method: 'POST',
            body: JSON.stringify(gameState),
            headers: { 'Content-Type': 'application/json' },
        });
        const move = await response.json();

        return move;
    }

    getPlayerType(): PlayerType {
        return 'server-bot';
    }
}

export function createPlayer(type: PlayerType, color: PlayerColor): Player {
    switch (type) {
        case 'human':
            return new HumanPlayer(color);
        case 'local-agent':
            return new RandomAgentPlayer(color);
        default:
            throw new Error('Invalid player type');
    }
}

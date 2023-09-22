import { Position } from '../types';

export type PlayerType = 'human' | 'local-bot' | 'server-bot';

export interface Player {
    getPlayerType(): PlayerType;
    makeMove(gameState: any): Promise<Position[]>;
}
export class HumanPlayer implements Player {
    async makeMove(gameState: any): Promise<Position[]> {
        return new Promise(resolve => {
            this.moves = [];
            const unsubscribe = gameState.onMove((position: Position) => {
                this.moves.push(position);
                if (this.moves.length === 2) {
                    unsubscribe();
                    resolve(this.moves);
                }
            });
        });
    }
    getPlayerType(): PlayerType {
        return 'human';
    }
}

export class RandomAgentPlayer implements Player {
    async makeMove(gameState: any): Promise<Position[]> {
        // This function would somehow get the move from the UI.
        // This could involve a user clicking on the board, etc.
        const validMoves = gameState.getValidMoves();
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return validMoves[randomIndex];
    }

    getPlayerType(): PlayerType {
        return 'local-bot';
    }
}

export class ServerAgentPlayer implements Player {
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

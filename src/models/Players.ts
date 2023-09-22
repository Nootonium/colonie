import { Position } from '../types';

type PlayerType = 'human' | 'local-bot' | 'server-bot';

interface Player {
    getPlayerType(): PlayerType;
    makeMove(gameState: any): Promise<Position>;
}
class HumanPlayer implements Player {
    async makeMove(gameState: any): Promise<Position> {
        // This function would somehow get the move from the UI.
        // This could involve a user clicking on the board, etc.
        return { row: 0, col: 0 };
    }

    getPlayerType(): PlayerType {
        return 'human';
    }
}

class RandomAgentPlayer implements Player {
    async makeMove(gameState: any): Promise<Position> {
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

class ServerAgentPlayer implements Player {
    async makeMove(gameState: any): Promise<Position> {
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

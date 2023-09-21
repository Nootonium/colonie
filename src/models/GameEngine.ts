import GameBoard from './GameBoard';

interface Player {
    name: string;
    color: 'white' | 'black';
    makeMove(game: GameBoard): void;
}

class GameEngine {
    game: GameBoard;
    whitePlayer: Player; // Renamed for clarity
    blackPlayer: Player;

    constructor(game: GameBoard, player1: Player, player2: Player) {
        this.game = game;
        this.whitePlayer = player1;
        this.blackPlayer = player2;
    }

    play(): void {
        while (!this.game.isGameComplete()) {
            const currentPlayer =
                this.game.currentTurn === 'white' ? this.whitePlayer : this.blackPlayer;

            const move = currentPlayer.makeMove(this.game);
            this.game.makeMove(currentPlayer, move);

            this.switchTurns();
        }

        const winner = this.game.getWinner();
        console.log(winner ? `${winner.name} has won!` : "It's a tie!");
    }

    switchTurns(): void {
        this.game.currentTurn = this.game.currentTurn === 'Player1' ? 'Player2' : 'Player1';
    }
}

export { GameEngine };

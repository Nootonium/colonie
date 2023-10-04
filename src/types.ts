export type CellValue = 'white' | 'black' | 'red' | 'green' | 'blue' | null;

export interface Position {
    row: number;
    col: number;
}

export type PlayerType = 'human' | 'local-agent' | 'server-bot';

export interface PlayerSettings {
    name: string;
    type: PlayerType;
}

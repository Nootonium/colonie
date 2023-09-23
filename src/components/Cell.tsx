import { CellValue } from '../types';

interface CellProps {
    value: CellValue;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Cell = ({ value, onClick }: CellProps) => {
    let backgroundColor;
    switch (value) {
        case 'white':
            backgroundColor = 'bg-white';
            break;
        case 'black':
            backgroundColor = 'bg-black';
            break;
        case 'red':
            backgroundColor = 'bg-red-500';
            break;
        case 'green':
            backgroundColor = 'bg-green-500';
            break;
        case 'blue':
            backgroundColor = 'bg-sky-500';
            break;
        default:
            backgroundColor = 'bg-neutral-500';
            break;
    }

    return (
        <button
            className={`h-10 w-10 border border-gray-500 ${backgroundColor} sm:h-16 sm:w-16`}
            onClick={onClick}
        ></button>
    );
};

export default Cell;

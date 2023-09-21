type CellValue = 'white' | 'black' | 'red' | 'green' | null;

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
            backgroundColor = 'bg-red-500'; // Assuming you're using TailwindCSS
            break;
        case 'green':
            backgroundColor = 'bg-green-500'; // Assuming you're using TailwindCSS
            break;
        default:
            backgroundColor = 'bg-gray-300';
            break;
    }

    return (
        <button
            className={`h-10 w-10 border border-gray-500 ${backgroundColor}`}
            onClick={onClick}
        ></button>
    );
};

export default Cell;

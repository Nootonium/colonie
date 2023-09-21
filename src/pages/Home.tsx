import Board from '../components/Board';
import SettingsModal from '../components/SettingsModal';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function Home() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="relative flex h-screen w-screen items-center justify-center bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500">
            <div className="rounded bg-black p-4">
                <h1 className="text-center text-2xl font-bold">
                    <Board />
                </h1>
            </div>
            <div className="absolute left-8 top-8 z-30" onClick={() => setIsSettingsOpen(true)}>
                <Cog6ToothIcon className="h-14 w-14 text-white" />
            </div>
            {isSettingsOpen && (
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
}

export default Home;

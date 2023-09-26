import Game from '../components/Game';
import SettingsModal from '../components/SettingsModal';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function Home() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="relative flex h-screen w-screen items-center justify-center ">
            <img
                src="planet.gif"
                alt="planet"
                className="absolute left-0 top-0 -z-10 h-full w-full object-cover object-center"
            />

            <Game whitePlayerType="human" blackPlayerType="human" />

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

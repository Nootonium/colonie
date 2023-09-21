import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

function SettingsModal({ isOpen, onClose }: SettingsProps) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={() => onClose()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 z-30 bg-black/90 transition-opacity" />
                </Transition.Child>
                <Transition.Child
                    as="div"
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-full"
                    enterTo="opacity-100 translate-y-0"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-full"
                    className="fixed inset-0 z-30"
                >
                    <Dialog.Panel
                        as="div"
                        className="absolute left-1/2 top-1/2 h-auto max-h-screen w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-gradient-to-b from-neutral-800 to-neutral-500 p-4 sm:p-8"
                    >
                        <h3 className={`font-JetBrainsMono py-2 text-3xl `}>Settings Menu</h3>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default SettingsModal;

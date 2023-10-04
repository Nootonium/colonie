import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlayerType, PlayerSettings } from '../types';

interface SettingsFormProps {
    onApply: (playerSettings: { white: PlayerSettings; black: PlayerSettings }) => void;
    onReset: () => void;
}

function SettingsForm({ onApply, onReset }: SettingsFormProps) {
    const { register, handleSubmit } = useForm();
    const [selectedTypeWhite, setSelectedTypeWhite] = useState<PlayerType>('human');
    const [selectedTypeBlack, setSelectedTypeBlack] = useState<PlayerType>('human');

    const onSubmit: SubmitHandler<{ white: PlayerSettings; black: PlayerSettings }> = data => {
        onApply(data);
    };

    return (
        <form>
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block">White Player</label>
                    <input
                        className="block w-full rounded border p-2"
                        {...register('white.name', { required: true })}
                        placeholder="Name"
                    />
                    <Listbox value={selectedTypeWhite} onChange={setSelectedTypeWhite}>
                        {({ open }) => (
                            <>
                                <Listbox.Button className="mt-2 block w-full rounded border-2 border-white p-2">
                                    {selectedTypeWhite}
                                </Listbox.Button>
                                <Transition show={open} as={Fragment}>
                                    <Listbox.Options className="mt-1 rounded border bg-white p-2">
                                        <Listbox.Option value="human">Human</Listbox.Option>
                                        <Listbox.Option value="local-agent">
                                            Local Agent
                                        </Listbox.Option>
                                        <Listbox.Option value="server-bot">
                                            Server Bot
                                        </Listbox.Option>
                                    </Listbox.Options>
                                </Transition>
                            </>
                        )}
                    </Listbox>
                    <input type="hidden" {...register('white.type')} value={selectedTypeWhite} />
                </div>

                {/* Repeat similar code for Black player with appropriate adjustments for state and register names. */}

                <div>
                    <label className="mb-2 block">Black Player</label>
                    <input
                        className="block w-full rounded border p-2"
                        {...register('black.name', { required: true })}
                        placeholder="Name"
                    />
                    <Listbox value={selectedTypeBlack} onChange={setSelectedTypeBlack}>
                        {({ open }) => (
                            <>
                                <Listbox.Button className="mt-2 block w-full rounded border-2 border-white p-2">
                                    {selectedTypeBlack}
                                </Listbox.Button>
                                <Transition show={open} as={Fragment}>
                                    <Listbox.Options className="mt-1 rounded border bg-white p-2">
                                        <Listbox.Option value="human">Human</Listbox.Option>
                                        <Listbox.Option value="local-agent">
                                            Local Agent
                                        </Listbox.Option>
                                        <Listbox.Option value="server-bot">
                                            Server Bot
                                        </Listbox.Option>
                                    </Listbox.Options>
                                </Transition>
                            </>
                        )}
                    </Listbox>
                    <input type="hidden" {...register('black.type')} value={selectedTypeBlack} />
                </div>

                <div className="mt-6 flex justify-between">
                    <button type="submit" className="rounded bg-green-500 p-2 text-white">
                        Apply
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded bg-red-500 p-2 text-white"
                    >
                        Reset Game
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SettingsForm;

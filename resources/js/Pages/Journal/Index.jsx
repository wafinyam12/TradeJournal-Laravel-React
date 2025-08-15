import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import JournalModal from '@/Components/JournalModal';



export default function Index({ auth, journals }) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        broker: '',
        balance_start: 0,
    });

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', broker: '', balance_start: 0 });
    const [showModal, setShowModal] = useState(false);
    const [editingJournal, setEditingJournal] = useState(null);
    const { put } = router;

    function submit(e) {
        e.preventDefault();
        post(route('journals.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Journals" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-xl">My Trading Journals</h2>
                            <PrimaryButton onClick={() => { setEditingJournal(null); setShowModal(true); }}>
                                New Journal
                            </PrimaryButton>
                        </div>

                        <ul>
                            {journals.map(j => (
                                <li key={j.id} className="border-b py-2 flex justify-between">
                                    <div>
                                        <Link href={route('trades.index', j.id)} className="font-bold hover:underline">
                                            {j.name}
                                        </Link> ({j.broker})
                                        <span className="ml-4 text-sm text-gray-500">
                                            Balance start: ${j.balance_start}
                                            &nbsp;({j.trades_count} trades)
                                        </span>
                                        <a
                                            href={route('journals.export-csv', j.id)}
                                            className="ml-2 text-indigo-600 hover:underline"
                                        >
                                            Export CSV
                                        </a>
                                    </div>
                                    <div className="space-x-2">
                                        {/* ==== Inline Edit ==== */}
                                        {editingId === j.id ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    put(route('journals.update', j.id), {
                                                        onSuccess: () => setEditingId(null),
                                                    });
                                                }}
                                                className="flex gap-2 items-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="border rounded px-2 py-1"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.broker}
                                                    onChange={(e) => setEditForm({ ...editForm, broker: e.target.value })}
                                                    className="border rounded px-2 py-1"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.balance_start}
                                                    onChange={(e) => setEditForm({ ...editForm, balance_start: e.target.value })}
                                                    className="border rounded px-2 py-1 w-32"
                                                />
                                                <button type="submit" className="text-green-600">Save</button>
                                                <button type="button" onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>

                                            </form>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingJournal(j); setShowModal(true); }}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                Swal.fire({
                                                    title: 'Delete journal?',
                                                    text: 'All trades inside will be lost!',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#d33',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        router.delete(route('journals.destroy', j.id));
                                                    }
                                                })
                                            }
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <JournalModal
                show={showModal}
                onClose={() => setShowModal(false)}
                journal={editingJournal}
            />
        </AuthenticatedLayout>
    );

}
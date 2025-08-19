import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, journals }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {journals.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-500 text-center">
                                Belum ada journal.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {journals.map((j) => (
                                <div
                                    key={j.id}
                                    className="bg-white shadow-sm sm:rounded-lg p-6"
                                >
                                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                                        {j.name}
                                    </h2>

                                    <dl className="mt-4 space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <dt>Trades</dt>
                                            <dd className="font-medium">{j.total_trades}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Win Rate</dt>
                                            <dd className="font-medium">{j.win_rate}%</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Total P/L</dt>
                                            <dd
                                                className={`font-medium ${j.total_pl >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                ${j.total_pl.toLocaleString()}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Avg RR</dt>
                                            <dd className="font-medium">{j.avg_rr}</dd>
                                        </div>
                                    </dl>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

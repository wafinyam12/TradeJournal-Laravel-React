// resources/js/Pages/Dashboard.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

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
                                <Link
                                    href={route('trades.index', j.id)}
                                    key={j.id}
                                    className="block bg-white shadow-sm sm:rounded-lg p-6 hover:shadow-md transition"
                                >
                                    <h2 className="text-lg font-semibold text-gray-800 truncate">{j.name}</h2>

                                    <dl className="mt-4 space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <dt>Balance Start</dt>
                                            <dd>${j.balance_start.toLocaleString()}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Balance Now</dt>
                                            <dd className={j.balance_now >= j.balance_start ? 'text-green-600' : 'text-red-600'}>
                                                ${j.balance_now.toLocaleString()}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Trades</dt>
                                            <dd>{j.total_trades}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Win Rate</dt>
                                            <dd>{j.win_rate}%</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>P/L</dt>
                                            <dd className={j.total_pl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                ${j.total_pl.toLocaleString()}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt>Avg RR</dt>
                                            <dd>{j.avg_rr}</dd>
                                        </div>
                                    </dl>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TradeModal from '@/Components/TradeModal';
import PrimaryButton from '@/Components/PrimaryButton';
import TradeDetailModal from '@/Components/TradeDetailModal';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

// ---------- constants ----------
const TV_SCRIPT_URL = 'https://s3.tradingview.com/tv.js';

// ---------- component ----------
export default function Index({ auth, journal, trades, stats }) {
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const [detailTrade, setDetailTrade] = useState(null);

    /* 1. Dropdown state */
    const [selectedSymbol, setSelectedSymbol] = useState('OANDA:XAUUSD');

    /* 2. Refs */
    const tvRef = useRef(null);
    const scriptRef = useRef(null);   // prevents double-embedding
    const widgetRef = useRef(null);   // holds the current widget instance

    /* 3. Supported pairs – add / remove as you wish */
    const pairs = [
        { label: 'Gold (XAUUSD)', value: 'OANDA:XAUUSD' },
        { label: 'Bitcoin (BTCUSDT)', value: 'BINANCE:BTCUSDT' },
        { label: 'EUR/USD', value: 'FX:EURUSD' },
        { label: 'GBP/USD', value: 'FX:GBPUSD' },

    ];

    const intervals = [
        { label: '1 menit', value: '1' },
        { label: '5 menit', value: '5' },
        { label: '15 menit', value: '15' },
        { label: '1 jam', value: '60' },
        { label: '1 hari', value: '1D' },
        { label: '1 minggu', value: '1W' },
    ];

    const [selectedInterval, setSelectedInterval] = useState('60'); // default 1 jam

    /* 4. Create / update chart */
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initChart = () => {
            // clean previous widget
            if (widgetRef.current) {
                widgetRef.current.remove();
                widgetRef.current = null;
            }

            // create new one
            widgetRef.current = new window.TradingView.widget({
                container_id: 'tv-widget',
                width: '100%',
                height: 300,
                symbol: selectedSymbol,
                interval: selectedInterval,
                timezone: 'America/New_York',
                theme: 'dark',
                style: 1,
                locale: 'id',
                toolbar_bg: '#f1f3f6',
                enable_publishing: false,
                allow_symbol_change: false,
                hide_side_toolbar: true,
                hide_top_toolbar: true,
            });
        };

        // inject script only once
        if (!scriptRef.current && !window.TradingView) {
            const scr = document.createElement('script');
            scr.src = TV_SCRIPT_URL;
            scr.async = true;
            scr.onload = initChart;
            tvRef.current?.appendChild(scr);
            scriptRef.current = scr;
        } else if (window.TradingView) {
            // script already loaded
            initChart();
        }
    }, [selectedSymbol, selectedInterval, journal.name]);
    const handlePairChange = (e) => setSelectedSymbol(e.target.value);
    // re-render if journal pair changes

    return (

        <AuthenticatedLayout user={auth.user}>
            <Head title={`${journal.name} - Trades`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        {journal.name} ({journal.broker})
                    </h2>

                    {/* stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6 mt-5">
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm text-gray-500">Total Trades</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold">
                                {stats.total ? ((stats.wins / stats.total) * 100).toFixed(1) : 0}%
                            </div>
                            <div className="text-sm text-gray-500">Win Rate</div>
                        </div>
                        <div className={`p-4 rounded shadow ${stats.net_pl > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            <div className="text-2xl font-bold">${Number(stats.net_pl).toFixed(2)}</div>
                            <div className="text-sm">Net P/L</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-2xl font-bold">{Number(stats.avg_rr || 0).toFixed(2)}</div>
                            <div className="text-sm">Avg RR</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* NEW: pair selector */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Chart symbol</label>
                            <select
                                value={selectedSymbol}
                                onChange={handlePairChange}
                                className="border rounded px-3 py-1"
                            >
                                {pairs.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Timeframe</label>
                            <select
                                value={selectedInterval}
                                onChange={(e) => setSelectedInterval(e.target.value)}
                                className="border rounded px-3 py-1"
                            >
                                {intervals.map((i) => (
                                    <option key={i.value} value={i.value}>{i.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div id="tv-widget" ref={tvRef} className="mb-6 h-80 w-full border rounded"></div>
                    <PrimaryButton onClick={() => setShowTradeModal(true)}>Add Trade</PrimaryButton>
                    {/* Trade list placeholder */}
                    <table className="w-full text-left mt-3">
                        <thead><tr>
                            <th>Pair</th><th>Dir</th><th>Open</th><th>Close</th><th>P/L</th><th>RR</th><th>Actions</th>
                        </tr></thead>
                        <tbody>
                            {trades.map(t => (
                                <tr key={t.id} className="border-b">
                                    <td>{t.pair}</td>
                                    <td>{t.direction}</td>
                                    <td>{t.price_open}</td>
                                    <td>{t.price_close ?? '—'}</td>
                                    <td className={t.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        ${t.profit_loss ?? '—'}
                                    </td>
                                    <td>{t.risk_reward ?? '—'}</td>
                                    <td>
                                        {t.screenshot_url ? (
                                            <a href={t.screenshot_url} download>
                                                <img
                                                    src={t.screenshot_url}
                                                    alt="chart"
                                                    className="w-12 h-12 object-cover rounded border"
                                                />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingTrade(t);
                                                setShowTradeModal(true);
                                            }}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                Swal.fire({
                                                    title: 'Delete trade?',
                                                    text: 'This action cannot be undone.',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#d33',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        router.delete(route('trades.destroy', t.id));
                                                    }
                                                })
                                            }
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setDetailTrade(t)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </button>
                                        <TradeDetailModal
                                            show={!!detailTrade}
                                            onClose={() => setDetailTrade(null)}
                                            trade={detailTrade}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <TradeModal
                key={editingTrade?.id || 'new'} // <-- tambahkan ini
                show={showTradeModal}
                onClose={() => {
                    setShowTradeModal(false);
                    setEditingTrade(null);
                }}
                journalId={journal.id}
                trade={editingTrade}
            />

        </AuthenticatedLayout>

    );
}
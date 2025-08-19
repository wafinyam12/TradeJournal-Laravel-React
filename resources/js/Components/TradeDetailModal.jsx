import React from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function TradeDetailModal({ show, onClose, trade }) {
    if (!trade) return null;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleString('id-ID') : '-';

    const fields = [
        { label: 'Pair', value: trade.pair },
        { label: 'Direction', value: trade.direction?.toUpperCase() },
        { label: 'Volume', value: trade.volume },
        { label: 'Open Price', value: trade.price_open },
        { label: 'Close Price', value: trade.price_close ?? '-' },
        { label: 'Stop Loss', value: trade.stop_loss ?? '-' },
        { label: 'Take Profit', value: trade.take_profit ?? '-' },
        { label: 'Opened At', value: formatDate(trade.opened_at) },
        { label: 'Closed At', value: formatDate(trade.closed_at) },
        { label: 'Pips', value: trade.pips ?? '-' },
        { label: 'Risk Reward', value: trade.risk_reward ?? '-' },
        { label: 'Profit / Loss', value: `$${Number(trade.profit_loss || 0).toFixed(2)}` },
        { label: 'Notes', value: trade.notes || '-' },
    ];

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6 space-y-4 text-sm">
                <h2 className="text-lg font-semibold mb-4">Trade Detail</h2>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {fields.map(({ label, value }) => (
                        <div key={label}>
                            <label className="block font-medium text-gray-700">{label}</label>
                            <div className="mt-1 text-gray-900">{value}</div>
                        </div>
                    ))}
                </div>

                {trade.screenshot_url && (
                    <div className="col-span-2">
                        <label className="block font-medium text-gray-700 mb-1">Screenshot</label>
                        <img
                            src={trade.screenshot_url}
                            alt="Screenshot"
                            className="rounded border w-full max-h-60 object-contain"
                        />
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
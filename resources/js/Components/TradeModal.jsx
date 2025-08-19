import React, { act, useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
// import Swal from 'sweetalert2';

export default function TradeModal({ show, onClose, journalId, trade }) {
  const { data, setData, put, post, processing, reset } = useForm({
    journal_id: journalId,
    pair: trade?.pair || '',
    direction: trade?.direction || 'buy',
    volume: trade?.volume || 0.1,
    price_open: trade?.price_open || '',
    price_close: trade?.price_close || '',
    stop_loss: trade?.stop_loss || '',
    take_profit: trade?.take_profit || '',
    opened_at: trade?.opened_at ? trade.opened_at.substring(0, 16) : '',
    closed_at: trade?.closed_at ? trade.closed_at.substring(0, 16) : '',
    notes: trade?.notes || '',
    screenshot: null,
  });

  useEffect(() => {
    reset({
      journal_id: journalId,
      pair: trade?.pair || '',
      direction: trade?.direction || 'buy',
      volume: trade?.volume || 0.1,
      price_open: trade?.price_open || '',
      price_close: trade?.price_close || '',
      stop_loss: trade?.stop_loss || '',
      take_profit: trade?.take_profit || '',
      opened_at: trade?.opened_at ? trade.opened_at.substring(0, 16) : '',
      closed_at: trade?.closed_at ? trade.closed_at.substring(0, 16) : '',
      notes: trade?.notes || '',
      screenshot: null,
    });
  }, [trade, journalId]);

  function submit(e) {
    e.preventDefault();

    if (trade) {
      // update -> kirim PUT
      put(route('trades.update', trade.id), {
        preserveScroll: true,
        onSuccess: () => { reset(); onClose(); },
      });
    } else {
      // store -> kirim POST
      post(route('trades.store'), {
        preserveScroll: true,
        onSuccess: () => { reset(); onClose(); },
      });
    }
  }

  return (
    <Modal show={show} onClose={onClose}>
      <form onSubmit={submit} encType="multipart/form-data" className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">{trade ? 'Edit' : 'Add'} Trade</h2>

        <div className="grid grid-cols-2 gap-4">
          <label>Pair
            <input value={data.pair} onChange={e => setData('pair', e.target.value)} required className="w-full border" />
          </label>
          <label>Direction
            <select value={data.direction} onChange={e => setData('direction', e.target.value)} className="w-full border">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>
          <label>Volume
            <input type="number" step="0.01" value={data.volume} onChange={e => setData('volume', e.target.value)} required className="w-full border" />
          </label>
          <label>Open Price
            <input type="number" step="0.00001" value={data.price_open} onChange={e => setData('price_open', e.target.value)} required className="w-full border" />
          </label>
          <label>Close Price
            <input type="number" step="0.00001" value={data.price_close} onChange={e => setData('price_close', e.target.value)} className="w-full border" />
          </label>
          <label>Stop Loss
            <input type="number" step="0.00001" value={data.stop_loss} onChange={e => setData('stop_loss', e.target.value)} className="w-full border" />
          </label>
          <label>Take Profit
            <input type="number" step="0.00001" value={data.take_profit} onChange={e => setData('take_profit', e.target.value)} className="w-full border" />
          </label>
          <label>Opened At
            <input type="datetime-local" value={data.opened_at} onChange={e => setData('opened_at', e.target.value)} required className="w-full border" />
          </label>
          <label>Closed At
            <input type="datetime-local" value={data.closed_at} onChange={e => setData('closed_at', e.target.value)} className="w-full border" />
          </label>
        </div>

        <label>Notes
          <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full border" />
        </label>

        <label>Screenshot
          <input type="file" onChange={e => setData('screenshot', e.target.files[0])} className="w-full" />
        </label>

        <div className="flex justify-end gap-2">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
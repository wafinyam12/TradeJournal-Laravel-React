import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function JournalModal({ show, onClose, journal }) {
  const { data, setData, post, put, processing, reset } = useForm({
    name: journal?.name || '',
    broker: journal?.broker || '',
    balance_start: journal?.balance_start || 0,
  });

  function submit(e) {
    e.preventDefault();
    if (journal) {
      put(route('journals.update', journal.id), { onSuccess: onClose });
    } else {
      post(route('journals.store'), { onSuccess: () => { reset(); onClose(); } });
    }
  }

  return (
    <Modal show={show} onClose={onClose}>
      <form onSubmit={submit} className="p-6">
        <h2 className="text-lg font-semibold mb-4">{journal ? 'Edit' : 'New'} Journal</h2>

        <label className="block mb-1">Name/Account</label>
        <input value={data.name} onChange={e=>setData('name',e.target.value)} className="w-full mb-3" required />

        <label className="block mb-1">Broker</label>
        <input value={data.broker} onChange={e=>setData('broker',e.target.value)} className="w-full mb-3" />

        <label className="block mb-1">Starting Balance</label>
        <input type="number" step="0.01" value={data.balance_start} onChange={e=>setData('balance_start',e.target.value)} className="w-full mb-4" required />

        <div className="flex justify-end gap-2">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
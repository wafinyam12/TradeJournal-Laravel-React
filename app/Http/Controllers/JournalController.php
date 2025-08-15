<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreJournalRequest;
use App\Http\Requests\UpdateJournalRequest;
use App\Models\Journal;
use App\Exports\TradeExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        $journals = Auth::user()->journals()
            ->withCount('trades')
            ->latest()
            ->get();
        return Inertia::render('Journal/Index', ['journals' => $journals]);
    }

    public function store(StoreJournalRequest $request)
    {
        Auth::user()->journals()->create($request->validated());
        return redirect()->route('journals.index');
    }

    public function update(UpdateJournalRequest $request, Journal $journal)
    {
        $this->authorize('update', $journal);
        $journal->update($request->validated());
        return redirect()->route('journals.index');
    }

    public function destroy(Journal $journal)
    {
        $this->authorize('delete', $journal);
        $journal->delete();
        return redirect()->route('journals.index');
    }

    public function exportCsv(Journal $journal)
    {
        $this->authorize('view', $journal);
        return Excel::download(new TradeExport($journal), "journal-{$journal->id}-trade.xlsx");
    }
}

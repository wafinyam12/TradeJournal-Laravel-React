<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTradeRequest;
use App\Http\Requests\UpdateTradeRequest;
use App\Models\Trade;
use App\Models\Journal;
use Inertia\Inertia;

class TradeController extends Controller
{
    public function index(Journal $journal)
    {

        $this->authorize('view', $journal);
        $trades = $journal->trades()
            ->select('trades.*')
            ->selectRaw(
                "CASE WHEN screenshot_path IS NOT NULL 
         THEN CONCAT('/storage/', screenshot_path) 
         ELSE NULL END as screenshot_url"
            )
            ->latest()
            ->get();
        $stats = $journal->trades()
            ->selectRaw('
        count(*) as total,
        sum(case when profit_loss > 0 then 1 else 0 end) as wins,
        sum(profit_loss) as net_pl,
        avg(risk_reward) as avg_rr
    ')
            ->first();

        return Inertia::render('Trade/Index', [
            'journal' => $journal,
            'trades'  => $trades,
            'stats'   => $stats,   // <-- add this
        ]);
    }

    public function store(StoreTradeRequest $request)
    {
        $journal = Journal::findOrFail($request->journal_id);
        $this->authorize('update', $journal);

        $trade = $journal->trades()->create($request->validated());

        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('screenshots', 'public');
            $trade->update(['screenshot_path' => $path]);
        }

        return redirect()->route('trades.index', $journal);
    }

    public function update(UpdateTradeRequest $request, Trade $trade)
    {
        $this->authorize('update', $trade->journal);
        $trade->update($request->validated());
        return redirect()->route('trades.index', $trade->journal);
    }

    public function destroy(Trade $trade)
    {
        $this->authorize('delete', $trade->journal);
        $trade->delete();
        return redirect()->route('trades.index', $trade->journal);
    }
}

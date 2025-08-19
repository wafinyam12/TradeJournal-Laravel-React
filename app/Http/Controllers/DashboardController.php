<?php

// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $journals = auth()->user()
            ->journals()
            ->select('id', 'name', 'balance_start')
            ->withSum('trades as total_pl', 'profit_loss')
            ->withCount(['trades as total_trades'])
            ->withCount(['trades as win_trades' => fn($q) => $q->where('profit_loss', '>', 0)])
            ->withAvg('trades as avg_rr', 'risk_reward')
            ->get()
            ->map(fn($j) => [
                'id'            => $j->id,
                'name'          => $j->name,
                'balance_start' => (float) $j->balance_start,
                'balance_now'   => (float) ($j->balance_start + $j->total_pl),
                'total_pl'      => (float) $j->total_pl,
                'total_trades'  => $j->total_trades,
                'win_rate'      => $j->total_trades ? round(($j->win_trades / $j->total_trades) * 100, 1) : 0,
                'avg_rr'        => (float) round($j->avg_rr, 2),
            ]);

        return Inertia::render('Dashboard', [
            'journals' => $journals,
        ]);
    }
}

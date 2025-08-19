    <?php

    use App\Http\Controllers\ProfileController;
    use Illuminate\Foundation\Application;
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;

    use App\Http\Controllers\JournalController;
    use App\Http\Controllers\TradeController;
    use App\Models\Journal;

    /*
    |--------------------------------------------------------------------------
    | Web Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register web routes for your application. These
    | routes are loaded by the RouteServiceProvider within a group which
    | contains the "web" middleware group. Now create something great!
    |
    */

    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('journals/{journal}/export-csv', [JournalController::class, 'exportCsv'])->name('journals.export-csv');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::resource('journals', JournalController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
    });
    Route::prefix('journals/{journal}')->group(function () {
        Route::get('trades', [TradeController::class, 'index'])->name('trades.index');
    });
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::post('trades', [TradeController::class, 'store'])->name('trades.store');
        Route::put('trades/{trade}', [TradeController::class, 'update'])->name('trades.update');
        Route::delete('trades/{trade}', [TradeController::class, 'destroy'])->name('trades.destroy');
    });

    Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'journals' => auth()->user()
                ->journals()
                ->withSum('trades as total_pl', 'profit_loss')
                ->withCount(['trades as total_trades'])
                ->withCount(['trades as win_trades' => fn($q) => $q->where('profit_loss', '>', 0)])
                ->withAvg('trades as avg_rr', 'risk_reward')
                ->get()
                ->map(fn($j) => [
                    'id'         => $j->id,
                    'name'       => $j->name,
                    'total_trades' => $j->total_trades,
                    'win_rate'   => $j->total_trades ? round(($j->win_trades / $j->total_trades) * 100, 1) : 0,
                    'total_pl'   => (float) $j->total_pl,
                    'avg_rr'     => (float) round($j->avg_rr, 2),
                ]),
        ]);
    })->name('dashboard');

    require __DIR__ . '/auth.php';

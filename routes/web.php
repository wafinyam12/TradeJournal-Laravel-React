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
    Route::resource('trades', TradeController::class)->only(['store', 'update', 'destroy']);
});

require __DIR__ . '/auth.php';

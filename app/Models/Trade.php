<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trade extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'journal_id',
        'pair',
        'direction',
        'volume',
        'price_open',
        'price_close',
        'stop_loss',
        'take_profit',
        'pips',
        'profit_loss',
        'risk_reward',
        'notes',
        'screenshot_path',
        'opened_at',
        'closed_at',
    ];

    protected $casts = [
        'opened_at'  => 'datetime',
        'closed_at'  => 'datetime',
    ];
    protected static function booted()
    {
        // Hitung otomatis setiap kali model disimpan / di-update
        static::saving(function (Trade $trade) {
            // --- 1. Pips ---
            if ($trade->price_close !== null && $trade->price_open !== null) {
                $multiplier = $trade->pipsMultiplier();
                $diff = $trade->direction === 'buy'
                    ? $trade->price_close - $trade->price_open
                    : $trade->price_open - $trade->price_close;

                $trade->pips = (int) round($diff * $multiplier);
            }

            // --- 2. Profit/Loss (dalam USD) ---
            if ($trade->price_close !== null) {
                // asumsi volume = lot; 1 lot = 100.000 unit
                $contract = $trade->contractSize();           // unit per lot
                $units    = $trade->volume * $contract;       // total unit

                $priceDiff = $trade->direction === 'buy'
                    ? $trade->price_close - $trade->price_open
                    : $trade->price_open - $trade->price_close;

                $trade->profit_loss = (float) number_format($priceDiff * $units, 2, '.', '');
            }

            // --- 3. Risk Reward ---
            if ($trade->stop_loss && $trade->take_profit) {
                $slDistance = abs($trade->price_open - $trade->stop_loss);
                $tpDistance = abs($trade->take_profit - $trade->price_open);

                if ($slDistance > 0) {
                    $trade->risk_reward = (float) number_format($tpDistance / $slDistance, 2, '.', '');
                }
            }
        });
    }
    protected function pipsMultiplier(): int
    {
        $suffix = strtoupper(substr($this->pair, -3)); // 3 karakter terakhir

        return match ($suffix) {
            'JPY' => 100,
            'XAU', 'XAG' => 10,     // Gold / Silver 1 point = 0.1
            'BTC', 'ETH' => 1,      // Crypto 1 point = 1
            '30', '500', '100' => 1,       // Indeks seperti US30, US500 (1 point = 1)
            default => 10000,       // Mayor / Minor pairs
        };
    }

    protected function contractSize(): float
    {
        $symbol = strtoupper($this->pair);

        return match (true) {
            str_ends_with($symbol, 'USD') && str_starts_with($symbol, 'XAU') => 100,   // XAUUSD 1 lot = 100 oz
            str_ends_with($symbol, 'USD') && str_starts_with($symbol, 'XAG') => 5000,  // XAGUSD 1 lot = 5000 oz
            str_contains($symbol, 'BTC') => 1,                                         // BTCUSD 1 lot = 1 coin
            str_contains($symbol, 'ETH') => 1,                                         // ETHUSD 1 lot = 1 coin
            default => 100000,                                                         // forex mayor/minor
        };
    }

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}

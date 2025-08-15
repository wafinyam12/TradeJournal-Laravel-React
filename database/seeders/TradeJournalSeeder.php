<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TradeJournalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $user = \App\Models\User::factory()->create([
            'name'  => 'Demo User',
            'email' => 'demo@example.com',
            'password' => bcrypt('password'),
        ]);

        $journal = $user->journals()->create([
            'name'         => 'Deriv MT5',
            'broker'       => 'MetaTrader 5',
            'balance_start' => 1000,
        ]);

        $journal->trades()->createMany([
            [
                'pair'       => 'EURUSD',
                'direction'  => 'buy',
                'volume'     => 0.10,
                'price_open' => 1.08500,
                'price_close' => 1.08900,
                'stop_loss'  => 1.08300,
                'take_profit' => 1.08900,
                'pips'       => 40,
                'profit_loss' => 40.00,
                'risk_reward' => 2.00,
                'opened_at'  => now()->subDays(3),
                'closed_at'  => now()->subDays(3)->addHour(),
                'notes'      => 'Follow trend London session',
            ],
            [
                'pair'       => 'GBPUSD',
                'direction'  => 'sell',
                'volume'     => 0.20,
                'price_open' => 1.27000,
                'price_close' => 1.26600,
                'stop_loss'  => 1.27200,
                'take_profit' => 1.26600,
                'pips'       => 40,
                'profit_loss' => 80.00,
                'risk_reward' => 2.00,
                'opened_at'  => now()->subDays(2),
                'closed_at'  => now()->subDays(2)->addHour(),
                'notes'      => 'Breakout support level',
            ],
            [
                'pair'       => 'XAUUSD',
                'direction'  => 'buy',
                'volume'     => 0.05,
                'price_open' => 2330.00,
                'price_close' => null,        // floating
                'stop_loss'  => 2320.00,
                'take_profit' => 2340.00,
                'opened_at'  => now()->subHour(),
                'notes'      => 'Wait NFP news',
            ],
        ]);
    }
}

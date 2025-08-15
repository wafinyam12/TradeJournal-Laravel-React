<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained()->cascadeOnDelete();
            $table->string('pair');
            $table->enum('direction', ['buy', 'sell']);
            $table->decimal('volume', 12, 4);
            $table->decimal('price_open', 12, 5);
            $table->decimal('price_close', 12, 5)->nullable();
            $table->decimal('stop_loss', 12, 5)->nullable();
            $table->decimal('take_profit', 12, 5)->nullable();
            $table->integer('pips')->nullable();
            $table->decimal('profit_loss', 12, 2)->nullable();
            $table->decimal('risk_reward', 4, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('screenshot_path')->nullable();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};

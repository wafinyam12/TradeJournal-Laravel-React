<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah di-handle policy
    }

    public function rules(): array
    {
        return [
            'journal_id'    => 'required|exists:journals,id',
            'pair'          => 'required|string|max:20',
            'direction'     => 'required|in:buy,sell',
            'volume'        => 'required|numeric|min:0',
            'price_open'    => 'required|numeric',
            'price_close'   => 'nullable|numeric',
            'stop_loss'     => 'nullable|numeric',
            'take_profit'   => 'nullable|numeric',
            'opened_at'     => 'required|date',
            'closed_at'     => 'nullable|date|after_or_equal:opened_at',
            'notes'         => 'nullable|string|max:500',
            'screenshot'    => 'nullable|image|max:2048',
        ];
    }
}

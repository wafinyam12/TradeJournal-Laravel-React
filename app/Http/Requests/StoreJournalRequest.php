<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJournalRequest extends FormRequest
{
    public function authorize()
    {
        return true; // sudah di-handle oleh policy/controller
    }

    public function rules()
    {
        return [
            'name'          => 'required|string|max:255',
            'broker'        => 'nullable|string|max:255',
            'balance_start' => 'required|numeric|min:0',
        ];
    }
}

<?php

namespace App\Http\Requests\MasterData;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'supplier_name'      => 'required|string|max:200',
            'supplier_code'      => 'nullable|string|max:12|unique:suppliers,supplier_code',
            'contact'            => 'nullable|string|max:20',
            'email'              => 'nullable|email|max:255',
            'address'            => 'nullable|string|max:200',
            'city'               => 'nullable|string|max:50',
            'province'           => 'nullable|string|max:35',
            'postal_code'        => 'nullable|string|max:10',
            'supplier_category'  => 'nullable|string|max:100',
        ];
    }
}

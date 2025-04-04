<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Suppliers extends Model
{
    use SoftDeletes;

    protected $table = 'suppliers';

    protected $fillable = [
        'supplier_name',
        'supplier_code',
        'contact_person',
        'phone_number',
        'email',
        'address',
        'city',
        'province',
        'postal_code',
        'supplier_category',
    ];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    protected $appends = [
        'label'
    ];


    public static function getSearchables()
    {
        return [
            'supplier_name' => 'like',
            'supplier_code' => 'like',
            'supplier_category' => '=',

        ];
    }

    public static function getDefaultOrderBy()
    {
        return [
            'column_name' => 'supplier_name',
            'order' => 'asc'
        ];
    }

    public function getLabelAttribute()
    {
        return $this->name;
    }
}

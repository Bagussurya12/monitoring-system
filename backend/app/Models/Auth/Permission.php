<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guard_name',
    ];

    public static function getDefaultOrderBy()
    {
        return [
            'column_name' => 'created_at',
            'order' => 'asc'
        ];
    }

    public static function getSearchables()
    {
        return [
            'name' => 'like',
            'guard_name' => '=',
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_has_permissions', 'permission_id', 'role_id');
    }
}

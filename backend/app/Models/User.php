<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, LogsActivity, SoftDeletes, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'password',
        'changed_password',
        'last_active',
    ];

    protected $appends = [
        'label'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public static function getSearchables()
    {
        return [
            'name' => '=',
            'username' => '=',
        ];
    }

    public static function getDefaultOrderBy()
    {
        return [
            'column_name' => 'id',
            'order' => 'asc'
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function getLabelAttribute()
    {
        return $this->name;
    }

    public function role()
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles', 'model_id', 'role_id');
    }

	public function recipeComments()
	{
		return $this->hasMany(RecipeComment::class, 'user_id');
    }

	public function stockMovementBufferedGoods()
	{
		return $this->hasMany(StockMovementBufferedGood::class, 'user_id');
	}
}

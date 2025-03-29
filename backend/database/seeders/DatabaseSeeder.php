<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $user = User::where('username', 'admin')->first();
        if (empty($user)) {
            User::create([
                'name' => 'admin',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'changed_password' => 1
            ]);

            $role = Role::where('name', 'Super Admin')->first();
            $user->assignRole($role);
        } else {
            $role = Role::where('name', 'Super Admin')->first();
            $user->assignRole($role);
        }

        $this->call(RoleSeeder::class);
    }
}

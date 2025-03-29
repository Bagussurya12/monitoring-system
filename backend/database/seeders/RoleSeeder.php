<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Database\Seeders\RoleSeeder\{
    LeaderRole,
    SorterRole,
    SuperAdminRole
};

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        (new SuperAdminRole)->seed();
    }
}

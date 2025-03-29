<?php

namespace App\PermissionsManager;

use App\PermissionsManager\PermissionsManager;

class SuperAdminPermissionsManager extends PermissionsManager
{
    public $permissions = [
		// ==================== Master Data ===================== //
        'Settings - View Master Data in Sidebar',

        // User Access Management
        'Settings - Master Data - View User Management in Sidebar',
        'Settings - Master Data - View Role Management in Sidebar',
        'Settings - Master Data - Can List User Management',
        'Settings - Master Data - Can Create User Management',
        'Settings - Master Data - Can Show User Management',
        'Settings - Master Data - Can Update User Management',
        'Settings - Master Data - Can Delete User Management',
        'Settings - Master Data - Can Reset 2FA User',
    ];
}

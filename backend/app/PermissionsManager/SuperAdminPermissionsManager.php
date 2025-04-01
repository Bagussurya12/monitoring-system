<?php

namespace App\PermissionsManager;

use App\PermissionsManager\PermissionsManager;

class SuperAdminPermissionsManager extends PermissionsManager
{
    public $permissions = [
		// ==================== User Data ===================== //
        'Settings - View User in Sidebar',

        // User Access Management
        'Settings - User - View User Management in Sidebar',
        'Settings - User - View Role Management in Sidebar',
        'Settings - User - Can List User Management',
        'Settings - User - Can Create User Management',
        'Settings - User - Can Show User Management',
        'Settings - User - Can Update User Management',
        'Settings - User - Can Delete User Management',
        'Settings - User - Can Reset 2FA User',

        // Role Access Management
        'Settings - User - View Role Management in Sidebar',
        'Settings - User - Can List Role Access Management',
        'Settings - User - Can Create Role Access Management',
        'Settings - User - Can Show Role Access Management',
        'Settings - User - Can Update Role Access Management',
        'Settings - User - Can Delete Role Access Management',
        'Settings - User - List Permissions for a User',

        // User Access Management
        'Settings - User - View Access Management in Sidebar',
        'Settings - User - Assign Users to Roles',
    ];
}

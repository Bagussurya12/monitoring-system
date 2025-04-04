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


        // ==================== Master Data ===================== //
        'Master Data - View Master Data in Sidebar',

        // Location Management
        'Master Data - Location - View Location Management in Sidebar',
        'Master Data - Location - Can List Location Management',
        'Master Data - Location - Can Create Location Management',
        'Master Data - Location - Can Show Location Management',
        'Master Data - Location - Can Update Location Management',
        'Master Data - Location - Can Delete Location Management',

        // Suppliers Management
        'Master Data - Suppliers - View Supppliers Management in Sidebar',
        'Master Data - Suppliers - Can List Supppliers Management',
        'Master Data - Suppliers - Can Create Supppliers Management',
        'Master Data - Suppliers - Can Show Supppliers Management',
        'Master Data - Suppliers - Can Update Supppliers Management',
        'Master Data - Suppliers - Can Delete Supppliers Management',
    ];
}

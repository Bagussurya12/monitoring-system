<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\UserAccessManagementController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Users\RoleManagementController as RoleController;
use App\Http\Controllers\Users\AccessManagementController as AccessController;
use App\Http\Controllers\MasterData\SupplierController;


Route::post('login', [LoginController::class, '__invoke']);
Route::middleware('auth:sanctum')->group(function (){
    Route::get('get-permissions', [UserAccessManagementController::class, 'getPermissions']);
    Route::prefix('settings')->group(function () {
        Route::get('users/get-ajax', [UserController::class, 'getAjax']);
        Route::post('/users/reset-two-fa/{id}', [UserController::class, 'resetTwoFa']);
        Route::resources([
            'users' => UserController::class,
        ]);
        Route::prefix('role-access-managements')->group(function () {
            Route::get('/', [RoleController::class, 'index']);
            Route::post('/store', [RoleController::class, 'store']);
            Route::get('show/{id}', [RoleController::class, 'show']);
            Route::put('update/{id}', [RoleController::class, 'update']);
            Route::delete('destroy/{id}', [RoleController::class, 'destroy']);
            Route::get('get-permissions', [RoleController::class, 'getPermissions']);
            Route::post('assign-role', [RoleController::class, 'assignRole']);
        });
        Route::prefix('user-access-managements')->group(function () {
            Route::get('/', [AccessController::class, 'index']);
            Route::get('show/{id}', [AccessController::class, 'show']);
            Route::get('get-roles', [AccessController::class, 'getRoles']);
            Route::get('get-permissions', [AccessController::class, 'getPermissions']);
            Route::get('get-all-roles', [AccessController::class, 'getAllRoles']);
            Route::post('assign-role', [AccessController::class, 'assignRole']);
        });
    });
    Route::prefix('master-data')->group(function(){
        Route::prefix('supplier')->group(function () {
            Route::get('/', [SupplierController::class, 'index']);
            Route::post('/store', [SupplierController::class, 'store']);
            Route::get('show/{id}', [SupplierController::class, 'show']);
            Route::put('update/{id}', [SupplierController::class, 'update']);
            Route::delete('delete/{id}', [SupplierController::class, 'destroy']);
        });
    });
});

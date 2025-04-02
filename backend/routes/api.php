<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\UserAccessManagementController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Users\RoleManagementController as RoleController;


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
    });
});

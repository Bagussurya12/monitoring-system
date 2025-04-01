<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\UserAccessManagementController;
use App\Http\Controllers\Users\UserController;

Route::post('login', [LoginController::class, '__invoke']);
Route::middleware('auth:sanctum')->group(function (){
    Route::get('get-permissions', [UserAccessManagementController::class, 'getPermissions']);
    Route::prefix('settings')->group(function () {
        Route::get('users/get-ajax', [UserController::class, 'getAjax']);
        Route::post('/users/reset-two-fa/{id}', [UserController::class, 'resetTwoFa']);

        Route::resources([
            'users' => UserController::class,
        ]);
    });
});

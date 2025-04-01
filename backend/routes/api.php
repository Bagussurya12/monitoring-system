<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\UserAccessManagementController;

Route::post('login', [LoginController::class, '__invoke']);
Route::middleware('auth:sanctum')->group(function (){
    Route::get('get-permissions', [UserAccessManagementController::class, 'getPermissions']);
});

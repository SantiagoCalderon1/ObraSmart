<?php

use App\Http\Middleware\ExpireTokenMiddleware;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', ExpireTokenMiddleware::class])->group(function () {
    Route::get('/budgets', [AuthController::class, 'isAuthenticated']); 
    Route::get('/auth', [AuthController::class, 'isAuthenticated']); 
    Route::get('/me', [AuthController::class, 'me']); 
    Route::post('/logout', [AuthController::class, 'logout']); 
});



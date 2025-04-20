<?php

use App\Http\Middleware\ExpireTokenMiddleware;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetsController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum'])->group(function () {
    //Route::apiResource('budgets', [BudgetsController::class]);

    //Route::get('/budgets', [AuthController::class, 'isAuthenticated']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

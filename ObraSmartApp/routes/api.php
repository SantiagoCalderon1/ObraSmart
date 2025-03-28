<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth', [AuthController::class, 'isAuthenticated']); // Obtener usuario autenticado
    Route::get('/me', [AuthController::class, 'me']); // Obtener usuario autenticado
    Route::post('/logout', [AuthController::class, 'logout']); // Cerrar sesión
});

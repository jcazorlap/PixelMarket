<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\AuthController;

// Games
Route::get('/games',  [GameController::class, 'index']);
Route::get('/genres', [GameController::class, 'genres']);

// Auth (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Auth (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::get('/me',              [AuthController::class, 'me']);
    Route::put('/me',              [AuthController::class, 'update']);
    Route::put('/me/password',     [AuthController::class, 'updatePassword']);
});

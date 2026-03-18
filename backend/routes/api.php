<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\ContactController;

// Contact Form
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/games',  [GameController::class, 'index']);
Route::get('/genres', [GameController::class, 'genres']);

// Auth (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Google Auth
Route::get('/auth/google',          [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Auth (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::get('/me',              [AuthController::class, 'me']);
    Route::put('/me',              [AuthController::class, 'update']);
    Route::put('/me/password',     [AuthController::class, 'updatePassword']);
    Route::put('/me/dino-score',   [AuthController::class, 'updateDinoScore']);

    // Wishlist
    Route::get('/wishlist',              [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle/{game}', [WishlistController::class, 'toggle']);
    Route::get('/wishlist/check/{game}',  [WishlistController::class, 'check']);
});

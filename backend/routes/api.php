<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\ScraperController;
use App\Http\Controllers\ContactController;

// Formulario de contacto
Route::post('/contact', [ContactController::class, 'store']);

// CRUD de juegos
Route::get('/games',  [GameController::class, 'index']);
Route::post('/games', [GameController::class, 'store']);
Route::put('/games/{game}', [GameController::class, 'update']);
Route::delete('/games/all', [GameController::class, 'destroyAll']);
Route::delete('/games/{game}', [GameController::class, 'destroy']);
Route::patch('/games/{game}/toggle-visibility', [GameController::class, 'toggleVisibility']);

// CRUD de géneros
Route::get('/genres',  [GenreController::class, 'index']);
Route::post('/genres', [GenreController::class, 'store']);
Route::put('/genres/{genre}', [GenreController::class, 'update']);
Route::delete('/genres/all', [GenreController::class, 'destroyAll']);
Route::delete('/genres/{genre}', [GenreController::class, 'destroy']);

// Configuración del scraper
Route::get('/scraper/config', [ScraperController::class, 'getConfig']);
Route::post('/scraper/config', [ScraperController::class, 'updateConfig']);

// Autenticación (rutas públicas)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Autenticación con Google
Route::get('/auth/google',          [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Autenticación (rutas protegidas)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::get('/me',              [AuthController::class, 'me']);
    Route::put('/me',              [AuthController::class, 'update']);
    Route::put('/me/password',     [AuthController::class, 'updatePassword']);
    Route::put('/me/dino-score',   [AuthController::class, 'updateDinoScore']);

    // Lista de deseos
    Route::get('/wishlist',              [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle/{game}', [WishlistController::class, 'toggle']);
    Route::get('/wishlist/check/{game}',  [WishlistController::class, 'check']);
});

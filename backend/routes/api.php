<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\GameController;

Route::get('/games', [GameController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

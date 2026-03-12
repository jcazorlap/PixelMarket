<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Game;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with(['prices.store', 'genres'])->get();
        return response()->json($games);
    }
}

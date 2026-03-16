<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Get the authenticated user's wishlist games.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $wishlist = $user->wishlist()->with(['prices.store', 'genres'])->get();
        
        return response()->json($wishlist);
    }

    /**
     * Toggle a game in the user's wishlist.
     */
    public function toggle(Request $request, Game $game)
    {
        $user = $request->user();
        $status = $user->wishlist()->toggle($game->id);
        
        $isWishlisted = count($status['attached']) > 0;
        
        return response()->json([
            'message' => $isWishlisted ? 'Juego añadido a la lista de deseos' : 'Juego eliminado de la lista de deseos',
            'is_wishlisted' => $isWishlisted
        ]);
    }
    
    /**
     * Check if a game is in the user's wishlist.
     */
    public function check(Request $request, Game $game)
    {
        $user = $request->user();
        $isWishlisted = $user->wishlist()->where('game_id', $game->id)->exists();
        
        return response()->json([
            'is_wishlisted' => $isWishlisted
        ]);
    }
}

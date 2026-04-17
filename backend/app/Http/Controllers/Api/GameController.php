<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Store;
use App\Models\GamePrice;
use App\Models\Genre;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    public function index()
    {
        // Devolver todos los juegos del catálogo (también usado por el administrador)
        $games = Game::with(['prices.store', 'genres'])->orderBy('id', 'desc')->get();
        return response()->json($games);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'cover_image_file' => 'nullable|image|max:5120', // Máximo 5MB
            'is_visible' => 'nullable',
            'prices' => 'nullable|string',
            'genres' => 'nullable|string'
        ]);

        $data = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_visible' => filter_var($request->input('is_visible', true), FILTER_VALIDATE_BOOLEAN),
        ];

        if ($request->hasFile('cover_image_file')) {
            $path = $request->file('cover_image_file')->store('games', 'public');
            $data['cover_image'] = asset('storage/' . $path);
        } elseif ($request->input('cover_image')) {
            $data['cover_image'] = $request->input('cover_image');
        }

        $game = Game::create($data);

        if ($request->has('prices')) {
            $this->syncPrices($game, $request->input('prices'));
        }

        if ($request->has('genres')) {
            $this->syncGenres($game, $request->input('genres'));
        }

        return response()->json($game->load(['prices.store', 'genres']), 201);
    }

    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'cover_image_file' => 'nullable|image|max:5120',
            'is_visible' => 'nullable',
            'prices' => 'nullable|string',
            'genres' => 'nullable|string'
        ]);

        $data = [
            'name' => $request->input('name', $game->name),
            'description' => $request->input('description', $game->description),
            'is_visible' => filter_var($request->input('is_visible', $game->is_visible), FILTER_VALIDATE_BOOLEAN),
        ];

        if ($request->hasFile('cover_image_file')) {
            if (str_contains($game->cover_image, '/storage/games/')) {
                $oldPath = 'games/' . basename($game->cover_image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('cover_image_file')->store('games', 'public');
            $data['cover_image'] = asset('storage/' . $path);
        } elseif ($request->has('cover_image')) {
            $data['cover_image'] = $request->input('cover_image');
        }

        $game->update($data);

        if ($request->has('prices')) {
            $this->syncPrices($game, $request->input('prices'));
        }

        if ($request->has('genres')) {
            $this->syncGenres($game, $request->input('genres'));
        }

        return response()->json($game->load(['prices.store', 'genres']));
    }

    private function syncPrices($game, $pricesJson)
    {
        $prices = json_decode($pricesJson, true);
        if (!is_array($prices))
            return;

        $game->prices()->delete();

        foreach ($prices as $priceData) {
            if (empty($priceData['store_name']))
                continue;

            $store = Store::firstOrCreate(['name' => $priceData['store_name']]);
            $game->prices()->create([
                'store_id' => $store->id,
                'price' => $priceData['price'] ?? 0,
                'url_link' => $priceData['url_link'] ?? ''
            ]);
        }
    }

    private function syncGenres($game, $genresJson)
    {
        $genreIds = json_decode($genresJson, true);
        if (!is_array($genreIds))
            return;

        $game->genres()->sync($genreIds);
    }

    public function destroy(Game $game)
    {
        if (str_contains($game->cover_image, '/storage/games/')) {
            $path = 'games/' . basename($game->cover_image);
            Storage::disk('public')->delete($path);
        }

        $game->delete();
        return response()->json(null, 204);
    }

    public function destroyAll()
    {
        $files = Storage::disk('public')->allFiles('games');
        Storage::disk('public')->delete($files);

        Game::query()->delete();
        return response()->json(['message' => 'Todos los juegos eliminados correctamente'], 200);
    }

    public function toggleVisibility(Game $game)
    {
        $game->update(['is_visible' => !$game->is_visible]);
        return response()->json($game);
    }
}

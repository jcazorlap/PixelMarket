<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genre;

class GenreController extends Controller
{
    public function index()
    {
        return response()->json(Genre::withCount('games')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:genres,name'
        ]);

        $genre = Genre::create($validated);
        return response()->json($genre->loadCount('games'), 201);
    }

    public function update(Request $request, Genre $genre)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:genres,name,' . $genre->id
        ]);

        $genre->update($validated);
        return response()->json($genre->loadCount('games'));
    }

    public function destroy(Genre $genre)
    {
        // Detach from all games before deleting
        $genre->games()->detach();
        $genre->delete();
        return response()->json(null, 204);
    }

    public function destroyAll()
    {
        // Detach all before deleting all
        foreach (Genre::all() as $genre) {
            $genre->games()->detach();
        }
        Genre::query()->delete();
        return response()->json(['message' => 'All categories deleted'], 200);
    }
}

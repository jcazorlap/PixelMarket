<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $stores = [
            \App\Models\Store::firstOrCreate(['name' => 'Steam']),
            \App\Models\Store::firstOrCreate(['name' => 'Epic Games']),
            \App\Models\Store::firstOrCreate(['name' => 'GOG']),
            \App\Models\Store::firstOrCreate(['name' => 'PlayStation Store']),
        ];

        $storeUrls = [
            'Steam' => 'https://store.steampowered.com/',
            'Epic Games' => 'https://store.epicgames.com/',
            'GOG' => 'https://www.gog.com/',
            'PlayStation Store' => 'https://store.playstation.com/',
        ];

        $genreNames = [
            'Disparos en primera persona', 'Disparos en tercera persona', 'Hack and slash', 'Arcade y ritmo',
            'Juegos de plataforma y corredores', 'Matamarcianos', 'Lucha y artes marciales', 'Objetos ocultos',
            'Casuales', 'Metroidvania', 'Puzles', 'Rol de aventuras', 'Novelas visuales', 'Buena trama',
            'Rol y acción', 'Rol, táctica y estrategia', 'Rol japonés', 'Roguelikes y roguelites',
            'Rol por turnos', 'En grupo', 'Simuladores de construcción y automatización',
            'Simuladores de aficiones y trabajos', 'Simuladores de citas', 'Simuladores de agricultura y fabricación',
            'Simuladores de espacio y vuelo', 'Simuladores de vida e inmersivos', 'Simuladores de sandbox y de física',
            'Estrategia por turnos', 'Estrategia en tiempo real', 'Defensa de torres', 'De cartas y tablero',
            'Juegos de ciudades y asentamientos', 'Gran estrategia y 4X', 'Estrategia militar',
            'Simulación y administración deportiva', 'Carreras', 'Simulador de carreras', 'Pesca y caza',
            'Deportes de equipo', 'Deportes individuales', 'Deportes', 'Terror', 'Ciencia ficción y ciberpunk',
            'Espacio', 'Mundo abierto', 'Anime', 'Supervivencia', 'Detectives y misterio'
        ];

        $genres = [];
        foreach ($genreNames as $name) {
            $genres[] = \App\Models\Genre::firstOrCreate(['name' => $name]);
        }

        \App\Models\Game::factory(10)->create()->each(function ($game) use ($stores, $storeUrls, $genres) {
            // Attach 1-4 random genres
            $randomGenres = collect($genres)->random(rand(1, 4));
            $game->genres()->attach($randomGenres->pluck('id'));

            $numStores = rand(1, count($stores));
            $randomStores = collect($stores)->random($numStores);

            foreach ($randomStores as $store) {
                \App\Models\GamePrice::create([
                    'game_id' => $game->id,
                    'store_id' => $store->id,
                    'price' => rand(1000, 7000) / 100,
                    'url_link' => $storeUrls[$store->name] ?? 'https://example.com',
                ]);
            }
        });
    }
}

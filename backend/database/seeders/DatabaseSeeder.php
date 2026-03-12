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

        \App\Models\Game::factory(10)->create()->each(function ($game) use ($stores, $storeUrls) {
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

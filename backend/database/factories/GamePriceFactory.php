<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GamePrice>
 */
class GamePriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'game_id' => \App\Models\Game::factory(),
            'store_id' => \App\Models\Store::factory(),
            'price' => $this->faker->randomFloat(2, 5, 80),
            'url_link' => $this->faker->url(),
        ];
    }
}

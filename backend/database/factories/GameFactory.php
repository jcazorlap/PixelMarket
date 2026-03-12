<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $realGames = [
            [
                'name' => 'Elden Ring',
                'category' => 'RPG',
                'description' => 'Álzate, Sinluz, y que la gracia te guíe para abrazar el poder del Círculo de Elden y encumbrarte como señor de Elden en las Tierras Intermedias.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aajSyY9JguSsc7BqCwh6K7m1.png',
            ],
            [
                'name' => 'Helldivers 2',
                'category' => 'Shooter',
                'description' => 'La última línea de defensa de la galaxia. Alístate en los Helldivers y únete a la lucha por la libertad en una galaxia hostil en este vertiginoso juego de disparos en tercera persona.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/ap/rnd/202309/0718/226d97a9f82662c1615f79b6342dc488e04e9c748c0a876a.png',
            ],
            [
                'name' => 'Hollow Knight',
                'category' => 'Indie',
                'description' => 'Forja tu propio camino en Hollow Knight. Una aventura de acción clásica a través de un vasto reino en ruinas de insectos y héroes.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/8L9O9j1pX064m4mR6V6X4V6X.png',
            ],
            [
                'name' => 'God of War Ragnarök',
                'category' => 'Acción',
                'description' => 'Kratos y Atreus deben viajar a cada uno de los nueve reinos en busca de respuestas mientras las fuerzas asgardianas se preparan para la batalla profetizada que supondrá el fin del mundo.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4E6p9z2I6R7X9X6X8X6X8X6X.png',
            ],
            [
                'name' => 'Cyberpunk 2077',
                'category' => 'RPG',
                'description' => 'Cyberpunk 2077 es un RPG de aventura y acción de mundo abierto ambientado en la megalópolis de Night City, donde te pones en la piel de un mercenario cyberpunk.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/6E9X9X6X8X6X8X6X8X6X8X6X.png',
            ],
            [
                'name' => 'The Legend of Zelda: Tears of the Kingdom',
                'category' => 'Aventura',
                'description' => 'Una aventura épica a través de la tierra y los cielos de Hyrule te espera en la secuela de The Legend of Zelda: Breath of the Wild.',
                'cover_image' => 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1200/f_auto/q_auto/ncom/software/switch/70010000063714/desc/1',
            ],
            [
                'name' => 'Red Dead Redemption 2',
                'category' => 'Acción',
                'description' => 'América, 1899. Arthur Morgan y la banda de van der Linde son forajidos en busca y captura. Con agentes federales y los mejores cazarrecompensas de la nación pisándoles los talones.',
                'cover_image' => 'https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5m9Df6v8S8P8X6X8X6X8X6X8X6X8X.png',
            ],
            [
                'name' => 'Baldur\'s Gate 3',
                'category' => 'RPG',
                'description' => 'Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y el atractivo del poder absoluto.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/ap/rnd/202302/2321/6E9X9X6X8X6X8X6X8X6X8X6X.png',
            ],
            [
                'name' => 'FC 25',
                'category' => 'Deportes',
                'description' => 'EA SPORTS FC 25 te ofrece más formas de ganar por el club. Forma equipo con amistades en tus modos favoritos con el nuevo Rush 5 contra 5.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/ap/rnd/202407/1110/4E6p9z2I6R7X9X6X8X6X8X6X.png',
            ],
            [
                'name' => 'Civilization VI',
                'category' => 'Estrategia',
                'description' => 'Civilization VI ofrece nuevas formas de interactuar con tu mundo, expandir tu imperio por el mapa, fomentar tu cultura y competir contra los líderes más importantes de la historia.',
                'cover_image' => 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/8L9O9j1pX064m4mR6V6X4V6X.png',
            ],
        ];

        $game = $this->faker->randomElement($realGames);

        return [
            'name' => $game['name'],
            'description' => $game['description'],
            'cover_image' => $game['cover_image'],
        ];
    }
}

<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$data = [
    'name' => 'Julián Test',
    'email' => 'julian@example.com',
    'subject' => 'Consulta de Soporte Premium',
    'message' => "Hola,\n\nEsto es una prueba del nuevo diseño de correo. El diseño debe ser oscuro con acentos en cyan y púrpura.\n\nSaludos,\nEl equipo de PixelMarket."
];

echo (new App\Mail\ContactMail($data))->render();

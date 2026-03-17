<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // Enviar a la dirección configurada en el .env
            Mail::to(config('mail.from.address'))->send(new ContactMail($validated));

            return response()->json(['message' => 'Email enviado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al enviar el email: ' . $e->getMessage()], 500);
        }
    }
}

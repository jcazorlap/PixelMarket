<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    // POST /api/register — Registro de nuevo usuario
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // POST /api/login — Inicio de sesión
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        // Revocar tokens anteriores y emitir uno nuevo
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // POST /api/logout — Cierre de sesión (auth:sanctum)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    // GET /api/me — Datos del usuario autenticado (auth:sanctum)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // PUT /api/me — Actualizar datos del usuario (auth:sanctum)
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($data);

        return response()->json($user);
    }

    // PUT /api/me/password — Cambiar contraseña (auth:sanctum)
    public function updatePassword(Request $request)
    {
        // ... (lógica pendiente de implementar)
    }

    // PUT /api/me/dino-score — Actualizar puntuación del Dino (auth:sanctum)
    public function updateDinoScore(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'score' => 'required|integer|min:0',
        ]);

        // Solo actualizar si es una nueva puntuación máxima
        if ($data['score'] > $user->dino_high_score) {
            $user->update(['dino_high_score' => $data['score']]);
        }

        return response()->json($user);
    }

    // GET /api/auth/google — Redirigir a Google OAuth
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // GET /api/auth/google/callback — Manejar respuesta de Google OAuth
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate([
                'email' => $googleUser->getEmail(),
            ], [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                // Los usuarios de Google no necesitan contraseña
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirigir al frontend con el token de autenticación
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/login?token=' . $token . '&google=true');

        } catch (\Exception $e) {
            \Log::error('Google login failed: ' . $e->getMessage());
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=google_failed');
        }
    }
}

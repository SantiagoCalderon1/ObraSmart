<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember' => 'boolean'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => ['Las credenciales proporcionadas no son correctas.'],
            ], 401);
        }
        
        if ($user->role == 'disabled') {
            return response()->json([
                'message' => ['El usuario no está habilitado.'],
            ],401);
        }
        
        

        $token = $user->createToken('auth_token')->plainTextToken;

        $accessToken = $user->tokens()->latest()->first();

        // Si el usuario marcó "Recuérdame", el token dura 3 días
        if ($request->remember) {
            $accessToken->update([
                'expires_at' => Carbon::now()->addDays(3),
            ]);
        }

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'remember' => $request->remember
        ], 200);
    }

    public function isAuthenticated(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'auth' => false,
                'message' => 'Token inválido o expirado.'
            ], 401);
        }

        return response()->json([
            'auth' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ]
        ], 200);
    }


    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }
}

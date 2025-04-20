<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class ExpireTokenMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if ($token) {
            // Buscar el token
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                // Si el token tiene fecha de expiración y ya ha vencido
                if ($accessToken->expires_at && Carbon::now()->greaterThan($accessToken->expires_at)) {
                    $accessToken->delete();
                    return response()->json(['message' => 'Token expirado. Por favor, inicie sesión nuevamente.'], 401);
                }
            }
        }

        return $next($request);
    }
}


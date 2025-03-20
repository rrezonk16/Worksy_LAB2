<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $hasPermission = $user->role->permissions()->where('name', $permission)->exists();

        if (!$hasPermission) {
            return response()->json(['message' => 'Forbidden: You do not have permission to access this resource.'], 403);
        }

        return $next($request);
    }
}

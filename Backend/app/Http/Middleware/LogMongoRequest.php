<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ApiLog;
use Illuminate\Support\Facades\Auth;

class LogMongoRequest
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        ApiLog::create([
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status_code' => $response->getStatusCode(),
            'user_id' => optional(Auth::user())->id,
            'timestamp' => now(),
        ]);

        return $response;
    }
}

<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;
use App\Models\ApiLog;
use Symfony\Component\HttpFoundation\StreamedResponse;
    use MongoDB\BSON\UTCDateTime;

class ApiLogController extends Controller
{
  

    public function downloadLogs(Request $request): StreamedResponse
    {
        $query = ApiLog::query();
    
        if ($request->filled('user_id')) {
            $query->where('user_id', (int) $request->user_id); // cast to int
        }
    
        if ($request->filled('ip')) {
            $query->where('ip', $request->ip);
        }
    
        if ($request->filled('date')) {
            $start = new UTCDateTime(strtotime($request->date . ' 00:00:00') * 1000);
            $end = new UTCDateTime(strtotime($request->date . ' 23:59:59') * 1000);
            $query->whereBetween('timestamp', [$start, $end]);
        }
    
        $logs = $query->get();
    
        $content = '';
        foreach ($logs as $log) {
            $content .= "Timestamp: {$log->timestamp}\n";
            $content .= "Method: {$log->method}\n";
            $content .= "URL: {$log->url}\n";
            $content .= "IP: {$log->ip}\n";
            $content .= "User Agent: {$log->user_agent}\n";
            $content .= "Status Code: {$log->status_code}\n";
            $content .= "User ID: {$log->user_id}\n";
            $content .= "--------------------------\n";
        }
    
        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, 'logs.txt', [
            'Content-Type' => 'text/plain',
        ]);
    }
    
}

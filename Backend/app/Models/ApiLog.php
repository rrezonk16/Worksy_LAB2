<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model as EloquentModel;

class ApiLog extends EloquentModel
{
    protected $connection = 'mongodb';
    protected $collection = 'api_logs';

    protected $fillable = [
        'method',
        'url',
        'ip',
        'user_agent',
        'status_code',
        'user_id',
        'timestamp',
    ];
}

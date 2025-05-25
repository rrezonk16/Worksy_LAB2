<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model as EloquentModel;

class NotificationLog extends EloquentModel
{
    protected $connection = 'mongodb';
    protected $collection = 'notifications';

    protected $fillable = [
        'user_id',
        'message',
        'from_company',
        'job_name',
        'read_at',
    ];
}

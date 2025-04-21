<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $primaryKey = 'project_id';

    protected $fillable = [
        'name',
        'description',
        'client_id',
        'user_id',
        'status',
        'issue_date',
        'due_date',
        'start_date',
        'end_date',
    ];
}

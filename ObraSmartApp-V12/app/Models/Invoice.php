<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $primaryKey = 'invoice_id';

    protected $fillable = [
        'client_id',
        'project_id',
        'budget_id',
        'invoice_number',
        'issue_date',
        'due_date',
        'total',
        'payment_method',
        'status',
    ];
}

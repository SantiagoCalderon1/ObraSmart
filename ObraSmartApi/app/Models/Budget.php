<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;
    protected $primaryKey = 'budget_id';


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'project_id',
        'user_id',
        'budget_number',
        'issue_date',
        'due_date',
        'date',
        'total',
        'status',
    ];

    public function details()
    {
        return $this->hasMany(BudgetDetail::class, 'budget_id', 'budget_id');
    }
}

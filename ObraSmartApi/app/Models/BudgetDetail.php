<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetDetail extends Model
{
    use HasFactory;
    protected $primaryKey = 'budget_concept_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'budget_id',
        'concept',
        'quantity',
        'discount',
        'unit_price',
        'description',
        'tax',
        'subtotal',
    ];
}

<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\Client;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::inRandomOrder()->value('client_id'),
            'project_id' => Project::inRandomOrder()->value('project_id'),
            'budget_id' => Budget::inRandomOrder()->value('budget_id'),
            'invoice_number' => $this->faker->unique()->numerify('INV-#######'), 
            'issue_date' => $this->faker->date(), 
            'due_date' => $this->faker->date(), 
            'total' => $this->faker->randomFloat(2, 100, 10000),
            'payment_method' => $this->faker->randomElement(['efectivo', 'bizum', 'transferencia']), 
            'status' => $this->faker->randomElement(['Pendiente', 'Pagada', 'Rechazada']), 
        ];
    }
}

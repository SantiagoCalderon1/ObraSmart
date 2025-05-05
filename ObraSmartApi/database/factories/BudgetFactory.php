<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetFactory extends Factory
{
    protected $model = Budget::class;

    public function definition(): array
    {
        return [
            'client_id'     => Client::inRandomOrder()->value('client_id'),
            'project_id'    => Project::inRandomOrder()->value('project_id'),
            'user_id'       => User::inRandomOrder()->value('user_id'),
            'budget_number' => 'BGT-' . $this->faker->unique()->numerify('####'),
            'tax' => $this->faker->randomElement([21, 10]),
            'issue_date'    => $this->faker->date(),
            'due_date'      => $this->faker->date(),
            'date'          => $this->faker->date(),
            'total'         => $this->faker->randomFloat(2, 1000, 10000),
            'status'        => $this->faker->randomElement(['Aceptado', 'Pendiente', 'Rechazado']),
            'conditions' => $this->faker->text(50)
        ];
    }
}

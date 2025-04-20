<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        /* return [
            'name' => $this->faker->sentence(3), 
            'description' => $this->faker->text(200), 
            'client_id' => Client::factory(), 
            'user_id' => User::factory(), 
            'status' => $this->faker->randomElement(['en proceso', 'completado', 'cancelado']), 
            'issue_date' => $this->faker->date(), 
            'due_date' => $this->faker->date(), 
            'start_date' => $this->faker->date(), 
            'end_date' => $this->faker->date(), 
        ]; */
        return [
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'client_id' => Client::inRandomOrder()->value('client_id'),
            'user_id' => User::inRandomOrder()->value('user_id'),
            'status' => fake()->randomElement(['en proceso', 'completado', 'cancelado']),
            'issue_date' => now(),
            'due_date' => now()->addDays(15),
            'start_date' => now(),
            'end_date' => now()->addDays(30),
        ];
    }
}

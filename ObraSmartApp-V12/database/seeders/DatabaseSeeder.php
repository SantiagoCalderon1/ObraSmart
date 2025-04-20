<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Añadir más seeders
        $this->call([
            UserSeeder::class,
            ClientSeeder::class,
            ProjectSeeder::class,
            BudgetSeeder::class,
            BudgetDetailSeeder::class,
            InvoiceSeeder::class,
        ]);
        // se ejecuta esto php artisan migrate:fresh --seed

    }
}

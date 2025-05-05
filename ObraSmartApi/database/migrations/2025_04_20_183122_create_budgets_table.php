<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id("budget_id");
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('budget_number')->unique();
            $table->integer('tax')->nullable();
            $table->date('issue_date');
            $table->date('due_date');
            $table->date('date');
            $table->decimal('total', 10, 2);
            $table->enum('status', ['Aceptado', 'Pendiente', 'Rechazado'])->default('Pendiente');
            $table->text('conditions');

            
            $table->timestamps();

            $table->foreign('client_id')->references('client_id')->on('clients')->onDelete('set null');
            $table->foreign('project_id')->references('project_id')->on('projects')->onDelete('set null');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};

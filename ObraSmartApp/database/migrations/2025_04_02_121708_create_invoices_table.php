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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id("invoice_id");
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('budget_id')->nullable();
            $table->string('invoice_number')->unique();
            $table->date('issue_date');
            $table->date('due_date');
            $table->decimal('total', 10, 2);
            $table->enum('payment_method', ['efectivo', 'bizum', 'transferencia']);
            $table->enum('status', ['Pendiente', 'Pagada', 'Rechazada'])->default('Pendiente');
            $table->timestamps();
    
            $table->foreign('client_id')->references('client_id')->on('clients')->onDelete('set null');
            $table->foreign('project_id')->references('project_id')->on('projects')->onDelete('set null');
            $table->foreign('budget_id')->references('budget_id')->on('budgets')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

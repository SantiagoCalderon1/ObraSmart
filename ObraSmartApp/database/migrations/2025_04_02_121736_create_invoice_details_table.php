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
        Schema::create('invoice_details', function (Blueprint $table) {
            $table->id("invoice_details_id");
            $table->unsignedBigInteger('invoice_id');
            $table->string('concept');
            $table->unsignedBigInteger('user_id');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->timestamps();
    
            $table->foreign('invoice_id')->references('invoice_id')->on('invoices')->onDelete('set null');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');

            $table->id("budget_concept_id");
            $table->unsignedBigInteger('budget_id');
            $table->string('concept');
            $table->integer('quantity');
            $table->decimal('discount', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->text('description');
            $table->decimal('tax', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
            $table->foreign('budget_id')->references('budget_id')->on('budgets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_details');
    }
};

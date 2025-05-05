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
        Schema::create('budget_details', function (Blueprint $table) {
            $table->id("budget_concept_id");
            $table->unsignedBigInteger('budget_id')->nullable();
            $table->string('concept');
            $table->integer('quantity')->nullable();
            $table->decimal('discount', 10, 2);
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->text('description');
            $table->decimal('subtotal', 10, 2)->nullable();
            $table->timestamps();
            $table->foreign('budget_id')->references('budget_id')->on('budgets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_details');
    }
};

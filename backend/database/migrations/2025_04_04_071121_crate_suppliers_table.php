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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('supplier_name', 200)->nullable()->index();
            $table->string('supplier_code', 12)->nullable()->unique();
            $table->string('contact_person', 100)->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('address', 200)->nullable();
            $table->string('city', 50)->nullable();
            $table->string('province', 35)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('supplier_category', 150)->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nui'); // Unique number (NUI)
            $table->string('phone_number');
            $table->string('email')->unique(); // Email field
            $table->json('njesia')->nullable(); // Array of branches
            $table->json('activities')->nullable(); // Array of activity IDs
            $table->timestamps();
        });
    }
    

    public function down() {
        Schema::dropIfExists('companies');
    }
};


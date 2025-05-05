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
            $table->string('email')->unique();
            $table->string("number_of_employees")->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('address')->nullable();
            $table->string('logo_url')->nullable();
            $table->json('njesite')->nullable();
            $table->json('activities')->nullable();
            $table->timestamps();
        });
    }
    

    public function down() {
        Schema::dropIfExists('companies');
    }
};


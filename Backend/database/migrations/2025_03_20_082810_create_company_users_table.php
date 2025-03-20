<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('company_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('username');
            $table->string('password');
            $table->foreignId('company_id')->constrained()->onDelete('cascade'); // Ensuring company_id is valid
$table->foreignId('company_role_id')->nullable()->constrained('company_roles')->onDelete('set null');
            $table->string('position');
            $table->timestamps();
        });
    }
    
    public function down() {
        Schema::dropIfExists('company_users');
    }
};

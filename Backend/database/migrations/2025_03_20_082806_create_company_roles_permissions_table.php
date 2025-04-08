<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('company_roles_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('c_role_id')->constrained('company_roles')->onDelete('cascade');
            $table->foreignId('c_permission_id')->constrained('company_permissions')->onDelete('cascade');
            $table->timestamps();
        });
    }
    
    public function down() {
        Schema::dropIfExists('company_roles_permissions');
    }
};

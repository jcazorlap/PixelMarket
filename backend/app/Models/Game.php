<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'cover_image', 'category'];

    public function prices()
    {
        return $this->hasMany(GamePrice::class);
    }
}

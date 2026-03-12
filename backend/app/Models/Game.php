<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'cover_image'];

    public function prices()
    {
        return $this->hasMany(GamePrice::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }
}

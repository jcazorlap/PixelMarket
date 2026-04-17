<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'cover_image', 'is_visible'];

    public function prices()
    {
        return $this->hasMany(GamePrice::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }

    /**
     * Obtener los usuarios que tienen este juego en su lista de deseos.
     */
    public function wishlistedBy()
    {
        return $this->belongsToMany(User::class, 'wishlists')->withTimestamps();
    }
}

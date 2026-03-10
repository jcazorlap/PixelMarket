<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GamePrice extends Model
{
    protected $fillable = ['game_id', 'store_id', 'price', 'url_link'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}

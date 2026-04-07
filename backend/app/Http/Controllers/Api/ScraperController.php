<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ScraperController extends Controller
{
    private $scraperDir;

    public function __construct()
    {
        $this->scraperDir = base_path('../scraper');
    }

    public function getConfig()
    {
        $configPath = $this->scraperDir . '/config.json';
        $urlsPath = $this->scraperDir . '/urls.txt';

        $config = ['model_id' => 'models/gemini-2.5-flash']; // default
        if (File::exists($configPath)) {
            $configData = json_decode(File::get($configPath), true);
            if (isset($configData['model_id'])) {
                $config['model_id'] = $configData['model_id'];
            }
        }

        $urls = '';
        if (File::exists($urlsPath)) {
            $urls = File::get($urlsPath);
        }

        return response()->json([
            'model_id' => $config['model_id'],
            'urls' => $urls
        ]);
    }

    public function updateConfig(Request $request)
    {
        $request->validate([
            'model_id' => 'required|string',
            'urls' => 'nullable|string'
        ]);

        $configPath = $this->scraperDir . '/config.json';
        $urlsPath = $this->scraperDir . '/urls.txt';

        // Save config.json
        $config = ['model_id' => $request->model_id];
        File::put($configPath, json_encode($config, JSON_PRETTY_PRINT));

        // Save urls.txt
        File::put($urlsPath, $request->urls ?? '');

        return response()->json(['message' => 'Scraper configuration updated successfully']);
    }
}

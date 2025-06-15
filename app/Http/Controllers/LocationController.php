<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class LocationController extends Controller
{
    public function getCountries()
    {
        $response = Http::get('https://countriesnow.space/api/v0.1/countries/positions');

        Log::info($response->json());

        return response()->json($response->json());
    }

    public function getStates(Request $request)
    {
        $response = Http::post('https://countriesnow.space/api/v0.1/countries/states', [
            'country' => $request->country,
        ]);

        return response()->json($response->json());
    }

    public function getCities(Request $request)
    {
        $response = Http::post('https://countriesnow.space/api/v0.1/countries/state/cities', [
            'country' => $request->country,
            'state' => $request->state,
        ]);

        return response()->json($response->json());
    }
}

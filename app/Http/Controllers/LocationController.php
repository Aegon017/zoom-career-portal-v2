<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class LocationController extends Controller
{
    public function getCountries()
    {
        $countries = Location::select('country')
            ->distinct()
            ->orderBy('country')
            ->pluck('country');

        return response()->json([
            'success' => true,
            'data' => $countries,
        ]);
    }

    public function getStates(Request $request)
    {
        $request->validate([
            'country' => 'required|string',
        ]);

        $states = Location::where('country', $request->country)
            ->whereNotNull('state')
            ->select('state')
            ->distinct()
            ->orderBy('state')
            ->pluck('state');

        return response()->json([
            'success' => true,
            'data' => $states,
        ]);
    }

    public function getCities(Request $request)
    {
        $request->validate([
            'country' => 'required|string',
            'state' => 'required|string',
        ]);

        $cities = Location::where('country', $request->country)
            ->where('state', $request->state)
            ->whereNotNull('city')
            ->select('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return response()->json([
            'success' => true,
            'data' => $cities,
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->query('search', '');

        $locations = Location::when($search, function ($query, $search) {
            $query->where('city', 'like', '%' . $search . '%')
                ->orWhere('state', 'like', '%' . $search . '%')
                ->orWhere('country', 'like', '%' . $search . '%');
        })
            ->limit(20)
            ->get([
                'id as value',
                DB::raw("CONCAT(city, ', ', state, ', ', country) as label")
            ]);

        return response()->json($locations);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

final class LocationController extends Controller
{
    public function getCountries()
    {
        $countries = Location::select('country')
            ->distinct()
            ->orderBy('country')
            ->pluck('country');

        $countryOptions = $countries->map(fn ($country): array => [
            'label' => $country,
            'value' => $country,
        ]);

        return response()->json([
            'success' => true,
            'data' => $countryOptions,
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

        $stateOptions = $states->map(fn ($state): array => [
            'label' => $state,
            'value' => $state,
        ]);

        return response()->json([
            'success' => true,
            'data' => $stateOptions,
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

        $cityOptions = $cities->map(fn ($city): array => [
            'label' => $city,
            'value' => $city,
        ]);

        return response()->json([
            'success' => true,
            'data' => $cityOptions,
        ]);
    }

    public function search(Request $request)
    {
        $search = $request->query('search', '');

        $locations = Location::when($search, function ($query, string $search): void {
            $query->where('city', 'like', '%'.$search.'%')
                ->orWhere('state', 'like', '%'.$search.'%')
                ->orWhere('country', 'like', '%'.$search.'%');
        })
            ->limit(20)
            ->get([
                'id as value',
                DB::raw("CONCAT(city, ', ', state, ', ', country) as label"),
            ]);

        return response()->json($locations);
    }
}

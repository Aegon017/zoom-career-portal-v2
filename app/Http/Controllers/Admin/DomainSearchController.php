<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Http\Request;

class DomainSearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $search = $request->get('search');

        $domains = Domain::query()
            ->when($search, fn($query) => $query->where('name', 'like', "%{$search}%"))
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json($domains);
    }
}

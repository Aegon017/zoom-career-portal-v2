<?php

namespace App\Http\Controllers;

use App\Models\Opening;
use App\Models\Shortlist;
use Illuminate\Http\Request;

class ShortlistController extends Controller
{
    public function index()
    {
        //
    }

    public function store(Request $request, Opening $job)
    {
        dd($request->all(), $job);
    }

    public function destroy(Shortlist $shortlist)
    {
        //
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Opening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $jobs = Opening::query()
            ->when(
                $request->search,
                fn($q) => $q->where('title', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/jobs/jobs-listing', [
            'jobs' => $jobs,
            'filters' => $request->only('search', 'perPage')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Opening $job)
    {
        return Inertia::render('admin/jobs/view-job', [
            'job' => $job
        ]);
    }

    public function applications(Opening $job, Request $request)
    {
        dd($job, $request);
    }
}

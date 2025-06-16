<?php

namespace App\Http\Controllers;

use App\Enums\OperationsEnum;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = Company::query()->paginate(10);

        return Inertia::render('admin/companies/companies-listing', [
            'companies' => $companies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/companies/create-or-edit-company', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $company = Company::find($id);
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/companies/create-or-edit-company', [
            'company' => $company,
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

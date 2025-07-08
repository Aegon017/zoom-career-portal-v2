<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OperationsEnum;
use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $languages = Language::query()
            ->when(
                $request->search,
                fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('code', 'like', '%' . $request->search . '%')
            )
            ->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('admin/languages/languages-listing', [
            'languages' => $languages,
            'filters' => $request->only('search', 'perPage'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $operation = OperationsEnum::Create;

        return Inertia::render('admin/languages/create-or-edit-language', [
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:languages,name'],
            'code' => ['nullable', 'string', 'max:255']
        ]);

        Language::create($data);

        return to_route('admin.languages.index')->with('success', 'Language record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Language $language)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Language $language): Response
    {
        $operation = OperationsEnum::Edit;

        return Inertia::render('admin/languages/create-or-edit-language', [
            'language' => $language,
            'operation' => $operation->value,
            'operationLabel' => $operation->label()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Language $language): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('languages', 'name')->ignore($language->id)],
            'code' => ['nullable', 'string', 'max:255']
        ]);


        $language->update($data);

        return to_route('admin.languages.index')->with('success', 'Language record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Language $language): RedirectResponse
    {
        $language->delete();

        return to_route('admin.languages.index')->with('success', 'Language record deleted successfully.');
    }

    public function search(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
        ]);

        $query = $request->input('search');

        $languages = Language::when($query, function ($q) use ($query) {
            $q->where('name', 'like', '%' . $query . '%');
        })
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $languages,
        ]);
    }
}

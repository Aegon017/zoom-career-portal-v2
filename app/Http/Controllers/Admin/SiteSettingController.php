<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::get();

        return Inertia::render('admin/site-setting', [
            'settings' => $settings
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'required|boolean',
        ]);

        foreach ($validated['settings'] as $name => $status) {
            SiteSetting::updateOrCreate(
                ['name' => $name],
                ['status' => $status]
            );
        }

        return back()->with('success', 'Feature updated in the site successfully.');
    }
}

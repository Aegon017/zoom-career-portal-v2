<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

final class JobDescriptionStreamController extends Controller
{
    public function stream(Request $request): void
    {
        $title = $request->input('title');
        $skills = implode(', ', $request->input('skills', []));
        $prompt = sprintf('Write a professional job description for a %s requiring skills in: %s.', $title, $skills);

        $response = Prism::text()
            ->using(Provider::OpenAI, 'gpt-4.1')
            ->withPrompt($prompt)
            ->asStream();

        foreach ($response as $chunk) {
            echo $chunk->text;
            ob_flush();
            flush();
        }
    }
}

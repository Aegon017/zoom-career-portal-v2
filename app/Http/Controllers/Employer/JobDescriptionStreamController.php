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
        $prompt = sprintf(
            'Write a professional and detailed job description for a %s position. The job description should include the following sections: 1) Job Overview: A brief description of the role and its importance to the company. 2) Responsibilities: A clear list of key tasks and responsibilities. 3) Required Skills: A list of essential technical and soft skills, including experience with %s. 4) Qualifications: Any necessary education, certifications, or experience requirements. 5) Benefits: A summary of any benefits offered to the candidate. Ensure that the output is structured for a Quill text editor, with appropriate formatting tags like <p>, <ul>, <li>, <strong>, <em>, etc. for paragraphs, lists, and emphasis.',
            $title,
            $skills
        );

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

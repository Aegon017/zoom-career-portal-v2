<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index(): Response
    {
        $messages = [
            [
                'id' => "1",
                'name' => "Madison Hansford",
                'title' => "Talent Acquisition Specialist",
                'company' => "Goosehead Insurance",
                'preview' => "Hi Tasneem, Your background in AAS Fashion Design is impressive. Let’s connect for a quick chat.",
                'date' => "Jun 5",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'initials' => 'GH',
                'isUnread' => true,
            ],
            [
                'id' => "2",
                'name' => "Noah Reynolds",
                'title' => "HR Coordinator",
                'company' => "Greenline Logistics",
                'preview' => "Thanks for applying. We'd like to move forward with the next steps.",
                'date' => "Jun 4",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => false,
            ],
            [
                'id' => "3",
                'name' => "Ava Mitchell",
                'title' => "Recruiting Manager",
                'company' => "KPMG",
                'preview' => "We reviewed your profile and it’s a great fit. Let’s schedule an interview.",
                'date' => "Jun 3",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => true,
            ],
            [
                'id' => "4",
                'name' => "Liam Carter",
                'title' => "Talent Scout",
                'company' => "Spotify",
                'preview' => "Hey Tasneem, I came across your profile. Interested in a quick call?",
                'date' => "Jun 2",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => false,
            ],
            [
                'id' => "5",
                'name' => "Sophia Walker",
                'title' => "Hiring Lead",
                'company' => "Amazon",
                'preview' => "Hi, we’re currently hiring for a role that matches your skills.",
                'date' => "Jun 1",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => true,
            ],
            [
                'id' => "6",
                'name' => "Ethan Brooks",
                'title' => "Recruitment Consultant",
                'company' => "Accenture",
                'preview' => "Can we schedule a call to discuss a project management opportunity?",
                'date' => "May 30",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => false,
            ],
            [
                'id' => "7",
                'name' => "Isabella Moore",
                'title' => "People Operations",
                'company' => "Adobe",
                'preview' => "We saw your profile and think you’d be a great match for our design team.",
                'date' => "May 29",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => false,
            ],
            [
                'id' => "8",
                'name' => "Benjamin Clark",
                'title' => "Tech Recruiter",
                'company' => "Tesla",
                'preview' => "Tesla is growing fast and we think you’d be a strong fit. Let’s chat!",
                'date' => "May 28",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => true,
            ],
            [
                'id' => "9",
                'name' => "Charlotte Lewis",
                'title' => "Recruitment Manager",
                'company' => "Netflix",
                'preview' => "Hope you're well. We’re expanding our team and would love to talk to you.",
                'date' => "May 27",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => false,
            ],
            [
                'id' => "10",
                'name' => "Daniel Young",
                'title' => "Head of Talent",
                'company' => "Shopify",
                'preview' => "Your portfolio is quite impressive. Are you open to opportunities?",
                'date' => "May 26",
                'avatar' => "/placeholder.svg?height=40&width=40",
                'isUnread' => true,
            ],
        ];

        return Inertia::render('employer/inbox/messages-listing', [
            'messages' => $messages
        ]);
    }
}

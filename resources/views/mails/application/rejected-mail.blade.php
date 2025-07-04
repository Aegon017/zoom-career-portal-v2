@extends('mails.layout')
@section('title', 'Application Update')
@section('body')
    <p>Dear <strong>{{ $name }}</strong>,</p>

    <p>
        Thank you for taking the time to apply for the <strong>{{ $job_title }}</strong> position at
        <strong>{{ $company_name }}</strong> through Zoomingcareer.
    </p>

    <p>
        After careful consideration, we regret to inform you that the organization has decided to move forward
        with other candidates at this time.
    </p>

    <p>
        Please don’t be discouraged—new opportunities are posted regularly, and we encourage you to continue
        exploring roles that align with your interests on the Zoomingcareer platform.
    </p>

    <p>
        We wish you the very best in your job search and future career endeavors.
    </p>
@endsection

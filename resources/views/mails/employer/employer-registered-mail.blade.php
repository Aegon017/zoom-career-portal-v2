@extends('mails.layout')
@section('title', 'New Employer Registration')
@section('body')
    <p>Hello <strong>{{ $name }}</strong>,</p>

    <p>
        Thank you for registering with <strong>Zoomingcareer</strong>. We’ve received your employer account
        request and our team is currently reviewing your submission.
    </p>

    <p><strong>Current Verification Status:</strong></p>
    <span class="status-badge status-pending">Pending Review</span>

    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

    <p><strong>Company:</strong> {{ $company_name }}</p>

    <p>
        We’ll notify you via email once your account has been verified and approved. If you have any questions
        in the meantime, feel free to reach out.
    </p>
@endsection
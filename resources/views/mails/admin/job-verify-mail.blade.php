@extends('mails.layout')
@section('title', 'New Job Posting Pending Approval')
@section('body')
    <p>Hello Admin,</p>

    <p>A new job has been posted on <strong>Zoomingcareer</strong> and requires your review and approval.</p>

    <p><strong>Job Title:</strong> {{ $job_title }}</p>
    <p><strong>Company:</strong> {{ $company_name }}</p>
    <p><strong>Posted By:</strong> {{ $posted_by }}</p>

    <a href="{{ $review_link }}" class="btn btn-primary">Review Job Listing</a>
@endsection

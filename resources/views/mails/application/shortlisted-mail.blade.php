<?php

declare(strict_types=1);

?>
@extends('mails.layout')
@section('title', 'Application Update')
@section('body')
    <p>Dear <strong>{{ $name }}</strong>,</p>

    <p>
        Thank you for applying for the <strong>{{ $job_title }}</strong> position at
        <strong>{{ $company_name }}</strong> through Zoomingcareer.
    </p>

    <p>
        We’re pleased to inform you that you have been shortlisted for the next stage of the selection process.
        Your qualifications and experience stood out, and the organization is interested in taking your
        application forward.
    </p>

    <p>
        The next steps and further instructions will be shared with you shortly by the hiring team or a
        Zoomingcareer representative.
    </p>

    <p>
        Wishing you the very best as you move forward in the selection process.
    </p>
@endsection

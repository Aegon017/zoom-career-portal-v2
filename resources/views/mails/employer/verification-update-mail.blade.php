<?php

declare(strict_types=1);

?>
@extends('mails.layout')
@section('title', 'Application Update')
@section('body')
    <p>Hello <strong>{{ $employer_name }}</strong>,</p>

    <p>We would like to inform you that your employer and company verification status has been updated by our
        admin team.</p>

    <p><strong>Current Verification Status:</strong></p>
    <span class="status-badge status-{{ $status }}">{{ $status_text }}</span>

    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
    @if ($status === 'rejected' && !empty($reason))
        <p style="color: #b71c1c; font-weight: 500;">
            <strong>Reason for Rejection:</strong> {{ $reason }}
        </p>
    @endif
    <p><strong>Company:</strong> {{ $company_name }}</p>
    <p><strong>Updated On:</strong> {{ $updated_at }}</p>
@endsection

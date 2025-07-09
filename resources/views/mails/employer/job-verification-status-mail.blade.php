<?php

declare(strict_types=1);

?>
@extends('mails.layout')
@section('title', 'Application Update')
@section('body')
    <p>Hello,</p>

    <p>
        Your job posting titled
        <strong>{{ $job_title ?? 'Untitled Job' }}</strong>
        has been
        <strong
            style="color:
                    {{ $status === 'verified' ? '#2e7d32' : ($status === 'rejected' ? '#d32f2f' : '#f9a825') }};
                ">
            {{ ucfirst($status ?? 'pending') }}
        </strong>
        by our team.
    </p>

    @if ($status === 'verified')
        <p>The job is now visible to candidates on Zoomingcareer. Please review the posting and make any
            necessary updates.</p>
    @elseif ($status === 'rejected')
        <p>Unfortunately, your job posting did not meet our verification criteria and has been rejected.</p>
        @if (!empty($reason))
            <p style="color: #b71c1c; font-weight: 500;">
                <strong>Reason for Rejection:</strong> {{ $reason }}
            </p>
        @endif
        <p>You may update the posting and resubmit, or contact our support team for assistance.</p>
    @else
        <p>Your job posting is currently pending review. You will receive a notification once it has been
            verified.</p>
    @endif
@endsection
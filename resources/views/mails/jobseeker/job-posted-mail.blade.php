<?php

declare(strict_types=1);

?>
@extends('mails.layout')
@section('title', 'New Job Alert!')
@section('body')
    <p>Hello <strong>{{ $user->name }}</strong>,</p>

    <p>A new job has just been posted by <strong>{{ $job->company->name }}</strong>:</p>

    <p><strong>{{ $job->title }}</strong></p>

    <span class="status-badge status-new">New Job</span>

    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

    <p>
        <a href="{{ route('jobseeker.jobs.show', $job->id) }}">Click here to view job details</a>
    </p>
@endsection
<?php 

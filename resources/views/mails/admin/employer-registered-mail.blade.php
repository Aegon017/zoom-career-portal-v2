<?php

declare(strict_types=1);

?>
@extends('mails.layout')
@section('title', 'New Employer Registration')
@section('body')
    <p>Hello Admin,</p>

    <p>A new employer has registered on Zoomingcareer and is awaiting your verification.</p>

    <p><strong>Employer Name:</strong> {{ $name }}</p>
    <p><strong>Company:</strong> {{ $company_name }}</p>

    <a href="{{ $review_link }}" class="btn btn-primary">Review Employer</a>
@endsection
<?php 

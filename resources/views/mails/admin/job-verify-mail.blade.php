<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Job Verification Alert</title>
    <style>
        body {
            background-color: #f5f5f5;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: #212529;
            margin: 0;
            padding: 0;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .email-header {
            text-align: center;
            padding: 30px 20px 10px;
        }

        .email-header img {
            max-height: 50px;
            margin-bottom: 15px;
        }

        .email-header h3 {
            color: #1976d2;
            margin: 0;
            font-size: 24px;
        }

        .email-body {
            padding: 20px 30px;
            background-color: #ffffff;
        }

        .email-body p {
            margin-bottom: 16px;
            font-size: 15px;
            line-height: 1.6;
        }

        .email-footer {
            background-color: #f0f0f0;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            padding: 15px 20px;
        }

        .email-footer a {
            color: #1976d2;
            text-decoration: none;
        }

        .email-footer a:hover {
            text-decoration: underline;
        }

        .btn-review {
            display: inline-block;
            margin-top: 20px;
            background-color: #1976d2;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
        }

        .btn-review:hover {
            background-color: #125ea3;
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            <img src="{{ asset('logo.png') }}" alt="Zoom Careers Logo" />
            <h3>New Job Posting Pending Approval</h3>
        </div>

        <div class="email-body">
            <p>Hello Admin,</p>

            <p>A new job has been posted on <strong>Zoomingcareer</strong> and requires your review and approval.</p>

            <p><strong>Job Title:</strong> {{ $job_title }}</p>
            <p><strong>Company:</strong> {{ $company_name }}</p>
            <p><strong>Posted By:</strong> {{ $posted_by }}</p>

            <a href="{{ $review_link }}" class="btn-review">Review Job Listing</a>
        </div>

        <div class="email-footer">
            &copy; 2025 Zoomingcareer. |
            <a href="mailto:support@zoomingcareer.com">Support</a>
        </div>
    </div>
</body>

</html>

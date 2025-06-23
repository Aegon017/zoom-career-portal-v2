<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Employer Registration</title>
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

        .status-badge {
            display: inline-block;
            font-size: 14px;
            padding: 6px 14px;
            font-weight: 600;
            border-radius: 20px;
        }

        .status-pending {
            background-color: #fff9c4;
            color: #7f6d00;
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
    </style>
</head>

<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            <img src="{{ asset('logo.png') }}" alt="Zoom Careers Logo" />
            <h3>Welcome to Zoomingcareer!</h3>
        </div>

        <!-- Body -->
        <div class="email-body">
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
        </div>

        <!-- Footer -->
        <div class="email-footer">
            &copy; 2025 Zoomingcareer. |
            <a href="mailto:support@zoomingcareer.com">Support</a>
        </div>
    </div>
</body>

</html>

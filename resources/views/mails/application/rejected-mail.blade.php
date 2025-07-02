<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Update</title>
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
    </style>
</head>

<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
            <img src="{{ asset('logo.png') }}" alt="Zoom Careers Logo" />
            <h3>Application Update</h3>
        </div>

        <!-- Body -->
        <div class="email-body">
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

            <p>Warm regards,<br />The Zoomingcareer Team</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            &copy; 2025 Zoomingcareer.
        </div>
    </div>
</body>

</html>

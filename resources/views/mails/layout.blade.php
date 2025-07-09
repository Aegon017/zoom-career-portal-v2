<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
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

        .status-new {
            background-color: #cce5ff;
            color: #004085;
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="email-wrapper">
        <div class="email-header">
            <img src="{{ asset('logo.png') }}" alt="Zoomingcareer Logo" />
            <h3>@yield('title')</h3>
        </div>

        <div class="email-body">
            @yield('body')
            <div class="mt-3">
                <p>If you need any assistance, feel free to contact us at
                    <a href="mailto:support@zoomingcareer.com">support@zoomingcareer.com</a>.
                </p>
                <p>Thank you,<br />
                    <strong>Zooming Career Team</strong>
                </p>
            </div>
        </div>
        <div class="email-footer">
            &copy; 2025 Zoomingcareer.
        </div>
    </div>
</body>

</html>

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

        .status-badge {
            display: inline-block;
            font-size: 14px;
            padding: 6px 14px;
            font-weight: 600;
            border-radius: 20px;
        }

        .status-verified {
            background-color: #c8e6c9;
            color: #256029;
        }

        .status-pending {
            background-color: #fff9c4;
            color: #7f6d00;
        }

        .status-rejected {
            background-color: #ffcdd2;
            color: #b71c1c;
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

            <p>Warm regards,<br />The Zoomingcareer Team</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            &copy; 2025 Zoomingcareer. |
            <a href="mailto:support@zoomingcareer.com">Support</a>
        </div>
    </div>
</body>

</html>

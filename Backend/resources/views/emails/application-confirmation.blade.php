<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Application Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f0fdf4;
            margin: 0;
            padding: 0;
            color: #1f2937;
        }

        .container {
            max-width: 640px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            padding: 30px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            max-width: 180px;
        }

        h2 {
            color: #047857;
        }

        p {
            line-height: 1.6;
        }

        .footer {
            margin-top: 40px;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }

        strong {
            color: #065f46;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
        <img src="https://i.imgur.com/zyEqw5L.png" alt="Worksy Logo" class="logo">
        </div>

        <h2>Hello {{ $user->name ?? $user->username }},</h2>

        <p>We’re excited to let you know that you’ve successfully applied for the position of <strong>{{ $job->title }}</strong>.</p>

        <p>Your application is now in the hands of the hiring team. If your profile matches the job requirements, someone will be in touch with next steps.</p>

        <p>Thank you for using <strong>Worksy</strong> — where talent meets opportunity.</p>

        <p>Best regards,<br>The Worksy Team</p>

        <div class="footer">
            © {{ date('Y') }} Worksy. All rights reserved.
        </div>
    </div>
</body>
</html>

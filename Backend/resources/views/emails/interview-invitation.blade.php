<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Interview Invitation - Worksy</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #ecfdf5;
            margin: 0;
            padding: 0;
            color: #1f2937;
            font-size: 16px;
            line-height: 1.5;
        }

        .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .header {
            background-color: #d1fae5;
            padding: 20px;
            text-align: center;
        }

        .logo {
            max-width: 180px;
        }

        .content {
            padding: 30px;
        }

        h2 {
            color: #047857;
            margin-top: 0;
            font-size: 28px;
        }

        .section {
            margin-bottom: 30px;
        }

        p {
            margin: 14px 0;
        }

        /* Emphasized date style */
        .date-important {
            font-size: 24px;
            font-weight: 700;
            color: #047857;
            text-align: center;
            background-color: #d1fae5;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 20px 0;
            letter-spacing: 0.05em;
            box-shadow: 0 2px 6px rgba(4, 120, 87, 0.3);
        }

        a {
            color: #047857;
            text-decoration: none;
        }

        .footer {
            background-color: #ecfdf5;
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #6b7280;
        }

        .social-icons img {
            width: 24px;
            margin: 0 8px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://i.imgur.com/zyEqw5L.png" alt="Worksy Logo" class="logo" />
        </div>

        <div class="content">
            <div class="section">
                <h2>📅 Interview Invitation from {{ $company->name ?? 'Our Company' }}</h2>
                <p>Hello,</p>

                <p>
                    <strong>{{ $company->name ?? 'Our Company' }}</strong> has invited you for an interview for the position of: 
                    <br />
                    <em>"{{ $job->title ?? 'Job Title' }}"</em>
                </p>

                <p><strong>Scheduled for:</strong> {{ \Carbon\Carbon::parse($meeting->scheduled_at)->format('d-m-Y H:i') }}</p>

                <p>Please log in to your account at the scheduled time to join the interview session.</p>

                <p>We've attached a calendar file so you can save the event easily.</p>
            </div>
        </div>

        <div class="footer">
            <p>Follow us for updates & tips:</p>
            <div class="social-icons">
                <a href="https://facebook.com/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
                <a href="https://twitter.com/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" /></a>
                <a href="https://instagram.com/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" /></a>
                <a href="https://linkedin.com/company/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" /></a>
            </div>
            <p>© {{ date('Y') }} Worksy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
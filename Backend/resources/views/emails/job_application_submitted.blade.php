<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Job Application - Worksy</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #ecfdf5;
            margin: 0;
            padding: 0;
            color: #1f2937;
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
        }

        .section {
            margin-bottom: 30px;
        }

        .application-details p {
            margin: 10px 0;
        }

        ul {
            padding-left: 20px;
        }

        li {
            margin-bottom: 8px;
        }

        .marketing {
            background-color: #f0fdf4;
            padding: 20px;
            border-left: 4px solid #34d399;
            border-radius: 6px;
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

        a {
            color: #047857;
            text-decoration: none;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://i.imgur.com/zyEqw5L.png" alt="Worksy Logo" class="logo">
        </div>

        <div class="content">
            <div class="section">
                <h2>🚀 New Job Application Received</h2>
                <div class="application-details">
                    <p><strong>Job:</strong> {{ $job->title }}</p>
                    <p><strong>Applicant:</strong> {{ $user->name }} ({{ $user->email }})</p>
                </div>
            </div>

            <div class="section">
                <h3>📝 Applicant Answers:</h3>
                <ul>
                    @foreach ($answers as $answer)
                        <li><strong>{{ $answer['question'] }}:</strong> {{ $answer['answer'] }}</li>
                    @endforeach
                </ul>
            </div>

            <div class="section marketing">
                <h3>✨ About Worksy</h3>
                <p><strong>Worksy</strong> is your all-in-one platform to post jobs, discover top freelancers, and manage applications with ease. Whether you're hiring for a one-time gig or building your dream team, Worksy makes it simple, fast, and effective.</p>
                <p>Join thousands of companies who trust Worksy to connect with skilled professionals from around the world.</p>
            </div>
        </div>

        <div class="footer">
            <p>Follow us for updates & tips:</p>
            <div class="social-icons">
                <a href="https://facebook.com/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"></a>
                <a href="https://twitter.com/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter"></a>
                <a href="https://instagram.com/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram"></a>
                <a href="https://linkedin.com/company/worksy"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn"></a>
            </div>
            <p>© {{ date('Y') }} Worksy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

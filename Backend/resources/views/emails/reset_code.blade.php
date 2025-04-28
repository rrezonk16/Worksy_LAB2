<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Reset - Worksy</title>
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

        .code-box {
            display: inline-block;
            background-color: #f0fdf4;
            border: 1px solid #34d399;
            padding: 12px 24px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 8px;
            color: #065f46;
            margin: 10px 0;
        }

        .copy-btn {
            display: inline-block;
            margin-left: 10px;
            padding: 8px 14px;
            background-color: #34d399;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
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
            <h2>🔐 Reset Your Password</h2>
            <p>We received a request to reset your password. Use the code below to complete the process:</p>

            <div>
                <span class="code-box" id="resetCode">{{ $code }}</span>
                <a href="#" class="copy-btn" onclick="copyCode(event)">Copy</a>
            </div>

            <p>If you didn’t request this, you can safely ignore this email.</p>
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

    <!-- JavaScript copy support (will be ignored in most email clients, but nice for web preview/testing) -->
    <script>
        function copyCode(e) {
            e.preventDefault();
            const codeText = document.getElementById('resetCode').textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                alert('Code copied to clipboard!');
            });
        }
    </script>
</body>
</html>

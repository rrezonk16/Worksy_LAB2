<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Premium Subscription</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      color-scheme: light dark;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0fdf4;
      color: #1f2937;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
        color: #e5e7eb;
      }

      .container {
        background-color: #111827 !important;
        box-shadow: 0 0 0 transparent !important;
      }

      h2, strong {
        color: #10b981 !important;
      }

      .footer {
        color: #9ca3af !important;
      }
    }

    .container {
      max-width: 720px;
      margin: 60px auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.07);
      padding: 40px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      max-width: 200px;
    }

    h2 {
      font-size: 28px;
      margin-bottom: 20px;
      color: #047857;
    }

    p {
      font-size: 16px;
      line-height: 1.7;
      margin: 14px 0;
    }

    .highlight-box {
      background-color: #ecfdf5;
      padding: 20px;
      border-left: 5px solid #10b981;
      border-radius: 8px;
      margin: 20px 0;
    }

    .button {
      display: inline-block;
      background-color: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 24px;
    }

    .footer {
      margin-top: 60px;
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

    <h2>Welcome to the Premium Subscription, {{ $companyName }}!</h2>

    <p>We are thrilled to have you on the <strong>{{ $subscriptionType }}</strong> plan starting from <strong>{{ $startDate }}</strong>.</p>

    <div class="highlight-box">
      <p>🎉 Thank you for subscribing! We are excited to support your company’s growth.</p>
    </div>

    <p>As part of the premium plan, you'll enjoy all the benefits and exclusive features Worksy has to offer. We can’t wait to see how you’ll make the most of it!</p>

    <p>If you have any questions or need support, don’t hesitate to reach out.</p>

    <p>— The Worksy Team</p>

    <div class="footer">
      © {{ date('Y') }} Worksy. All rights reserved.
    </div>
  </div>
</body>
</html>

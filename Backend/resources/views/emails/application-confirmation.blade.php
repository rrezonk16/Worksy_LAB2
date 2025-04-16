<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Application Confirmation</title>
</head>
<body>
    <h2>Hello {{ $user->name ?? $user->username }},</h2>

    <p>You have successfully applied to the job: <strong>{{ $job->title }}</strong>.</p>

    <p>Thank you for applying. We will be in touch if you're shortlisted.</p>

    <p>Best regards,<br>Your Job Portal Team</p>
</body>
</html>

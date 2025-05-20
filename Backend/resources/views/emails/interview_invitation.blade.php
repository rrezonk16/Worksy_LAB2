<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Interview Invitation</title>
</head>
<body>
    <h2>Hello {{ $application->user->name }},</h2>

    <p>You've been invited for an interview for the job: <strong>{{ $application->job->title }}</strong>.</p>

    @php
        $interview = $application->interview;
    @endphp

    <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($interview->date)->format('F j, Y') }}</p>
    <p><strong>Time:</strong> {{ $interview->start_hour }} - {{ $interview->finish_hour }}</p>

    <p>Please be available at the scheduled time. If you have any questions, feel free to reach out.</p>

    <p>Best regards,<br>{{ $application->job->company->name }}</p>
</body>
</html>

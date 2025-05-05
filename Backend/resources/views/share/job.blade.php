<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $job->title }}</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:title" content="{{ $job->title }}" />
    <meta property="og:description" content="{{ $job->description }}" />
    <meta property="og:image" content="{{ asset('https://6ced-84-22-48-194.ngrok-free.app/storage/logos/n6BStlPsLUNhfAqEPmE9a6FnZCGd6M4gpF8ROjqW.png') }}" />

    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="315" />
    <meta property="og:site_name" content="{{ config('app.name') }}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:country-name" content="{{ $job->company->country }}" />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{ $job->title }}" />
    <meta name="twitter:description" content="{{ $job->description }}" />
    <meta name="twitter:image" content="{{ asset('https://88c5-84-22-48-194.ngrok-free.app/storage/logos/n6BStlPsLUNhfAqEPmE9a6FnZCGd6M4gpF8ROjqW.png' ) }}" />
    <meta name="twitter:site" content="@{{ config('app.twitter_handle') }}" />
    <meta name="twitter:creator" content="@{{ $job->company->twitter_handle }}" />

</head>
<body>

    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">

                <div class="card mb-4">
                    <div class="card-body">
                        <h1 class="card-title">{{ $job->title }}</h1>
                        <p class="card-text">{{ $job->description }}</p>
                        <ul class="list-group list-group-flush mt-3">
                            <li class="list-group-item"><strong>Company:</strong> {{ $job->company->name }}</li>
                            <li class="list-group-item"><strong>Location:</strong> {{ $job->location }}</li>
                            <li class="list-group-item"><strong>Salary:</strong> {{ $job->salary }}</li>
                            <li class="list-group-item"><strong>Posted:</strong> {{ $job->created_at->format('F j, Y') }}</li>
                        </ul>
                        <a href="#" class="btn btn-primary mt-3">Apply Now</a>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Redirect to frontend -->
<script>
    setTimeout(() => {
        window.location.href = "http://localhost:5173/job-listings/{{ $job->id }}";
    }, 1500);
</script>

</body>
</html>

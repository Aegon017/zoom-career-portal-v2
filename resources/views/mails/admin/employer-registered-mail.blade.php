@section('title')
    New Employer Registration
@endsection
@section('body')
    <p>Hello Admin,</p>

    <p>A new employer has registered on Zoomingcareer and is awaiting your verification.</p>

    <p><strong>Employer Name:</strong> {{ $name }}</p>
    <p><strong>Company:</strong> {{ $company_name }}</p>

    <a href="{{ $review_link }}" class="btn-review">Review Employer</a>
@endsection

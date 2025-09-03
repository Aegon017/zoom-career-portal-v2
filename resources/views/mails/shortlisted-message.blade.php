<x-mail::message>
{!! $message !!}
@if (!empty($salutation))
{{ $salutation }}
@else
<p>Thank you,<br>
<strong>{{ config('app.name') }} Team</strong>
</p>
@if (!empty(config('app.support_email')))
<p>If you need any assistance, feel free to contact us at
<a href="mailto:{{ config('app.support_email') }}">
{{ config('app.support_email') }}
</a>.
</p>
@endif
@endif
<p>© {{ date('Y') }} {{ config('app.name') }}. @lang('All rights reserved.')</p>
</x-mail::message>

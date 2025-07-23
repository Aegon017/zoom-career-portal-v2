@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if ($slot->isNotEmpty() && trim((string) $slot) === 'Laravel')
                <img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
            @else
                {{ $slot }}
            @endif
        </a>
    </td>
</tr>

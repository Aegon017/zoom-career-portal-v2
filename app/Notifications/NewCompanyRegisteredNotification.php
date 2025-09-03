<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class NewCompanyRegisteredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Company $company) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Company Registered on Zooming Career portal')
            ->greeting('Hello Everyone,')
            ->line('A company, "'.$this->company->name.'", has recently registered on our portal.')
            ->line('We encourage you to visit the portal to learn more about the company and follow their profile to receive alerts about any upcoming job postings.')
            ->action('View Company', route('jobseeker.employers.show', $this->company->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'A new company has been registered: '.$this->company->name,
            'url' => route('jobseeker.employers.show', $this->company->id),
        ];
    }
}

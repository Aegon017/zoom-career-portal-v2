<?php

namespace App\Notifications;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCompanyRegisteredNotification extends Notification implements ShouldQueue
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
            ->subject('New Company Registered: ' . $this->company->name)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new company has just been registered on the portal:')
            ->line('**' . $this->company->name . '**')
            ->action('View Company', route('jobseeker.employers.show', $this->company->id))
            ->line('Log in to explore job openings.')
            ->line('Thank you for staying connected!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'A new company has been registered: ' . $this->company->name,
            'url' => route('jobseeker.employers.show', $this->company->id),
        ];
    }
}

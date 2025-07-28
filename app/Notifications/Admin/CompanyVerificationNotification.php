<?php

namespace App\Notifications\Admin;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CompanyVerificationNotification extends Notification implements ShouldQueue
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
            ->subject('Company Verification Required')
            ->greeting('Hello Admin,')
            ->line("The company {$this->company->name} has updated its details and is pending verification.")
            ->action('Review Company', route('admin.companies.show', $this->company->id))
            ->line('Please review and verify the updated company information.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Company updated and needs verification: ' . $this->company->name,
            'url' => route('admin.companies.show', $this->company->id),
        ];
    }
}

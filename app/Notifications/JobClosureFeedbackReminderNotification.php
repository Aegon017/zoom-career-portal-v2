<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Opening;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class JobClosureFeedbackReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Opening $job) {}

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
            ->subject('Reminder: Please provide feedback on your job posting')
            ->greeting('Hello '.$notifiable->name)
            ->line(sprintf('Your job posting "%s" expired a week ago.', $this->job->title))
            ->line('Please confirm if the position has been filled or needs further action.')
            ->action('Give Feedback', url(sprintf('/employer/jobs/%s/feedback', $this->job->id)))
            ->line('Thank you for using Zoom Career Portal.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => sprintf('Your job "%s" expired a week ago. Please give feedback.', $this->job->title),
            'url' => sprintf('/employer/jobs/%s/feedback', $this->job->id),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Notifications\Admin;

use App\Models\Feedback;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class FeedbackSubmittedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Feedback $feedback) {}

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
            ->subject('New Feedback Submitted')
            ->greeting('Hello Admin,')
            ->line('A new feedback has been submitted by '.$this->feedback->user->name.' for job: '.$this->feedback->opening->title)
            ->action('View Feedback', url('/admin/feedback/'.$this->feedback->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'New feedback submitted by '.$this->feedback->user->name.' for job: '.$this->feedback->opening->title,
            'url' => url('/admin/feedback/'.$this->feedback->id),
        ];
    }
}

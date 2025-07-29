<?php

namespace App\Notifications;

use App\Models\Opening;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobClosureFeedbackReminderNotification extends Notification implements ShouldQueue
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
            ->greeting('Hello ' . $notifiable->name)
            ->line("Your job posting \"{$this->job->title}\" expired a week ago.")
            ->line('Please confirm if the position has been filled or needs further action.')
            ->action('Give Feedback', url("/employer/jobs/{$this->job->id}/feedback"))
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
            'message' => "Your job \"{$this->job->title}\" expired a week ago. Please give feedback.",
            'url' => "/employer/jobs/{$this->job->id}/feedback",
        ];
    }
}

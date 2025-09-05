<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Comment $comment)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $post = $this->comment->post;
        return (new MailMessage)
            ->subject('New comment on: ' . $post->title)
            ->greeting('Hello!')
            ->line('A new comment was added to a post you subscribed to:')
            ->line('Post: ' . $post->title)
            ->line('Comment: "' . str($this->comment->content)->limit(140) . '"')
            ->action('View Post', url('/posts/' . $post->id))
            ->line('Thank you for subscribing!');
    }
}



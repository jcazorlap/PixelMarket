<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactData;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->contactData = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nuevo mensaje de contacto: ' . ($this->contactData['subject'] ?? 'Sin asunto'),
            from: $this->contactData['email'] ?? config('mail.from.address'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-form',
            with: [
                'name' => $this->contactData['name'],
                'email' => $this->contactData['email'],
                'subject' => $this->contactData['subject'],
                'body' => $this->contactData['message'],
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

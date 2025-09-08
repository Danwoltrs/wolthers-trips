interface TripNotification {
  type: 'invited'
  tripId: string
  inviteEmail: string
}

// Sends trip-related notifications using Resend API
export async function sendTripNotification({ type, tripId, inviteEmail }: TripNotification) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY environment variable')
    return
  }

  // Basic template handling; can be expanded with real HTML templates
  const html = type === 'invited'
    ? `<p>You have been invited to join trip ${tripId}.</p>`
    : `<p>Notification for trip ${tripId}</p>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@wolthers.com',
        to: inviteEmail,
        subject: 'Wolthers trip invitation',
        html
      })
    })
  } catch (err) {
    console.error('Failed to send trip notification', err)
  }
}


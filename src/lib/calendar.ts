// Placeholder calendar integration utilities

export interface FlightEventInput {
  tripId: string
  landingAt: string
  airline?: string | null
  flightNo?: string | null
}

// Stub that would integrate with a real calendar API
export async function createFlightArrivalEvent(input: FlightEventInput) {
  // In real implementation this would call Google Calendar or similar
  // For now we just resolve immediately
  return { success: true, input }
}

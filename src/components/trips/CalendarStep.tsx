'use client'

import { useEffect, useState } from 'react'
import { getTripLogistics, upsertTripLogistics, TripLogistics } from '../../lib/logistics'
import { createFlightArrivalEvent } from '../../lib/calendar'

interface Props {
  tripId: string
}

export default function CalendarStep({ tripId }: Props) {
  const [logistics, setLogistics] = useState<TripLogistics | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getTripLogistics(tripId).then(({ data }) => setLogistics(data))
  }, [tripId])

  async function handleSave(fields: { flightNo: string; landingAt: string; airline: string }) {
    const { data } = await upsertTripLogistics({
      trip_id: tripId,
      flight_no: fields.flightNo || null,
      landing_at: fields.landingAt ? new Date(fields.landingAt).toISOString() : null,
      airline: fields.airline || null,
    })
    setLogistics(data)
    if (fields.landingAt) {
      await createFlightArrivalEvent({
        tripId,
        landingAt: fields.landingAt,
        airline: fields.airline,
        flightNo: fields.flightNo,
      })
    }
    setShowForm(false)
  }

  if (!logistics?.landing_at) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          className="px-3 py-1 border rounded"
          onClick={() => setShowForm(true)}
        >
          Add flight details
        </button>
        {showForm && (
          <FlightForm
            initial={{ flight_no: '', landing_at: '', airline: '' }}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="border rounded p-3">
        <div className="font-medium mb-1">Flight arrival</div>
        <div>{logistics.airline} {logistics.flight_no}</div>
        <div>{new Date(logistics.landing_at).toLocaleString()}</div>
        <button
          type="button"
          className="mt-2 text-sm text-blue-600 underline"
          onClick={() => setShowForm(true)}
        >
          Edit details
        </button>
      </div>
      {showForm && (
        <FlightForm
          initial={logistics}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function FlightForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<TripLogistics>
  onSave: (f: { flightNo: string; landingAt: string; airline: string }) => void
  onCancel: () => void
}) {
  const [flightNo, setFlightNo] = useState(initial.flight_no || '')
  const [landingAt, setLandingAt] = useState(
    initial.landing_at ? initial.landing_at.slice(0, 16) : ''
  )
  const [airline, setAirline] = useState(initial.airline || '')

  return (
    <div className="space-y-2 border p-3 rounded">
      <input
        className="border rounded px-2 py-1 w-full"
        placeholder="Flight number"
        value={flightNo}
        onChange={e => setFlightNo(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border rounded px-2 py-1 w-full"
        value={landingAt}
        onChange={e => setLandingAt(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1 w-full"
        placeholder="Airline"
        value={airline}
        onChange={e => setAirline(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-1 border rounded"
          onClick={() => onSave({ flightNo, landingAt, airline })}
        >
          Save
        </button>
        <button
          type="button"
          className="px-3 py-1 border rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

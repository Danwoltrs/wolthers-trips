'use client'

import { useState } from 'react'
import { upsertTripLogistics } from '../../lib/logistics'
import { createFlightArrivalEvent } from '../../lib/calendar'

interface Props {
  tripId: string
}

export default function LogisticsStep({ tripId }: Props) {
  const [open, setOpen] = useState(false)
  const [flightNo, setFlightNo] = useState('')
  const [landingAt, setLandingAt] = useState('')
  const [airline, setAirline] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await upsertTripLogistics({
      trip_id: tripId,
      flight_no: flightNo || null,
      landing_at: landingAt ? new Date(landingAt).toISOString() : null,
      airline: airline || null,
    })
    if (landingAt) {
      await createFlightArrivalEvent({ tripId, landingAt, airline, flightNo })
    }
    setSaving(false)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="border rounded px-3 py-2"
        onClick={() => setOpen(o => !o)}
      >
        GRU Airport Pickup
      </button>
      {open && (
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
          <button
            type="button"
            className="px-3 py-1 border rounded"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
}

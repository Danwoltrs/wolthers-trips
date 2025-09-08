import { TripEvent } from '../types'

const DRIVE_CACHE_TTL_MS = 5 * 60 * 1000
const driveCache = new Map<string, { duration: number; expires: number }>()

async function fetchDriveDuration(origin: string, destination: string): Promise<number> {
  const key = `${origin}|${destination}`
  const now = Date.now()
  const cached = driveCache.get(key)
  if (cached && cached.expires > now) {
    return cached.duration
  }
  try {
    const params = new URLSearchParams({
      origins: origin,
      destinations: destination,
      mode: 'driving',
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    })
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`
    const res = await fetch(url)
    const data = await res.json()
    const seconds = data?.rows?.[0]?.elements?.[0]?.duration?.value
    if (typeof seconds === 'number') {
      driveCache.set(key, { duration: seconds, expires: now + DRIVE_CACHE_TTL_MS })
      return seconds
    }
  } catch (err) {
    console.error('Failed to fetch drive duration', err)
  }
  const fallback = 60 * 60
  driveCache.set(key, { duration: fallback, expires: now + DRIVE_CACHE_TTL_MS })
  return fallback
}

export async function insertDriveBlocks(
  events: TripEvent[],
  autoSnap = false,
): Promise<TripEvent[]> {
  if (events.length < 2) return events
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  )
  const result: TripEvent[] = [sorted[0]]
  for (let i = 1; i < sorted.length; i++) {
    const prev = result[result.length - 1]
    const current = sorted[i]
    const durationSec = await fetchDriveDuration(prev.location, current.location)
    const driveStart = prev.end
    const driveEndDate = new Date(new Date(driveStart).getTime() + durationSec * 1000)
    const driveEvent: TripEvent = {
      id: `drive-${prev.id}-${current.id}`,
      type: 'drive',
      location: `${prev.location} -> ${current.location}`,
      start: driveStart,
      end: driveEndDate.toISOString(),
      meetingCode: current.meetingCode,
      branchId: current.branchId,
      visibleToCompanies: Array.from(
        new Set([...prev.visibleToCompanies, ...current.visibleToCompanies]),
      ),
    }
    result.push(driveEvent)
    if (autoSnap) {
      const shiftMs =
        driveEndDate.getTime() - new Date(current.start).getTime()
      if (shiftMs > 0) {
        const newStart = driveEndDate
        const newEnd = new Date(new Date(current.end).getTime() + shiftMs)
        current.start = newStart.toISOString()
        current.end = newEnd.toISOString()
      }
    }
    result.push(current)
  }
  return result
}

export async function appendFinalDrive(
  events: TripEvent[],
  finalDestination: string,
): Promise<TripEvent[]> {
  if (events.length === 0) return events
  const last = events[events.length - 1]
  const durationSec = await fetchDriveDuration(last.location, finalDestination)
  const driveEvent: TripEvent = {
    id: `drive-${last.id}-final`,
    type: 'drive',
    location: `${last.location} -> ${finalDestination}`,
    start: last.end,
    end: new Date(new Date(last.end).getTime() + durationSec * 1000).toISOString(),
    meetingCode: last.meetingCode,
    branchId: last.branchId,
    visibleToCompanies: [...last.visibleToCompanies],
  }
  return [...events, driveEvent]
}

export class TripBranchManager {
  private branches: Record<string, string>
  private counter = 0

  constructor(initial?: Record<string, string>) {
    this.branches = initial || {}
  }

  getBranch(companyId: string): string {
    return this.branches[companyId] || 'root'
  }

  setBranch(companyId: string, branchId: string) {
    this.branches[companyId] = branchId
  }

  createBranchFor(companyIds: string[]): string {
    const id = `branch-${++this.counter}`
    for (const cid of companyIds) {
      this.branches[cid] = id
    }
    return id
  }
}

export function splitTrip(
  events: TripEvent[],
  manager: TripBranchManager,
  departingCompanyId: string,
  splitIndex: number,
): TripEvent[] {
  const remainingCompanies = events[splitIndex].visibleToCompanies.filter(
    c => c !== departingCompanyId,
  )
  const newBranchId = manager.createBranchFor(remainingCompanies)
  const result: TripEvent[] = events.slice(0, splitIndex + 1)
  for (let i = splitIndex + 1; i < events.length; i++) {
    const e = events[i]
    const copy: TripEvent = {
      ...e,
      id: `${e.id}-${newBranchId}`,
      branchId: newBranchId,
      visibleToCompanies: e.visibleToCompanies.filter(c =>
        remainingCompanies.includes(c),
      ),
    }
    result.push(copy)
  }
  return result
}

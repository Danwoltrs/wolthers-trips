'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { COMPANY_TOKENS } from '../../../config/companyTokens'
import { supabase } from '../../lib/supabase'

interface DateRange {
  start: Date | null
  end: Date | null
}

function normalizeToken(str: string): string {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
}

function getMonthAbbrev(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

function generateCode(title: string, start: Date | null): string {
  const tokens = title.split(/\s+/)
  const normTokens = tokens.map(normalizeToken)
  const token = COMPANY_TOKENS.map(normalizeToken).find(t =>
    normTokens.includes(t)
  ) || (normTokens[0] || '')
  const suffix = start ? `${getMonthAbbrev(start)}${start
    .getFullYear()
    .toString()
    .slice(-2)}` : ''
  return token ? `${token}${suffix ? `-${suffix}` : ''}` : suffix
}

async function isCodeInUse(code: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('trips' as any)
      .select('id')
      .eq('code', code)
      .maybeSingle()
    return !!data
  } catch (e) {
    return false
  }
}

export default function BasicInfoStep() {
  const [title, setTitle] = useState('')
  const [range, setRange] = useState<DateRange>({ start: null, end: null })
  const [code, setCode] = useState('')
  const [touched, setTouched] = useState(false)
  const [codeError, setCodeError] = useState('')

  useEffect(() => {
    if (!touched) {
      const newCode = generateCode(title, range.start)
      setCode(newCode)
    }
  }, [title, range.start, touched])

  useEffect(() => {
    let active = true
    if (code) {
      isCodeInUse(code).then(inUse => {
        if (active) {
          setCodeError(inUse ? 'Code already in use' : '')
        }
      })
    } else {
      setCodeError('')
    }
    return () => {
      active = false
    }
  }, [code])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Trip Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Enter trip title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Trip Dates</label>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Trip Code</label>
        <div className="relative">
          <input
            value={code}
            onChange={e => {
              setTouched(true)
              setCode(e.target.value.toUpperCase())
            }}
            className={`border rounded px-3 py-2 w-full ${codeError ? 'border-red-500' : ''}`}
            placeholder="Enter trip code"
          />
        </div>
        {codeError && (
          <p className="text-red-600 text-sm mt-1">{codeError}</p>
        )}
      </div>
    </div>
  )
}

function DateRangePicker({
  value,
  onChange
}: {
  value: DateRange
  onChange: (value: DateRange) => void
}) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(new Date())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()

  const start = value.start
  const end = value.end

  function selectDay(day: number) {
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    if (!start || (start && end)) {
      onChange({ start: date, end: null })
    } else if (date < start) {
      onChange({ start: date, end: start })
    } else {
      onChange({ start, end: date })
      setOpen(false)
    }
  }

  function isInRange(day: number) {
    if (start && end) {
      const date = new Date(month.getFullYear(), month.getMonth(), day)
      return date > start && date < end
    }
    return false
  }

  function isStart(day: number) {
    return start && day === start.getDate() && month.getMonth() === start.getMonth() && month.getFullYear() === start.getFullYear()
  }

  function isEnd(day: number) {
    return end && day === end.getDate() && month.getMonth() === end.getMonth() && month.getFullYear() === end.getFullYear()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="border rounded px-3 py-2 w-full text-left flex items-center gap-2"
      >
        <CalendarIcon className="w-4 h-4" />
        {start && end
          ? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
          : start
            ? start.toLocaleDateString()
            : 'Select dates'}
      </button>
      {open && (
        <div className="absolute z-10 bg-white border mt-2 p-2">
          <div className="flex justify-between items-center mb-2">
            <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
            <span className="font-medium">
              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-xs text-center font-medium">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const inRange = isInRange(day)
              const startDay = isStart(day)
              const endDay = isEnd(day)
              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`w-8 h-8 text-sm flex items-center justify-center rounded-full ${
                    startDay || endDay
                      ? 'bg-green-600 text-white'
                      : inRange
                        ? 'bg-green-200'
                        : ''
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

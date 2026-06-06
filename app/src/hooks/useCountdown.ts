import { useState, useEffect, useCallback } from 'react'

interface CountdownValues {
  days: string
  hours: string
  minutes: string
  seconds: string
  isLive: boolean
}

const TARGET_DATE = new Date('2026-12-31T00:00:00').getTime()

function pad(num: number): string {
  return num.toString().padStart(2, '0')
}

export function useCountdown(): CountdownValues {
  const calculateTimeLeft = useCallback((): CountdownValues => {
    const now = Date.now()
    const diff = TARGET_DATE - now

    if (diff <= 0) {
      return { days: '00', hours: '00', minutes: '00', seconds: '00', isLive: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      isLive: false,
    }
  }, [])

  const [timeLeft, setTimeLeft] = useState<CountdownValues>(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return timeLeft
}

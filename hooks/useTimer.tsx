"use client"
import { useState, useEffect } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  sec: number;
  isValid: boolean;
  hasEnded: boolean;
}

const useTimer = (targetDate: Date): TimeLeft => {
  const calculateTimeLeft = (): TimeLeft => {
    if (isNaN(targetDate.getTime())) {
      return { days: 0, hours: 0, mins: 0, sec: 0, isValid: false, hasEnded: false };
    }

    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, mins: 0, sec: 0, isValid: true, hasEnded: true };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        sec: Math.floor((difference / 1000) % 60),
        isValid: true,
        hasEnded: false
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    if (!timeLeft.isValid || timeLeft.hasEnded) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetDate, timeLeft]);

  return timeLeft;
};

export default useTimer;

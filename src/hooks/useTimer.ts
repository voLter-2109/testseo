import { useEffect, useState } from 'react';

const useTimer = (seconds: number) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const reloadTimer = () => {
    setTime(seconds);
  };

  return { time, reloadTimer };
};

export default useTimer;

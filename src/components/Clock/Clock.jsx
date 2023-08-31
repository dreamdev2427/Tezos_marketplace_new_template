import { useState, useRef, useEffect } from "react";

const Clock = ({ nftItem, sysTime, setAuctionEnded }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [refresh, setRefresh] = useState(false);
  const curTime = useRef(0);

  const calculateTimeLeft = (created, period) => {
    let difference = created * 1000 + period * 1000 - curTime.current++ * 1000;
    let time = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference >= 0) {
      time = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    setTimeLeft(time);
    setRefresh(!refresh);
    return difference;
  };

  useEffect(() => {
    let intVal;
    if (sysTime > 0) {
      curTime.current = sysTime;
      calculateTimeLeft(nftItem?.auctionStarted, nftItem?.auctionPeriod);
      intVal = setInterval(() => {
        const time_left = calculateTimeLeft(
          nftItem?.auctionStarted,
          nftItem?.auctionPeriod
        );
        if (time_left <= 0) {
          curTime.current = 0;
          setAuctionEnded(true);
          clearInterval(intVal);
        }
      }, 1000);
    }

    return () => clearInterval(intVal);
  }, [sysTime]);

  return (
    <div className="flex space-x-5 sm:space-x-10 algin-items-center">
      <div className="flex flex-col ">
        <span className="text-2xl font-semibold sm:text-2xl">
          {timeLeft.days || 0} : {timeLeft.hours || 0} : {timeLeft.minutes || 0}{" "}
          : {timeLeft.seconds || 0}
        </span>
      </div>
    </div>
  );
};

export default Clock;

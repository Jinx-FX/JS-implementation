// react-hooks 实现倒计时/定时器

// 方法一：使用 useState, useEffect, setTimeout
import { useState, useEffect, useRef } from "react";

export function useTimer(num) {
  const [time, setTime] = useState(num);
  useEffect(() => {
    if (time < 0) return () => clearTimeout(timer);
    const timer = setTimeout(() => {
      console.log(time, new Date());
      setTime(time - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);
}

// 方法二：使用 useRef + useState, useEffect, setInterval
export function useTimer_by_ref(num) {
    const ref = useRef(num);
    ref.current = num;
    useEffect(() => {
      const timer = setInterval(() => {
        if (ref.current < 0) return () => clearInterval(timer);
        console.log(ref.current, new Date());
        ref.current = ref.current - 1;
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  }
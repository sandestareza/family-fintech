"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

export function ClientDate({
  date,
  formatString,
  className,
}: {
  date: string | Date;
  formatString?: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setMounted(true);
    }
    return () => { isMounted = false; };
  }, []);

  if (!mounted) {
    return (
      <span className={className} suppressHydrationWarning>
        {formatDate(date, formatString)}
      </span>
    );
  }

  return <span className={className}>{formatDate(date, formatString)}</span>;
}

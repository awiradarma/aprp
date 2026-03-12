
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisitAction } from "@/app/actions/auth";

export default function TrafficTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
        if (pathname?.startsWith("/admin")) return;

        trackVisitAction();
    }, [pathname]);

    return null;
}

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "ready" | "error";

export function useBoardImage(src: string | null) {
    const [status, setStatus] = useState<Status>(src ? "loading" : "idle");
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!src) {
            setStatus("error");
            setImage(null);
            return;
        }

        let cancelled = false;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            if (cancelled) return;
            setImage(img);
            setStatus("ready");
        };
        img.onerror = () => {
            if (cancelled) return;
            setImage(null);
            setStatus("error");
        };

        setStatus("loading");
        img.src = src;

        return () => {
            cancelled = true;
        };
    }, [src]);

    return { image, status };
}

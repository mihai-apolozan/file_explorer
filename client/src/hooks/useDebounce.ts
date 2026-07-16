import { useState, useEffect } from "react";



export function useDebounce(value: string, mils: number) {
    const [debouncedValue, setDebouncedValue] = useState<string>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);

        }, mils);

        return () => {
            clearTimeout(timer);
        }

    }, [value])

    return debouncedValue;
}
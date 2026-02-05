import { useState, useCallback, useRef } from 'react';

export const useLoading = (minDuration = 2000) => {
    const [isLoading, setIsLoading] = useState(false);
    const startTimeRef = useRef(null);

    const startLoading = useCallback(() => {
        startTimeRef.current = Date.now();
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingDelay = Math.max(0, minDuration - elapsedTime);

        setTimeout(() => {
            setIsLoading(false);
        }, remainingDelay);
    }, [minDuration]);

    return [isLoading, startLoading, stopLoading];
};

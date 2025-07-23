import { useEffect, useRef, useState } from 'react';

const useDropdown = <T extends HTMLElement>() => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<T>(null);

    const toggle = () => setIsOpen((prev) => !prev);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return {
        isOpen,
        toggle,
        open,
        close,
        dropdownRef,
    };
};

export default useDropdown;

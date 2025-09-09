import { useEffect, useRef, useState } from "react";

export function useSidebarToggle() {
	const [collapsed, setCollapsed] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);

	const toggle = () => setCollapsed((prev) => !prev);
	const open = () => setCollapsed(true);
	const close = () => setCollapsed(false);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(target) &&
				toggleRef.current &&
				!toggleRef.current.contains(target)
			) {
				setCollapsed(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return {
		collapsed,
		toggle,
		open,
		close,
		sidebarRef,
		toggleRef,
	};
}

import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { configureEcho } from "@laravel/echo-react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configure React Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // Disable automatic refetching on window focus
			retry: 1, // Number of retry attempts
			staleTime: 1000 * 60 * 5, // 5 minutes cache
		},
	},
});

// Configure Echo
configureEcho({
	broadcaster: "pusher",
	key: import.meta.env.VITE_PUSHER_APP_KEY,
	cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
	forceTLS: true,
	encrypted: true,
});

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) =>
		resolvePageComponent(
			`./pages/${name}.tsx`,
			import.meta.glob("./pages/**/*.tsx"),
		),
	setup({ el, App, props }) {
		const root = createRoot(el);

		root.render(
			<QueryClientProvider client={queryClient}>
				<App {...props} />
			</QueryClientProvider>,
		);
	},
	progress: {
		color: "#ff5522",
	},
});

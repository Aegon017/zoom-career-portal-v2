import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { configureEcho } from "@laravel/echo-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

configureEcho({
    broadcaster: 'reverb',
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 1000 * 60 * 5,
		},
	},
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

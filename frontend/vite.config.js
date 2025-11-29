import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/app",
	plugins: [react()],
	server: {
		port: 5000,
		proxy: {
			"/api": {
				target: "http://localhost:7000",
				changeOrigin: true,
			},
		},
	},
});

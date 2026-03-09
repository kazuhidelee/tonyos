import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleSpotifyPlaylistTracksRequest, handleSpotifyPlaylistsRequest } from './server/spotifyHandlers.js';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    Object.assign(process.env, env);
    return {
        plugins: [
            react(),
            {
                name: 'spotify-public-api-dev',
                configureServer(server) {
                    server.middlewares.use(async (req, res, next) => {
                        const requestUrl = req.url;
                        const url = requestUrl ? new URL(requestUrl, 'http://127.0.0.1:5173') : null;
                        if (!url) {
                            next();
                            return;
                        }
                        let response = null;
                        if (url.pathname === '/api/spotify/playlists') {
                            response = await handleSpotifyPlaylistsRequest();
                        }
                        else {
                            const match = url.pathname.match(/^\/api\/spotify\/playlists\/([^/]+)\/tracks$/);
                            if (match) {
                                response = await handleSpotifyPlaylistTracksRequest(decodeURIComponent(match[1]));
                            }
                        }
                        if (!response) {
                            next();
                            return;
                        }
                        res.statusCode = response.status;
                        Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
                        res.end(response.body);
                    });
                },
            },
        ],
        server: {
            host: '127.0.0.1',
            port: 5173,
        },
    };
});

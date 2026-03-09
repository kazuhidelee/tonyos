import { handleSpotifyPlaylistsRequest } from '../../server/spotifyHandlers.js';

export default async function handler(_req, res) {
  const response = await handleSpotifyPlaylistsRequest();
  Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
  res.status(response.status).send(response.body);
}

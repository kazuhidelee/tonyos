import { handleSpotifyPlaylistTracksRequest } from '../../../../server/spotifyHandlers.js';

export default async function handler(req, res) {
  const response = await handleSpotifyPlaylistTracksRequest(req.query.playlistId);
  Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
  res.status(response.status).send(response.body);
}

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://urban-purifier-production.up.railway.app';

export interface Tile {
  id: string;
  x: number;
  y: number;
  state: 'POLLUTED' | 'CLEANSED' | 'BUILDING';
  adjacentCount: number;
}

export interface GameSession {
  sessionId: string;
  userId: string;
  width: number;
  height: number;
  tiles: Tile[];
}

export interface ClickResult {
  updatedTiles: Array<{
    x: number;
    y: number;
    state: string;
    adjacentCount: number;
  }>;
  hitPollutant: boolean;
}

export const gameApi = {
  async startGame(width = 20, height = 15, pollutantCount = 30) {
    const response = await axios.post<GameSession>(`${API_BASE_URL}/game/start`, {
      width,
      height,
      pollutantCount,
    });
    return response.data;
  },

  async clickTile(sessionId: string, x: number, y: number) {
    const response = await axios.post<ClickResult>(`${API_BASE_URL}/game/click`, {
      sessionId,
      x,
      y,
    });
    return response.data;
  },

  async build(sessionId: string, x: number, y: number, buildingType: string) {
    const response = await axios.post(`${API_BASE_URL}/game/build`, {
      sessionId,
      x,
      y,
      buildingType,
    });
    return response.data;
  },

  async getGameState(sessionId: string) {
    const response = await axios.get(`${API_BASE_URL}/game/state/${sessionId}`);
    return response.data;
  },
};

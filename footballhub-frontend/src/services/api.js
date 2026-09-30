const API_BASE_URL = `http://${window.location.hostname}:8080/api`;

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch {
      // Non-JSON response.
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}

function normalizePhoto(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  return url.replace(/^http:\/\//i, "https://");
}

function normalizePlayer(player) {
  if (!player || typeof player !== "object") {
    return player;
  }

  return {
    ...player,
    id: player.id ?? player.idPlayer,
    name: player.name ?? player.strPlayer,
    team: player.team ?? player.strTeam,
    club: player.club ?? player.strTeam,
    nationality: player.nationality ?? player.strNationality,
    position: player.position ?? player.strPosition,

    photo: normalizePhoto(
      player.photo ||
        player.image ||
        player.strThumb ||
        player.strCutout ||
        player.strRender
    ),

    strThumb: normalizePhoto(player.strThumb),
    strCutout: normalizePhoto(player.strCutout),
    strRender: normalizePhoto(player.strRender),
  };
}

function normalizePlayers(data) {
  if (Array.isArray(data)) {
    return data.map(normalizePlayer);
  }

  if (Array.isArray(data?.player)) {
    return data.player.map(normalizePlayer);
  }

  if (Array.isArray(data?.players)) {
    return data.players.map(normalizePlayer);
  }

  if (data?.id || data?.idPlayer || data?.name || data?.strPlayer) {
    return normalizePlayer(data);
  }

  return [];
}

export const playerApi = {
  all: async () => {
    const data = await request("/players");
    return normalizePlayers(data);
  },

  search: async (name) => {
    const data = await request(
      `/players/api-search?name=${encodeURIComponent(name)}`
    );

    return normalizePlayers(data);
  },

  localSearch: async (name) => {
    const data = await request(
      `/players/search?name=${encodeURIComponent(name)}`
    );

    return normalizePlayers(data);
  },
};

export const squadApi = {
  create: (name, formation, managerName) =>
    request("/squads", {
      method: "POST",
      body: JSON.stringify({ name, formation, managerName }),
    }),

  get: (id) => request(`/squads/${id}`),

  getPlayers: async (id) => {
    const data = await request(`/squads/${id}/players`);
    return normalizePlayers(data);
  },

  addPlayer: (squadId, playerId, positionSlot) =>
    request(`/squads/${squadId}/players`, {
      method: "POST",
      body: JSON.stringify({ playerId, positionSlot }),
    }),

  removePosition: (squadId, positionSlot) =>
    request(
      `/squads/${squadId}/positions/${encodeURIComponent(positionSlot)}`,
      {
        method: "DELETE",
      }
    ),

  delete: (squadId) =>
    request(`/squads/${squadId}`, {
      method: "DELETE",
    }),
};

export const battleApi = {
  createRoom: (playerName) =>
    request("/battle/rooms", {
      method: "POST",
      body: JSON.stringify({ playerName }),
    }),

  getRoom: (roomCode) =>
    request(`/battle/rooms/${encodeURIComponent(roomCode)}`),

  getPlayers: (roomCode) =>
    request(`/battle/rooms/${encodeURIComponent(roomCode)}/players`),

  joinRoom: (roomCode, playerName) =>
    request(`/battle/rooms/${encodeURIComponent(roomCode)}/join`, {
      method: "POST",
      body: JSON.stringify({ playerName }),
    }),

  getCategories: () =>
    request("/battle/rooms/categories"),

  setCategory: (roomCode, category) =>
    request(`/battle/rooms/${encodeURIComponent(roomCode)}/category`, {
      method: "POST",
      body: JSON.stringify({ category }),
    }),

  randomCategory: (roomCode) =>
    request(
      `/battle/rooms/${encodeURIComponent(roomCode)}/random-category`,
      {
        method: "POST",
      }
    ),

  start: (roomCode) =>
    request(`/battle/rooms/${encodeURIComponent(roomCode)}/start`, {
      method: "POST",
    }),

  submit: (roomCode, playerName, squadId) =>
    request(`/battle/rooms/${encodeURIComponent(roomCode)}/submit`, {
      method: "POST",
      body: JSON.stringify({
        playerName,
        squadId: Number(squadId),
      }),
    }),

  votingOptions: (roomCode, voterName) =>
    request(
      `/battle/voting/${encodeURIComponent(
        roomCode
      )}/options?voterName=${encodeURIComponent(voterName)}`
    ),

  vote: (roomCode, voterName, votedForId) =>
    request(`/battle/voting/${encodeURIComponent(roomCode)}/vote`, {
      method: "POST",
      body: JSON.stringify({
        voterName,
        votedForId,
      }),
    }),

  results: (roomCode) =>
    request(
      `/battle/voting/${encodeURIComponent(roomCode)}/results`
    ),
};
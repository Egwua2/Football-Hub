import { useEffect, useMemo, useRef, useState } from "react";
import { useSessionState } from "../hooks/useSessionState";
import { Link } from "react-router-dom";
import { battleApi, getPlayerImageUrl } from "../services/api";
import "./GamePages.css";

const DEFAULT_BATTLE_CATEGORIES = ["Best Premier League XI", "Best LaLiga XI", "Best Serie A XI", "Best Bundesliga XI", "Best Ligue 1 XI", "Best Barcelona XI", "Best Real Madrid XI", "Best Manchester United XI", "Best Manchester City XI", "Best Liverpool XI", "Best Arsenal XI", "Best Chelsea XI", "Best Bayern Munich XI", "Best AC Milan XI", "Best Inter Milan XI", "Best Juventus XI", "Best PSG XI", "Best Ajax XI", "Best African XI", "Best Nigerian XI", "Best Brazilian XI", "Best Argentine XI", "Best French XI", "Best English XI", "Best Spanish XI", "Best German XI", "Best Italian XI", "Best Portuguese XI", "Best Dutch XI", "Best South American XI", "Best European XI", "Best Under-23 XI", "Best Under-21 XI", "Best Under-20 XI", "Best Young Players XI", "Best Veterans XI", "Best Players Over 30 XI", "Best Champions League XI", "Best World Cup XI", "Best European Championship XI", "Best Copa America XI", "Best AFCON XI", "Best Club World Cup XI", "Best Europa League XI", "Best All-Time XI", "Best 21st Century XI", "Best 20th Century XI", "Best 2010s XI", "Best 2020s XI", "Best Current XI", "Best Legends XI", "Best Prime XI", "Best Ballon d'Or Winners XI", "Best Champions League Winners XI", "Best World Cup Winners XI", "Best Players Without a World Cup XI", "Best Players Without a Ballon d'Or XI", "Best One-Club XI", "Best Players From One Country XI", "Best Players From Different Countries XI", "Best Players From Different Leagues XI", "Best Academy Graduates XI", "Best Wonderkid XI", "Best Underrated XI", "Best Cult Heroes XI", "Best Rivalry XI", "Best XI Never to Win the Champions League", "Best XI Never to Win the World Cup", "Best XI Never to Win the Ballon d'Or", "Best XI With Players From One Generation", "Best XI With No Ballon d'Or Winners", "Best XI With No Champions League Winners", "Best XI With No World Cup Winners", "Best Underrated Premier League XI", "Best Complete Players XI", "Best Intelligent Players XI", "Best Leaders XI", "Best Playmakers XI", "Best Box-to-Box XI", "Best Goal-Scoring XI", "Best XI From 2000–2010", "Best XI From 2010–2020", "Best XI From 2015–2025", "Best XI From 2020–Present", "Best Forgotten Legends XI", "Best One-Season Wonders XI"];

const BATTLE_FORMATIONS = [
  "4-3-3", "4-4-2", "4-2-3-1", "4-1-4-1", "4-3-2-1",
  "4-2-2-2", "4-4-1-1", "4-3-1-2", "4-1-2-3", "4-5-1",
  "3-5-2", "3-4-3", "3-4-1-2", "3-4-2-1", "3-3-3-1",
  "3-1-4-2", "3-2-4-1", "5-3-2", "5-4-1", "5-2-3",
  "5-3-1-1", "5-2-1-2", "4-2-1-3", "4-3-3 DM", "4-3-3 False 9",
];

const emptyLobby = {
  roomCode: "",
  room: null,
  players: [],
  categories: [],
};

function SquadBattle() {
  const roomRefreshSequence = useRef(0);

  const [name, setName] = useSessionState(
    "footballHub.squadBattle.session.name",
    () => localStorage.getItem("footballHub.playerName") || ""
  );
  const [roomCode, setRoomCode] = useSessionState(
    "footballHub.squadBattle.session.roomCode",
    ""
  );
  const [lobby, setLobby] = useSessionState(
    "footballHub.squadBattle.session.lobby",
    emptyLobby
  );
  const [category, setCategory] = useSessionState(
    "footballHub.squadBattle.session.category",
    ""
  );
  const [formation, setFormation] = useSessionState(
    "footballHub.squadBattle.session.formation",
    ""
  );
  // Remember which room this browser created so a refresh does not turn
  // the host into a normal participant while the room data is reloading.
  const [hostRoomCode, setHostRoomCode] = useState(
    () => sessionStorage.getItem("footballHub.squadBattle.hostRoomCode") || ""
  );
  // Read the latest squad ID each time this page opens. This keeps a new
  // squad built during the battle from being replaced by an older saved ID.
  const [squadId, setSquadId] = useState(
    localStorage.getItem("footballHub.lastSquadId") || ""
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [voteOptions, setVoteOptions] = useSessionState(
    "footballHub.squadBattle.session.voteOptions",
    []
  );
  const [results, setResults] = useSessionState(
    "footballHub.squadBattle.session.results",
    []
  );
  const isHost = useMemo(() => {
    const currentName = name.trim().toLowerCase();
    const currentRoomCode = String(
      lobby.room?.roomCode || lobby.roomCode || roomCode || ""
    ).trim().toUpperCase();

    const roomHost = String(lobby.room?.hostName || "")
      .trim()
      .toLowerCase();

    const hostFromRoom =
      Boolean(currentName) &&
      (
        roomHost === currentName ||
        lobby.players.some(
          (player) =>
            player.host &&
            String(player.playerName || "").trim().toLowerCase() ===
            currentName
        )
      );

    const hostRememberedOnThisBrowser =
      Boolean(currentRoomCode) &&
      String(hostRoomCode || "").trim().toUpperCase() ===
        currentRoomCode;

    // The saved marker is only created by createRoom() and removed by
    // joinRoom(), so the host keeps their controls after refreshing.
    return hostFromRoom || hostRememberedOnThisBrowser;
  }, [lobby.room, lobby.roomCode, lobby.players, name, roomCode, hostRoomCode]);

  async function loadRoom(code = roomCode) {
    if (!code) return;

    const requestId = ++roomRefreshSequence.current;

    try {
      const [room, playersResponse] = await Promise.all([
        battleApi.getRoom(code),
        battleApi.getPlayers(code).catch((playersError) => {
          console.error("Could not refresh Squad Battle players:", playersError);
          return [];
        }),
      ]);

      // Ignore an older response if a newer refresh has already started.
      // This stops a slow request from replacing a more recent player list.
      if (requestId !== roomRefreshSequence.current) return;

      const fetchedPlayers = Array.isArray(playersResponse)
        ? playersResponse
        : [];

      const roomPlayers = Array.isArray(room?.participants)
        ? room.participants
        : [];

      const players =
        roomPlayers.length > fetchedPlayers.length
          ? roomPlayers
          : fetchedPlayers;

      setLobby((current) => ({
        ...current,
        roomCode: code,
        room,
        players,
      }));

      if (room.category) {
        setCategory(room.category);
      }

      if (room.formation) {
        setFormation(room.formation);
      }
    } catch (err) {
      if (requestId === roomRefreshSequence.current) {
        setError(err.message);
      }
    }
  }

  // Load categories when the page opens too, so a saved room still has
  // category choices after a refresh or returning to this page.
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!roomCode) return undefined;

    let active = true;
    let timer;

    const refreshRoom = async () => {
      await loadRoom(roomCode);

      // Wait until the current refresh finishes before starting another one.
      // This prevents overlapping polls from showing an older lobby snapshot.
      if (active) {
        timer = setTimeout(refreshRoom, 2000);
      }
    };

    refreshRoom();

    return () => {
      active = false;
      roomRefreshSequence.current += 1;
      clearTimeout(timer);
    };
  }, [roomCode]);

  async function loadCategories() {
    try {
      const categories = await battleApi.getCategories();
      const backendCategories = Array.isArray(categories)
        ? categories
        : [];

      const allCategories = [
        ...backendCategories,
        ...DEFAULT_BATTLE_CATEGORIES.map((name, id) => ({
          id: `default-${id}`,
          name,
        })),
      ];

      const uniqueCategories = Array.from(
        new Map(
          allCategories.map((item) => [item.name, item])
        ).values()
      );

      setLobby((current) => ({
        ...current,
        categories: uniqueCategories,
      }));
    } catch {
      setLobby((current) => ({
        ...current,
        categories: DEFAULT_BATTLE_CATEGORIES.map(
          (name, id) => ({
            id: `default-${id}`,
            name,
          })
        ),
      }));

      setError(
        "Using the built-in battle categories. Start the backend if you want the saved categories too."
      );
    }
  }

  async function createRoom() {
    if (!name.trim()) {
      return setError("Enter your name first.");
    }

    setBusy(true);
    setError("");

    try {
      const room = await battleApi.createRoom(
        name.trim()
      );

      localStorage.setItem(
        "footballHub.playerName",
        name.trim()
      );
      sessionStorage.setItem(
        "footballHub.squadBattle.hostRoomCode",
        room.roomCode
      );
      localStorage.removeItem("footballHub.squadBattle.hostRoomCode");
      setHostRoomCode(room.roomCode);

      setRoomCode(room.roomCode);
      setCategory("");
      setFormation("");
      setVoteOptions([]);
      setResults([]);

      setLobby({
        roomCode: room.roomCode,
        room,
        players: [],
        categories: [],
      });

      await loadCategories();
      await loadRoom(room.roomCode);

      setMessage(`Room ${room.roomCode} created.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function joinRoom() {
    if (!name.trim() || !roomCode.trim()) {
      return setError(
        "Enter your name and room code."
      );
    }

    setBusy(true);
    setError("");

    try {
      const code = roomCode
        .trim()
        .toUpperCase();

      await battleApi.joinRoom(
        code,
        name.trim()
      );

      localStorage.setItem(
        "footballHub.playerName",
        name.trim()
      );
      // This tab joined as a participant, not as the room host.
      sessionStorage.removeItem("footballHub.squadBattle.hostRoomCode");
      localStorage.removeItem("footballHub.squadBattle.hostRoomCode");
      setHostRoomCode("");

      setRoomCode(code);
      setCategory("");
      setFormation("");
      setVoteOptions([]);
      setResults([]);

      await loadCategories();
      await loadRoom(code);

      setMessage("You joined the battle.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function leaveRoom() {
    const code = String(roomCode || lobby.roomCode || "")
      .trim()
      .toUpperCase();

    if (!code) return;

    const leaveMessage = isHost
      ? "Leave this room? Another player will become the host."
      : "Leave this room?";

    if (!window.confirm(leaveMessage)) return;

    setBusy(true);
    setError("");

    let leaveError = "";

    try {
      await battleApi.leaveRoom(code, name.trim());
    } catch (err) {
      leaveError = err.message || "The server could not remove you from the room.";
    }

    // Clear this browser tab's room state even if the server request fails,
    // so the player is never trapped in a saved lobby.
    setRoomCode("");
    setLobby(emptyLobby);
    setCategory("");
    setFormation("");
    setVoteOptions([]);
    setResults([]);
    setHostRoomCode("");
    sessionStorage.removeItem("footballHub.squadBattle.hostRoomCode");
    localStorage.removeItem("footballHub.squadBattle.hostRoomCode");

    if (leaveError) {
      setMessage("This room was cleared from this browser.");
      setError(
        `The server could not remove you from the room: ${leaveError}`
      );
    } else {
      setMessage(`You left room ${code}.`);
    }

    setBusy(false);
  }

  async function chooseCategory() {
    if (!category) {
      return setError(
        "Choose a category first."
      );
    }

    setBusy(true);
    setError("");

    try {
      const room =
        await battleApi.setCategory(
          roomCode,
          category,
          name.trim()
        );

      setLobby((current) => ({
        ...current,
        room,
      }));
      setCategory(room.category || category);

      await loadRoom(roomCode);

      setMessage(
        `${room.category || category} selected.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function randomCategory() {
    setBusy(true);
    setError("");

    try {
      const room =
        await battleApi.randomCategory(
          roomCode,
          name.trim()
        );

      setLobby((current) => ({
        ...current,
        room,
      }));

      setCategory(room.category || "");

      setMessage(
        `${room.category} selected.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function startBattle() {
    if (lobby.players.length < 3) {
      return setError("At least 3 players are needed to start.");
    }

    if (!formation) {
      return setError("Choose a formation first.");
    }

    setBusy(true);
    setError("");

    try {
      const room =
        await battleApi.start(roomCode, name.trim(), formation);

      setLobby((current) => ({
        ...current,
        room,
      }));

      setMessage(
        "Battle started. Build your XI!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitSquad() {
    if (!squadId) {
      return setError(
        "Enter your squad ID. Create a squad in Squad Builder first."
      );
    }

    setBusy(true);
    setError("");

    try {
      await battleApi.submit(
        roomCode,
        name.trim(),
        squadId
      );

      setMessage(
        "Squad submitted. Waiting for everyone else..."
      );

      await loadRoom();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function loadVoting() {
    try {
      const options =
        await battleApi.votingOptions(
          roomCode,
          name.trim()
        );

      setVoteOptions(options);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (
      lobby.room?.status === "VOTING" &&
      name.trim()
    ) {
      loadVoting();
    }
  }, [lobby.room?.status, name]);

  useEffect(() => {
    if (
      lobby.room?.status === "RESULTS"
    ) {
      battleApi
        .results(roomCode)
        .then(setResults)
        .catch((err) =>
          setError(err.message)
        );
    }
  }, [
    lobby.room?.status,
    roomCode,
  ]);

  async function vote(positionSlot, playerId) {
    setBusy(true);
    setError("");

    try {
      await battleApi.vote(
        roomCode,
        name.trim(),
        positionSlot,
        playerId
      );

      await loadVoting();
      setMessage("Vote saved. Move on to the next position.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const status =
    lobby.room?.status || "WAITING";

  const completedPositions = voteOptions.filter(
    (item) => item.voted || item.automatic
  ).length;

  const currentPosition = voteOptions.find(
    (item) => !item.voted && !item.automatic
  );

  return (
    <main className="game-page">
      <section className="game-hero">
        <div>
          <span className="game-kicker">
            .SQUAD BATTLE
          </span>

          <h1>
            Build. Submit.{" "}
            <span>Vote.</span>
          </h1>

          <p>
            Create a room, pick a football
            category and battle with your
            friends. Everyone submits an XI,
            then the room votes.
          </p>
        </div>

        {roomCode && (
          <div className="room-code">
            <small>ROOM CODE</small>
            <strong>{roomCode}</strong>
          </div>
        )}
      </section>

      {!lobby.room && (
        <section className="game-grid two">
          <div className="game-card">
            <span className="step">
              01
            </span>

            <h2>Create a battle</h2>

            <p>
              Start a room and send the
              code to your friends.
            </p>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your name"
            />

            <button
              className="game-button"
              onClick={createRoom}
              disabled={busy}
            >
              {busy
                ? "Creating..."
                : "Create Room"}
            </button>
          </div>

          <div className="game-card">
            <span className="step">
              02
            </span>

            <h2>Join a battle</h2>

            <p>
              Enter the room code from
              the host.
            </p>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your name"
            />

            <input
              value={roomCode}
              onChange={(e) =>
                setRoomCode(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="Room code"
              maxLength={6}
            />

            <button
              className="game-button"
              onClick={joinRoom}
              disabled={busy}
            >
              {busy
                ? "Joining..."
                : "Join Room"}
            </button>
          </div>
        </section>
      )}

      {!lobby.room && (message || error) && (
        <div className={`game-message ${error ? "error" : ""}`}>
          {error || message}
        </div>
      )}

      {lobby.room && (
        <section className="game-grid">
          <div className="game-card wide">
            <div className="card-top">
              <div>
                <span className="step">
                  LOBBY
                </span>

                <h2>
                  {lobby.room.category ||
                    "Choose your challenge"}
                </h2>
                {lobby.room.formation && (
                  <p className="notice">
                    Formation: {lobby.room.formation}
                  </p>
                )}
              </div>

              <div className="room-header-actions">
                <span
                  className={`status ${status.toLowerCase()}`}
                >
                  {status}
                </span>

                <button
                  type="button"
                  className="game-button secondary leave-room-button"
                  onClick={leaveRoom}
                  disabled={busy}
                >
                  Leave Room
                </button>
              </div>
            </div>

            <div className="player-list">
              {lobby.players.map(
                (player) => (
                  <div
                    className="player-chip"
                    key={player.id}
                  >
                    <span>⚽</span>

                    <strong>
                      {player.playerName}
                    </strong>

                    {player.host && (
                      <small>
                        HOST
                      </small>
                    )}

                    {player.submitted && (
                      <em>✓</em>
                    )}
                  </div>
                )
              )}
            </div>

            {status === "WAITING" &&
              isHost && (
                <div className="battle-category-area">
                  <div className="battle-category-select">
                    <label>
                      Choose Battle Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(
                          e.target.value
                        )
                      }
                      disabled={busy}
                    >
                      <option value="">
                        Select a category...
                      </option>

                      <optgroup label="🏆 Leagues">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best Premier League XI",
                              "Best LaLiga XI",
                              "Best Serie A XI",
                              "Best Bundesliga XI",
                              "Best Ligue 1 XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>

                      <optgroup label="🔵 Clubs">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best Barcelona XI",
                              "Best Real Madrid XI",
                              "Best Manchester United XI",
                              "Best Manchester City XI",
                              "Best Liverpool XI",
                              "Best Arsenal XI",
                              "Best Chelsea XI",
                              "Best Bayern Munich XI",
                              "Best AC Milan XI",
                              "Best Inter Milan XI",
                              "Best Juventus XI",
                              "Best PSG XI",
                              "Best Ajax XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>

                      <optgroup label="🌍 Countries & Regions">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best African XI",
                              "Best Nigerian XI",
                              "Best Brazilian XI",
                              "Best Argentine XI",
                              "Best French XI",
                              "Best English XI",
                              "Best Spanish XI",
                              "Best German XI",
                              "Best Italian XI",
                              "Best Portuguese XI",
                              "Best Dutch XI",
                              "Best South American XI",
                              "Best European XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>

                      <optgroup label="🏅 Competitions">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best Champions League XI",
                              "Best World Cup XI",
                              "Best European Championship XI",
                              "Best Copa America XI",
                              "Best AFCON XI",
                              "Best Club World Cup XI",
                              "Best Europa League XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>

                      <optgroup label="👶 Age & Generation">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best Under-23 XI",
                              "Best Under-21 XI",
                              "Best Under-20 XI",
                              "Best Young Players XI",
                              "Best Veterans XI",
                              "Best Players Over 30 XI",
                              "Best 21st Century XI",
                              "Best 20th Century XI",
                              "Best 2010s XI",
                              "Best 2020s XI",
                              "Best Current XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>

                      <optgroup label="👑 Special">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best All-Time XI",
                              "Best Legends XI",
                              "Best Prime XI",
                              "Best Ballon d'Or Winners XI",
                              "Best Champions League Winners XI",
                              "Best World Cup Winners XI",
                              "Best Players Without a World Cup XI",
                              "Best Players Without a Ballon d'Or XI",
                              "Best One-Club XI",
                              "Best Academy Graduates XI",
                              "Best Wonderkid XI",
                              "Best Underrated XI",
                              "Best Cult Heroes XI",
                              "Best Rivalry XI",
                              "Best Forgotten Legends XI",
                              "Best One-Season Wonders XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>

                      <optgroup label="🧠 Playing Style & Other">
                        {lobby.categories
                          .filter((item) =>
                            [
                              "Best Complete Players XI",
                              "Best Intelligent Players XI",
                              "Best Leaders XI",
                              "Best Playmakers XI",
                              "Best Box-to-Box XI",
                              "Best Goal-Scoring XI",
                              "Best Players From One Country XI",
                              "Best Players From Different Countries XI",
                              "Best Players From Different Leagues XI",
                              "Best XI With Players From One Generation",
                              "Best XI With No Ballon d'Or Winners",
                              "Best XI With No Champions League Winners",
                              "Best XI With No World Cup Winners",
                              "Best Underrated Premier League XI",
                            ].includes(
                              item.name
                            )
                          )
                          .map((item) => (
                            <option
                              key={item.id}
                              value={item.name}
                            >
                              {item.name}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="battle-category-select">
                    <label>
                      Choose Battle Formation
                    </label>

                    <select
                      value={formation}
                      onChange={(e) => setFormation(e.target.value)}
                      disabled={busy}
                    >
                      <option value="">
                        Select a formation...
                      </option>
                      {BATTLE_FORMATIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <p className="notice">
                      Everyone must use this formation when building their XI.
                    </p>
                  </div>

                  <div className="battle-category-actions">
                    <button
                      className="game-button secondary"
                      onClick={randomCategory}
                      disabled={busy}
                    >
                      🎲 Random Category
                    </button>

                    <button
                      className="game-button"
                      onClick={
                        chooseCategory
                      }
                      disabled={
                        !category || busy
                      }
                    >
                      Use Category
                    </button>

                    <button
                      className="game-button"
                      onClick={startBattle}
                      disabled={
                        !category ||
                        category !== lobby.room?.category ||
                        !formation ||
                        lobby.players.length < 3 ||
                        busy
                      }
                    >
                      Start Battle
                    </button>
                  </div>
                </div>
              )}

            {status === "WAITING" &&
              isHost &&
              lobby.players.length < 3 && (
                <p className="notice">
                  Share the room code with at least two other players. The battle can start once 3 or more players have joined.
                </p>
              )}

            {status === "WAITING" &&
              !isHost && (
                <p className="notice">
                  {lobby.room.category
                    ? `${lobby.room.category} selected. Waiting for the host to choose a formation and start the battle...`
                    : "Waiting for the host to choose a category and formation..."}
                </p>
              )}

            {status === "BUILDING" && (
              <div className="submit-box">
                <h3>
                  Build your{" "}
                  {lobby.room.category} XI
                </h3>

                <p>
                  Use Squad Builder, select the room formation ({lobby.room.formation}),
                  fill all 11 positions, then submit your squad ID here.
                </p>

                <div className="inline-actions">
                  <input
                    value={squadId}
                    onChange={(e) =>
                      setSquadId(
                        e.target.value
                      )
                    }
                    placeholder="Squad ID"
                  />

                  <button
                    className="game-button"
                    onClick={submitSquad}
                    disabled={busy}
                  >
                    Submit XI
                  </button>
                </div>

                <Link
                  className="text-link"
                  to="/squad-builder"
                >
                  Open Squad Builder →
                </Link>
              </div>
            )}

            {status === "VOTING" && (
              <div className="voting-box">
                <h3>Blind position voting</h3>

                <p>
                  Vote for the strongest opposing player in each position.
                  Your own selected players are excluded, and squad owners stay hidden.
                </p>

                {currentPosition ? (
                  <>
                    <p className="notice">
                      Position {completedPositions + 1} of {voteOptions.length}
                    </p>

                    <h4>{currentPosition.positionLabel}</h4>

                    <div className="vote-grid">
                      {currentPosition.options.map((option) => (
                        <button
                          key={option.playerId}
                          type="button"
                          className="vote-option position-vote-option"
                          onClick={() =>
                            vote(currentPosition.positionSlot, option.playerId)
                          }
                          disabled={busy}
                        >
                          {option.photo && (
                            <img
                              src={getPlayerImageUrl(option.photo)}
                              alt=""
                              loading="lazy"
                            />
                          )}
                          <strong>{option.playerName}</strong>
                          <span>
                            {[option.club, option.position, option.nationality]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : voteOptions.length > 0 ? (
                  <div className="notice success">
                    All your position votes are saved. Waiting for the other players...
                  </div>
                ) : (
                  <div className="notice">
                    Loading the voting options...
                  </div>
                )}
              </div>
            )}

            {status === "RESULTS" && results?.rankings?.length > 0 && (
              <div className="results">
                <h3>Final Squad Battle Results</h3>

                {results.rankings.map((result) => (
                  <div className="result-row" key={result.participantId}>
                    <strong>#{result.rank}</strong>
                    <span>{result.playerName}</span>
                    <b>{result.points} points</b>
                  </div>
                ))}

                <h3>Position Winners</h3>

                {results.positions?.map((position) => (
                  <div className="result-row" key={position.positionSlot}>
                    <strong>{position.positionLabel}</strong>
                    <span>
                      {position.winners?.map((winner) => (
                        <span key={winner.playerId}>
                          {winner.playerName}
                          {winner.owners?.length
                            ? ` — ${winner.owners.join(", ")}`
                            : ""}
                        </span>
                      ))}
                    </span>
                    <b>{position.automatic ? "Shared pick" : "Voted"}</b>
                  </div>
                ))}
              </div>
            )}

            {(message || error) && (
              <div
                className={`game-message ${error ? "error" : ""
                  }`}
              >
                {error || message}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default SquadBattle;
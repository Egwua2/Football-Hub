import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { battleApi } from "../services/api";
import "./GamePages.css";

const DEFAULT_BATTLE_CATEGORIES = ["Best Premier League XI","Best LaLiga XI","Best Serie A XI","Best Bundesliga XI","Best Ligue 1 XI","Best Barcelona XI","Best Real Madrid XI","Best Manchester United XI","Best Manchester City XI","Best Liverpool XI","Best Arsenal XI","Best Chelsea XI","Best Bayern Munich XI","Best AC Milan XI","Best Inter Milan XI","Best Juventus XI","Best PSG XI","Best Ajax XI","Best African XI","Best Nigerian XI","Best Brazilian XI","Best Argentine XI","Best French XI","Best English XI","Best Spanish XI","Best German XI","Best Italian XI","Best Portuguese XI","Best Dutch XI","Best South American XI","Best European XI","Best Under-23 XI","Best Under-21 XI","Best Under-20 XI","Best Young Players XI","Best Veterans XI","Best Players Over 30 XI","Best Champions League XI","Best World Cup XI","Best European Championship XI","Best Copa America XI","Best AFCON XI","Best Club World Cup XI","Best Europa League XI","Best All-Time XI","Best 21st Century XI","Best 20th Century XI","Best 2010s XI","Best 2020s XI","Best Current XI","Best Legends XI","Best Prime XI","Best Ballon d'Or Winners XI","Best Champions League Winners XI","Best World Cup Winners XI","Best Players Without a World Cup XI","Best Players Without a Ballon d'Or XI","Best One-Club XI","Best Players From One Country XI","Best Players From Different Countries XI","Best Players From Different Leagues XI","Best Academy Graduates XI","Best Wonderkid XI","Best Underrated XI","Best Cult Heroes XI","Best Rivalry XI","Best XI Never to Win the Champions League","Best XI Never to Win the World Cup","Best XI Never to Win the Ballon d'Or","Best XI With Players From One Generation","Best XI With No Ballon d'Or Winners","Best XI With No Champions League Winners","Best XI With No World Cup Winners","Best Underrated Premier League XI","Best Complete Players XI","Best Intelligent Players XI","Best Leaders XI","Best Playmakers XI","Best Box-to-Box XI","Best Goal-Scoring XI","Best XI From 2000–2010","Best XI From 2010–2020","Best XI From 2015–2025","Best XI From 2020–Present","Best Forgotten Legends XI","Best One-Season Wonders XI"];

const emptyLobby = {
  roomCode: "",
  room: null,
  players: [],
  categories: [],
};

function SquadBattle() {
  const [name, setName] = useState(
    localStorage.getItem("footballHub.playerName") || ""
  );
  const [roomCode, setRoomCode] = useState("");
  const [lobby, setLobby] = useState(emptyLobby);
  const [category, setCategory] = useState("");
  const [squadId, setSquadId] = useState(
    localStorage.getItem("footballHub.lastSquadId") || ""
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [voteOptions, setVoteOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const isHost = useMemo(
    () =>
      lobby.room?.hostName?.toLowerCase() ===
      name.trim().toLowerCase(),
    [lobby.room, name]
  );

  async function loadRoom(code = roomCode) {
    if (!code) return;

    try {
      const [room, players] = await Promise.all([
        battleApi.getRoom(code),
        battleApi.getPlayers(code),
      ]);

      setLobby((current) => ({
        ...current,
        roomCode: code,
        room,
        players,
      }));

      if (room.category) {
        setCategory(room.category);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!roomCode) return undefined;

    loadRoom(roomCode);

    const timer = setInterval(
      () => loadRoom(roomCode),
      2000
    );

    return () => clearInterval(timer);
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
    } catch (err) {
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

      setRoomCode(room.roomCode);

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

      setRoomCode(code);

      await loadCategories();
      await loadRoom(code);

      setMessage("You joined the battle.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
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
          category
        );

      setLobby((current) => ({
        ...current,
        room,
      }));

      setMessage(
        `${category} selected.`
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
          roomCode
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
    setBusy(true);
    setError("");

    try {
      const room =
        await battleApi.start(roomCode);

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

  async function vote(participantId) {
    setBusy(true);
    setError("");

    try {
      await battleApi.vote(
        roomCode,
        name.trim(),
        participantId
      );

      setHasVoted(true);
      setMessage("Vote submitted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const status =
    lobby.room?.status || "WAITING";

  return (
    <main className="game-page">
      <section className="game-hero">
        <div>
          <span className="game-kicker">
            ⚔️ SQUAD BATTLE
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
              </div>

              <span
                className={`status ${status.toLowerCase()}`}
              >
                {status}
              </span>
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
                        lobby.players.length <
                          2 ||
                        busy
                      }
                    >
                      Start Battle
                    </button>
                  </div>
                </div>
              )}

            {status === "WAITING" &&
  !isHost && (
    <p className="notice">
      {lobby.room.category
        ? `${lobby.room.category} selected. Waiting for the host to start the battle...`
        : "Waiting for the host to choose a category..."}
    </p>
  )}

            {status === "BUILDING" && (
              <div className="submit-box">
                <h3>
                  Build your{" "}
                  {lobby.room.category} XI
                </h3>

                <p>
                  Use Squad Builder, fill
                  all 11 positions, then
                  submit the squad ID here.
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
                <h3>
                  Vote for the strongest
                  squad
                </h3>

                <p>
                  Don't vote for yourself.
                  Pick the squad you think
                  fits the category best.
                </p>

                {!hasVoted ? (
                  <div className="vote-grid">
                    {voteOptions.map(
                      (option) => (
                        <button
                          key={
                            option.participantId
                          }
                          className="vote-option"
                          onClick={() =>
                            vote(
                              option.participantId
                            )
                          }
                          disabled={busy}
                        >
                          <strong>
                            {option.label}
                          </strong>

                          <span>
                            {option.squad
                              ?.name ||
                              "Submitted XI"}

                            {option.squad
                              ?.managerName
                              ? ` · ${option.squad.managerName}`
                              : ""}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div className="notice success">
                    Vote locked in ✓
                  </div>
                )}
              </div>
            )}

            {results.length > 0 && (
              <div className="results">
                <h3>
                  Battle Results
                </h3>

                {results.map(
                  (result, index) => (
                    <div
                      className="result-row"
                      key={
                        result.participantId
                      }
                    >
                      <strong>
                        #{index + 1}
                      </strong>

                      <span>
                        {result.playerName}
                      </span>

                      <b>
                        {result.votes}{" "}
                        vote
                        {result.votes === 1
                          ? ""
                          : "s"}
                      </b>
                    </div>
                  )
                )}
              </div>
            )}

            {(message || error) && (
              <div
                className={`game-message ${
                  error ? "error" : ""
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
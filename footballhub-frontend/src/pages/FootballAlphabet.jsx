import { useEffect, useMemo, useState } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import { playerApi } from "../services/api";
import "./GamePages.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ROUNDS = 10;
const ROUND_SECONDS = 15;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim();
}

// Fisher-Yates shuffle - a genuinely uniform random shuffle.
// (Array.sort(() => Math.random() - 0.5) is a biased anti-pattern that
// tends to leave elements closer to their original position, so the
// same early letters kept getting drawn more often than they should.)
function shuffle(items) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// A round of unique letters, so the same letter never comes up twice.
function drawLetters(count) {
  return shuffle(ALPHABET).slice(0, count);
}

// Checks the typed name against the real player database (TheSportsDB,
// via the backend) instead of a fixed local list - this way any real
// footballer counts, not just the ones someone remembered to hardcode.
async function isValidAnswer(letter, rawAnswer) {
  const answer = normalize(rawAnswer);
  if (!answer || !answer.startsWith(letter.toLowerCase())) return false;

  const results = await playerApi.search(rawAnswer.trim());

  return results.some((player) => {
    const fullName = player.name || player.strPlayer;
    if (!fullName) return false;

    const normalized = normalize(fullName);
    if (normalized === answer) return true;

    // Also accept just a first or last name (e.g. "Haaland" for an "H").
    return normalized
      .split(" ")
      .filter((part) => part.length > 2)
      .includes(answer);
  });
}

function FootballAlphabet() {
  const [names, setNames] = usePersistentState("footballAlphabet.names", ["", ""]);
  const [game, setGame] = usePersistentState("footballAlphabet.game", null);
  const [answer, setAnswer] = usePersistentState("footballAlphabet.answer", "");
  const [timeLeft, setTimeLeft] = usePersistentState("footballAlphabet.timeLeft", ROUND_SECONDS);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const cleanNames = useMemo(
    () => names.map((name) => name.trim()),
    [names]
  );

  useEffect(() => {
    if (!game || game.finished || checking) return undefined;

    if (timeLeft <= 0) {
      nextTurn(false, `Time up · the letter was ${game.letter}`);
      return undefined;
    }

    const timer = setInterval(() => setTimeLeft((current) => current - 1), 1000);
    return () => clearInterval(timer);
  }, [game, timeLeft, checking]);

  function addPlayer() {
    if (names.length >= 8) return;
    setNames((current) => [...current, ""]);
  }

  function startGame() {
    if (cleanNames.some((name) => !name)) {
      setError("Please enter a name for every player.");
      return;
    }

    const letters = drawLetters(ROUNDS);
    setGame({
      round: 1,
      turn: 0,
      letter: letters[0],
      letters,
      scores: cleanNames.map(() => 0),
      finished: false,
      lastResult: "",
    });
    setAnswer("");
    setTimeLeft(ROUND_SECONDS);
    setError("");
  }

  function nextTurn(correct, result) {
    if (!game) return;

    const scores = [...game.scores];
    if (correct) scores[game.turn] += 1;

    if (game.round >= ROUNDS) {
      setGame((current) => ({ ...current, scores, finished: true, lastResult: result }));
      return;
    }

    const nextTurnIndex = (game.turn + 1) % cleanNames.length;
    setGame((current) => ({
      ...current,
      round: current.round + 1,
      turn: nextTurnIndex,
      letter: current.letters[current.round],
      scores,
      lastResult: result,
    }));
    setAnswer("");
    setTimeLeft(ROUND_SECONDS);
  }

  async function submitAnswer(event) {
    event.preventDefault();
    const value = answer.trim();

    if (!value) {
      setError("Enter a footballer name.");
      return;
    }

    if (!normalize(value).startsWith(game.letter.toLowerCase())) {
      setError(`That name doesn't start with ${game.letter}.`);
      return;
    }

    setError("");
    setChecking(true);

    try {
      const valid = await isValidAnswer(game.letter, value);

      if (!valid) {
        setError(`We couldn't find a footballer named "${value}" starting with ${game.letter}. Try again or skip.`);
        return;
      }

      nextTurn(true, `${value} ✓`);
    } catch (err) {
      setError("Couldn't verify that name right now - check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  function skip() {
    setError("");
    nextTurn(false, `Skipped · the letter was ${game.letter}`);
  }

  function reset() {
    setGame(null);
    setAnswer("");
    setError("");
    setTimeLeft(ROUND_SECONDS);
  }

  return (
    <main className="game-page alphabet-page">
      <section className="game-hero">
        <div>
          <span className="game-kicker">.FOOTBALL ALPHABET</span>
          <h1>Name a footballer. <span>Beat the clock.</span></h1>
          <p>Get the letter, name a real footballer starting with it, score a point and pass the phone. Ten quick rounds, no repeated letters.</p>
        </div>
        {game && !game.finished && <div className="room-code"><small>TIME</small><strong>{timeLeft}s</strong></div>}
      </section>

      {!game && (
        <section className="game-grid two">
          <div className="game-card">
            <span className="step">SETUP</span>
            <h2>Players</h2>
            <p>Play solo or pass the phone around with up to 8 players.</p>
            <div className="name-list">
              {names.map((name, index) => (
                <div className="name-row" key={index}>
                  <input
                    value={name}
                    onChange={(e) => setNames((current) => current.map((item, i) => i === index ? e.target.value : item))}
                    placeholder={`Player ${index + 1}`}
                    autoComplete="off"
                  />
                  {names.length > 1 && <button className="mini-button" onClick={() => setNames((current) => current.filter((_, i) => i !== index))}>×</button>}
                </div>
              ))}
            </div>
            <button className="game-button secondary" onClick={addPlayer} disabled={names.length >= 8}>+ Add Player</button>
          </div>

          <div className="game-card">
            <span className="step">RULES</span>
            <h2>How it works</h2>
            <div className="rules">
              <p>• A random football letter appears, never repeated within a game.</p>
              <p>• You have 15 seconds to name a real footballer.</p>
              <p>• The name must start with the displayed letter.</p>
              <p>• Answers are checked live against the player database, not just accepted.</p>
              <p>• Each correct answer is one point.</p>
            </div>
            <button className="game-button" onClick={startGame}>Start Alphabet</button>
            {error && <div className="game-message error">{error}</div>}
          </div>
        </section>
      )}

      {game && !game.finished && (
        <section className="game-grid">
          <div className="game-card wide alphabet-round">
            <span className="step">ROUND {game.round} / {ROUNDS} · {cleanNames[game.turn]}'S TURN</span>
            <div className="alphabet-letter">{game.letter}</div>
            <p className="alphabet-prompt">Name a footballer starting with <strong>{game.letter}</strong>.</p>

            <form className="alphabet-form" onSubmit={submitAnswer}>
              <input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="e.g. Messi" disabled={checking} />
              <button className="game-button" type="submit" disabled={checking}>{checking ? "Checking..." : "Submit"}</button>
              <button className="game-button secondary" type="button" onClick={skip} disabled={checking}>Skip</button>
            </form>

            {game.lastResult && <div className="notice success">{game.lastResult}</div>}
            {error && <div className="game-message error">{error}</div>}

            <div className="alphabet-scoreboard">
              {cleanNames.map((name, index) => (
                <div className={index === game.turn ? "alphabet-score active" : "alphabet-score"} key={name}>
                  <span>{name}</span>
                  <strong>{game.scores[index]}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {game?.finished && (
        <section className="game-grid two">
          <div className="game-card">
            <span className="step">FINAL SCORES</span>
            <h2>Alphabet finished 🔤</h2>
            <div className="results">
              {cleanNames
                .map((name, index) => ({ name, index, count: game.scores[index] }))
                .sort((a, b) => b.count - a.count)
                .map((item, index) => (
                  <div className="result-row" key={item.name}>
                    <strong>#{index + 1}</strong>
                    <span>{item.name}</span>
                    <b>{item.count} pts</b>
                  </div>
                ))}
            </div>
          </div>
          <div className="game-card">
            <span className="step">NEXT ROUND</span>
            <h2>Run it back?</h2>
            <p>Same players, ten new letters.</p>
            <button className="game-button" onClick={startGame}>Play Again</button>
            <button className="game-button secondary" onClick={reset}>Change Players</button>
          </div>
        </section>
      )}
    </main>
  );
}

export default FootballAlphabet;
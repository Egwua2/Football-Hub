import { useEffect, useMemo, useState } from "react";
import "./GamePages.css";

// A real footballer whose first name OR surname starts with every letter of
// the alphabet, so answers are actually checked instead of just accepted.
const PLAYERS = [
  "Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappe", "Erling Haaland",
  "Kevin De Bruyne", "Mohamed Salah", "Bukayo Saka", "Jude Bellingham", "Harry Kane",
  "Robert Lewandowski", "Luka Modric", "Toni Kroos", "Virgil van Dijk", "Vinicius Junior",
  "Phil Foden", "Bruno Fernandes", "Ousmane Dembele", "Victor Osimhen", "Martin Odegaard",
  "Alisson Becker", "Thibaut Courtois", "Manuel Neuer", "Casemiro", "Rodri",
  "Sergio Busquets", "Andres Iniesta", "Xavi Hernandez", "Xabi Alonso", "Alexander Isak",
  "Emiliano Martinez", "Antoine Griezmann", "Didier Drogba", "Samuel Eto'o", "Thierry Henry",
  "Eden Hazard", "Steven Gerrard", "Wayne Rooney", "David Beckham", "Frank Lampard",
  "Gianluigi Buffon", "Roberto Baggio", "Andrea Pirlo", "Paolo Maldini", "Diego Maradona",
  "Pele", "Pedri", "Zinedine Zidane", "Ronaldinho", "Ronaldo Nazario",
  "Yaya Toure", "Arjen Robben", "Luis Suarez", "Ricardo Quaresma", "Samuel Umtiti",
  "Ansu Fati", "Joshua Kimmich", "Kaka", "Jamal Musiala",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ROUNDS = 10;
const ROUND_SECONDS = 15;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim();
}

// A round of unique letters, so the same letter never comes up twice.
function drawLetters(count) {
  return [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, count);
}

function isValidAnswer(letter, rawAnswer) {
  const answer = normalize(rawAnswer);
  if (!answer || !answer.startsWith(letter.toLowerCase())) return false;

  return PLAYERS.some((fullName) => {
    const normalized = normalize(fullName);
    if (normalized === answer) return true;
    return normalized.split(" ").filter((part) => part.length > 2).includes(answer);
  });
}

function exampleFor(letter) {
  const match = PLAYERS.find((fullName) => {
    const normalized = normalize(fullName);
    return normalized.split(" ").some((part) => part.length > 2 && part.startsWith(letter.toLowerCase()));
  });
  return match || null;
}

function FootballAlphabet() {
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [game, setGame] = useState(null);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [error, setError] = useState("");

  const cleanNames = useMemo(
    () => names.map((name, index) => name.trim() || `Player ${index + 1}`),
    [names]
  );

  useEffect(() => {
    if (!game || game.finished) return undefined;

    if (timeLeft <= 0) {
      nextTurn(false, `Time up · try ${exampleFor(game.letter) || "something else"}`);
      return undefined;
    }

    const timer = setInterval(() => setTimeLeft((current) => current - 1), 1000);
    return () => clearInterval(timer);
  }, [game, timeLeft]);

  function addPlayer() {
    if (names.length >= 8) return;
    setNames((current) => [...current, `Player ${current.length + 1}`]);
  }

  function startGame() {
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

  function submitAnswer(event) {
    event.preventDefault();
    const value = answer.trim();
    if (!value) {
      setError("Enter a footballer name.");
      return;
    }

    if (!isValidAnswer(game.letter, value)) {
      setError(`We don't recognise "${value}" as a footballer starting with ${game.letter}. Try again or skip.`);
      return;
    }

    setError("");
    nextTurn(true, `${value} ✓`);
  }

  function skip() {
    setError("");
    nextTurn(false, `Skipped · try ${exampleFor(game.letter) || "something else"}`);
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
          <span className="game-kicker">🔤 FOOTBALL ALPHABET</span>
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
                  <input value={name} onChange={(e) => setNames((current) => current.map((item, i) => i === index ? e.target.value : item))} />
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
              <p>• Answers are checked against a real players list, not just accepted.</p>
              <p>• Each correct answer is one point.</p>
            </div>
            <button className="game-button" onClick={startGame}>Start Alphabet</button>
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
              <input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="e.g. Messi" />
              <button className="game-button" type="submit">Submit</button>
              <button className="game-button secondary" type="button" onClick={skip}>Skip</button>
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

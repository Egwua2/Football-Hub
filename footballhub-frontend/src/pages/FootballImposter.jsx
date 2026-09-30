import { useMemo, useState } from "react";
import "./GamePages.css";

const PLAYER_POOLS = {
  "Popular Players": [
    "Lionel Messi","Cristiano Ronaldo","Kylian Mbappe","Erling Haaland","Vinicius Junior","Jude Bellingham",
    "Mohamed Salah","Lamine Yamal","Neymar","Harry Kane","Robert Lewandowski","Kevin De Bruyne",
    "Son Heung-min","Rodri","Ousmane Dembele","Victor Osimhen","Phil Foden","Virgil van Dijk",
    "Luka Modric","Antoine Griezmann","Raphinha","Pedri","Bukayo Saka","Cole Palmer","Bruno Fernandes",
    "Frenkie de Jong","Khvicha Kvaratskhelia","Rafael Leao","Lautaro Martinez","Federico Valverde",
    "Jamal Musiala","Florian Wirtz","Joshua Kimmich","Thibaut Courtois","Jan Oblak","Mike Maignan",
    "Achraf Hakimi","Alphonso Davies","Antonio Rudiger","Marquinhos","Christian Pulisic","Romelu Lukaku",
    "Martin Odegaard","Declan Rice","William Saliba","Trent Alexander-Arnold","Andrew Robertson","Alisson",
    "Bernardo Silva","Ruben Dias","John Stones","Kyle Walker","Gabriel Magalhaes","Gabriel Martinelli",
    "Alexander Isak","Bruno Guimaraes","Anthony Gordon","Micky van de Ven","James Maddison","Dominic Solanke",
    "Darwin Nunez","Luis Diaz","Diogo Jota","Enzo Fernandez","Moises Caicedo","Nicolas Jackson",
    "Marc Cucurella","Reece James","Malo Gusto","Emiliano Martinez","Kai Havertz","Gabriel Jesus",
    "Marcus Rashford","Mason Mount","Casemiro","Christian Eriksen","Lisandro Martinez","Matheus Cunha",
    "Jarrod Bowen","Eberechi Eze","Michael Olise","Morgan Gibbs-White","Lucas Paqueta","Richarlison",
    "Pedro Neto","Ben White","Conor Gallagher","Jack Grealish","Jordan Pickford","Paulo Dybala",
    "Sandro Tonali","Nicolo Barella","Eduardo Camavinga","Aurelien Tchouameni","Arda Guler","Joao Felix",
    "Joao Cancelo","Gavi","Dani Olmo","Rodrygo","Brahim Diaz","Eder Militao","Theo Hernandez",
    "Dusan Vlahovic","Victor Boniface","Benjamin Sesko","Serge Gnabry","Leroy Sane","Kingsley Coman",
    "Karim Benzema","Sadio Mane","N'Golo Kante","Toni Kroos","Sergio Ramos","Thiago Silva","Angel Di Maria",
    "Edinson Cavani","Luis Suarez"
  ],

  "Legends": [
    "Pele","Diego Maradona","Johan Cruyff","Franz Beckenbauer","Zinedine Zidane","Ronaldo Nazario",
    "Ronaldinho","Michel Platini","George Best","Garrincha","Eusebio","Ferenc Puskas","Marco van Basten",
    "Ruud Gullit","Bobby Charlton","Cafu","Roberto Carlos","Rivaldo","Romario","Kaka","Dani Alves","Dunga",
    "Zico","Xavi Hernandez","Andres Iniesta","Carles Puyol","Sergio Busquets","David Villa","Luis Suarez",
    "Samuel Eto'o","Patrick Kluivert","Xabi Alonso","Iker Casillas","Fernando Torres","Sergio Ramos",
    "Thierry Henry","Wayne Rooney","Steven Gerrard","Frank Lampard","Paul Scholes","Ryan Giggs",
    "David Beckham","John Terry","Rio Ferdinand","Nemanja Vidic","Ashley Cole","Peter Schmeichel",
    "Alan Shearer","Eric Cantona","Dennis Bergkamp","Patrick Vieira","Didier Drogba","Sergio Aguero",
    "Yaya Toure","Vincent Kompany","Cesc Fabregas","Michael Essien","Robin van Persie","Petr Cech",
    "Paolo Maldini","Andrea Pirlo","Francesco Totti","Alessandro Del Piero","Fabio Cannavaro",
    "Gianluigi Buffon","Franco Baresi","Roberto Baggio","Filippo Inzaghi","Gennaro Gattuso","Luis Figo",
    "Zlatan Ibrahimovic","Arjen Robben","Franck Ribery","Wesley Sneijder","Clarence Seedorf","Michael Ballack",
    "Miroslav Klose","Andriy Shevchenko","Pavel Nedved","Ruud van Nistelrooy","Edgar Davids","Javier Zanetti",
    "Hernan Crespo","Gabriel Batistuta","Diego Forlan"
  ]
};

const HARD_ADDITIONS = {
  "Popular Players": [
    "Nicolo Barella", "Federico Valverde", "Joshua Kimmich", "Bernardo Silva",
    "Khvicha Kvaratskhelia", "Randal Kolo Muani", "Jamal Musiala", "Alexander Isak"
  ],
  "Premier League Stars": [
    "James Maddison", "Morgan Gibbs-White", "Dominic Solanke", "Joao Palhinha",
    "Levi Colwill", "Kaoru Mitoma", "Moises Caicedo", "Ollie Watkins"
  ],
  Legends: [
    "Roberto Baggio", "Michael Ballack", "Ronaldo Nazario", "Xabi Alonso",
    "Patrick Vieira", "Rivaldo", "George Best", "Franz Beckenbauer"
  ]
};

const categories = Object.keys(PLAYER_POOLS);

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function FootballImposter() {
  const [names, setNames] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4"
  ]);

  const [category, setCategory] = useState("Popular Players");
  const [hardMode, setHardMode] = useState(false);

  const [game, setGame] = useState(null);
  const [stage, setStage] = useState("setup");

  const [imposterCount, setImposterCount] = useState(1);

  const [revealIndex, setRevealIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);

  const [voterIndex, setVoterIndex] = useState(0);

  const [votes, setVotes] = useState({});
  const [selectedVotes, setSelectedVotes] = useState([]);

  const [finalGuess, setFinalGuess] = useState("");
  const [outcome, setOutcome] = useState(null);

  const [caughtImposters, setCaughtImposters] = useState([]);
  const [escapedImposters, setEscapedImposters] = useState([]);

  const [error, setError] = useState("");

  const cleanNames = useMemo(
    () =>
      names.map(
        (name, index) => name.trim() || `Player ${index + 1}`
      ),
    [names]
  );

  const maxImposters = Math.max(
    1,
    Math.floor(cleanNames.length / 2)
  );

  function updateName(index, value) {
    setNames((current) =>
      current.map((name, i) =>
        i === index ? value : name
      )
    );
  }

  function addPlayer() {
    if (names.length >= 10) return;

    setNames((current) => [
      ...current,
      `Player ${current.length + 1}`
    ]);
  }

  function removePlayer(index) {
    if (names.length <= 3) return;

    setNames((current) =>
      current.filter((_, i) => i !== index)
    );

    setImposterCount((current) =>
      Math.min(current, Math.max(1, Math.floor((names.length - 1) / 2)))
    );
  }

  function startGame() {
    if (cleanNames.length < 3) {
      setError("You need at least 3 players.");
      return;
    }

    if (
      new Set(
        cleanNames.map((name) => name.toLowerCase())
      ).size !== cleanNames.length
    ) {
      setError("Every player needs a different name.");
      return;
    }

    const pool = hardMode
      ? [
          ...PLAYER_POOLS[category],
          ...(HARD_ADDITIONS[category] || [])
        ]
      : PLAYER_POOLS[category];

    const secret =
      pool[Math.floor(Math.random() * pool.length)];

    const shuffledPlayers = shuffle(
      cleanNames.map((_, index) => index)
    );

    const actualImposterCount = Math.min(
      imposterCount,
      maxImposters
    );

    const imposters = shuffledPlayers.slice(
      0,
      actualImposterCount
    );

    setGame({
      secret,
      imposters,
      category
    });

    setRevealIndex(0);
    setCardRevealed(false);

    setVoterIndex(0);
    setVotes({});
    setSelectedVotes([]);

    setFinalGuess("");

    setCaughtImposters([]);
    setEscapedImposters([]);

    setOutcome(null);

    setStage("reveal");
    setError("");
  }

  function revealCard() {
    setCardRevealed(true);
  }

  function finishReveal() {
    if (revealIndex < cleanNames.length - 1) {
      setRevealIndex((current) => current + 1);
      setCardRevealed(false);
    } else {
      setCardRevealed(false);
      setStage("clues");
    }
  }

  function toggleVote(index) {
    if (index === voterIndex) return;

    setSelectedVotes((current) => {
      if (current.includes(index)) {
        return current.filter(
          (playerIndex) => playerIndex !== index
        );
      }

      if (current.length >= game.imposters.length) {
        return current;
      }

      return [...current, index];
    });
  }

  function submitVotes() {
    const requiredVotes = game.imposters.length;

    if (selectedVotes.length !== requiredVotes) {
      return;
    }

    const updatedVotes = { ...votes };

    selectedVotes.forEach((index) => {
      updatedVotes[index] =
        (updatedVotes[index] || 0) + 1;
    });

    setVotes(updatedVotes);

    if (voterIndex < cleanNames.length - 1) {
      setVoterIndex((current) => current + 1);
      setSelectedVotes([]);
      return;
    }

    const tally = cleanNames.map((name, index) => ({
      name,
      index,
      count: updatedVotes[index] || 0
    }));

    tally.sort((a, b) => b.count - a.count);

    const topVoted = tally
      .slice(0, requiredVotes)
      .map((item) => item.index);

    const caught = game.imposters.filter((index) =>
      topVoted.includes(index)
    );

    const escaped = game.imposters.filter(
      (index) => !topVoted.includes(index)
    );

    setCaughtImposters(caught);
    setEscapedImposters(escaped);

    setSelectedVotes([]);

    if (escaped.length === 0) {
      setStage("finalGuess");
    } else {
      setOutcome("imposter");
      setStage("results");
    }
  }

  function submitFinalGuess() {
    const correct =
      finalGuess.trim().toLowerCase() ===
      game.secret.toLowerCase();

    setOutcome(correct ? "imposter" : "crew");
    setStage("results");
  }

  function reset() {
    setGame(null);
    setStage("setup");

    setRevealIndex(0);
    setCardRevealed(false);

    setVoterIndex(0);
    setVotes({});
    setSelectedVotes([]);

    setFinalGuess("");

    setCaughtImposters([]);
    setEscapedImposters([]);

    setOutcome(null);
    setError("");
  }

  return (
    <main className="game-page imposter-page">
      <section className="game-hero">
        <div>
          <span className="game-kicker">
            .FOOTBALL IMPOSTER
          </span>

          <h1>
            Who is the<span> IMPOSTER?</span>
          </h1>

          <p>
            Pass and play, keep your role secret, give clever
            clues but don't reveal and catch the imposter.
          </p>
        </div>

        {game && (
          <div className="room-code">
            <small>IMPOSTERS</small>
            <strong>{game.imposters.length}</strong>
          </div>
        )}
      </section>

      {stage === "setup" && (
        <section className="game-grid two">
          <div className="game-card">
            <span className="step">
              01 · PLAYERS
            </span>

            <h2>Who's playing?</h2>

            <p>
              3–10 people can play on one device.
              Choose how many imposters you want.
            </p>

            <div className="name-list">
              {names.map((name, index) => (
                <div
                  className="name-row"
                  key={index}
                >
                  <input
                    value={name}
                    onChange={(e) =>
                      updateName(
                        index,
                        e.target.value
                      )
                    }
                  />

                  {names.length > 3 && (
                    <button
                      className="mini-button"
                      onClick={() =>
                        removePlayer(index)
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              className="game-button secondary"
              onClick={addPlayer}
              disabled={names.length >= 10}
            >
              + Add Player
            </button>

            <div className="imposter-count-box">
              <h3>Number of Imposters</h3>

              <p>
                With {cleanNames.length} players,
                choose up to {maxImposters} imposters.
              </p>

              <div className="category-list">
                {Array.from(
                  { length: maxImposters },
                  (_, index) => index + 1
                ).map((count) => (
                  <button
                    key={count}
                    className={
                      imposterCount === count
                        ? "category active"
                        : "category"
                    }
                    onClick={() =>
                      setImposterCount(count)
                    }
                  >
                    {count} Imposter
                    {count > 1 ? "s" : ""}

                    <span>
                      {count === 1
                        ? "Classic"
                        : `${count} hidden players`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="game-card">
            <span className="step">
              02 · CATEGORY
            </span>

            <h2>
              Choose your football world
            </h2>

            <div className="category-list">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "category active"
                      : "category"
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                >
                  {item}

                  <span>
                    {PLAYER_POOLS[item].length +
                      (hardMode &&
                      HARD_ADDITIONS[item]
                        ? HARD_ADDITIONS[item].length
                        : 0)}{" "}
                    {hardMode
                      ? "picks"
                      : "easy picks"}
                  </span>
                </button>
              ))}
            </div>

            <div className="rules">
              <p>
                • Everyone except the imposters sees
                the secret footballer.
              </p>

              <p>
                • Imposters only see the category.
              </p>

              <p>
                • Each player gives one clue without
                saying the name.
              </p>

              <p>
                • Each voter chooses as many people
                as there are imposters.
              </p>

              <p>
                • A voter cannot select the same
                person twice.
              </p>

              <p>
                • Players cannot vote for themselves.
              </p>

              <p>
                • The top voted players are compared
                with the actual imposters.
              </p>

              <p>
                • If all imposters are caught, they
                get one final guess.
              </p>
            </div>

            <button
              type="button"
              className={
                hardMode
                  ? "game-button secondary active"
                  : "game-button secondary"
              }
              onClick={() =>
                setHardMode((current) => !current)
              }
            >
              {hardMode
                ? "🔥 Hard Mode: ON"
                : "😌 Hard Mode: OFF"}
            </button>

            <button
              className="game-button"
              onClick={startGame}
            >
              Start Game
            </button>

            {error && (
              <div className="game-message error">
                {error}
              </div>
            )}
          </div>
        </section>
      )}

      {stage === "reveal" && game && (
        <section className="game-grid">
          <div className="game-card wide reveal-card">
            <span className="step">
              PASS AND PLAY ·{" "}
              {revealIndex + 1}/
              {cleanNames.length}
            </span>

            <h2>
              {cleanNames[revealIndex]}'s turn
            </h2>

            <p>
              Make sure only YOU can see the screen.
            </p>

            {!cardRevealed ? (
              <button
                className="secret-box hidden-secret-card"
                onClick={revealCard}
              >
                <strong>?</strong>
                <span>
                  Tap to reveal your role
                </span>
              </button>
            ) : (
              <div className="secret-box">
                {game.imposters.includes(
                  revealIndex
                ) ? (
                  <>
                    <strong>
                      YOU ARE AN IMPOSTER 🕵️
                    </strong>

                    <span>
                      Category: {game.category}
                    </span>

                    <small>
                      Blend in. Do not reveal that
                      you don't know the player.
                    </small>
                  </>
                ) : (
                  <>
                    <strong>
                      {game.secret}
                    </strong>

                    <span>
                      Category: {game.category}
                    </span>

                    <small>
                      Give one clue about this
                      player.
                    </small>
                  </>
                )}
              </div>
            )}

            {cardRevealed && (
              <button
                className="game-button"
                onClick={finishReveal}
              >
                {revealIndex ===
                cleanNames.length - 1
                  ? "Start Clue Round"
                  : "Hide & Pass"}
              </button>
            )}
          </div>
        </section>
      )}

      {stage === "clues" && game && (
        <section className="game-grid two">
          <div className="game-card">
            <span className="step">
              CLUE ROUND
            </span>

            <h2>Give your clues</h2>

            <p>
              Go around the group. Each person gives
              one short clue about the secret footballer.
            </p>

            <div className="clue-rule-list">
              {cleanNames.map((name, index) => (
                <div
                  className="clue-player"
                  key={name}
                >
                  <strong>{index + 1}</strong>
                  <span>{name}</span>
                  <em>✓</em>
                </div>
              ))}
            </div>

            <button
              className="game-button"
              onClick={() =>
                setStage("voting")
              }
            >
              Start Voting
            </button>
          </div>

          <div className="game-card">
            <span className="step">
              SECRET
            </span>

            <h2>Keep the answer hidden</h2>

            <p>
              The imposters are trying to work out
              who everyone is talking about.
            </p>

            <div className="secret-box compact">
              <strong>Category</strong>
              <span>{game.category}</span>
            </div>
          </div>
        </section>
      )}

      {stage === "voting" && game && (
        <section className="game-grid">
          <div className="game-card wide">
            <span className="step">
              VOTING · {voterIndex + 1}/
              {cleanNames.length}
            </span>

            <h2>
              {cleanNames[voterIndex]},
              {" "}
              who are the imposters?
            </h2>

            <p>
              Choose exactly{" "}
              <strong>
                {game.imposters.length}
              </strong>{" "}
              different player
              {game.imposters.length > 1
                ? "s"
                : ""}.
            </p>

            <p>
              Selected:{" "}
              <strong>
                {selectedVotes.length}/
                {game.imposters.length}
              </strong>
            </p>

            <div className="vote-grid imposter-votes">
              {cleanNames.map((name, index) => {
                const isSelected =
                  selectedVotes.includes(index);

                return (
                  <button
                    key={name}
                    className={
                      isSelected
                        ? "vote-option selected"
                        : "vote-option"
                    }
                    onClick={() =>
                      toggleVote(index)
                    }
                    disabled={
                      index === voterIndex
                    }
                  >
                    <strong>{name}</strong>

                    <span>
                      {index === voterIndex
                        ? "You"
                        : isSelected
                        ? "Selected ✓"
                        : "Vote"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="vote-submit-area">
              <button
                className="game-button"
                onClick={submitVotes}
                disabled={
                  selectedVotes.length !==
                  game.imposters.length
                }
              >
                {voterIndex ===
                cleanNames.length - 1
                  ? "Submit Final Votes"
                  : "Submit Votes"}
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "finalGuess" && game && (
        <section className="game-grid">
          <div className="game-card wide reveal-card">
            <span className="step">
              ALL IMPOSTERS CAUGHT!
            </span>

            <h2>
              You were voted the imposter
              {game.imposters.length > 1
                ? "s"
                : ""}
            </h2>

            <p>
              All the imposters were caught!
              One last chance — guess the secret
              footballer to steal the win.
            </p>

            <div className="secret-box compact">
              <input
                value={finalGuess}
                onChange={(e) =>
                  setFinalGuess(
                    e.target.value
                  )
                }
                placeholder="Guess the footballer's name"
              />
            </div>

            <button
              className="game-button"
              onClick={submitFinalGuess}
              disabled={!finalGuess.trim()}
            >
              Submit Guess
            </button>
          </div>
        </section>
      )}

      {stage === "results" && game && (
        <section className="game-grid two">
          <div className="game-card">
            <span className="step">
              RESULTS
            </span>

            <h2>The votes are in</h2>

            <div className="results">
              {cleanNames
                .map((name, index) => ({
                  name,
                  index,
                  count: votes[index] || 0
                }))
                .sort(
                  (a, b) =>
                    b.count - a.count
                )
                .map((item, index) => (
                  <div
                    className="result-row"
                    key={item.name}
                  >
                    <strong>
                      #{index + 1}
                    </strong>

                    <span>
                      {item.name}
                    </span>

                    <b>
                      {item.count} vote
                      {item.count === 1
                        ? ""
                        : "s"}
                    </b>
                  </div>
                ))}
            </div>
          </div>

          <div className="game-card">
            <span className="step">
              REVEAL
            </span>

            <h2>
              The hidden players
            </h2>

            <div className="secret-box">
              <strong
                className={
                  outcome === "imposter"
                    ? "outcome-imposter"
                    : "outcome-crew"
                }
              >
                {outcome === "imposter"
                  ? "🕵️ Imposter Wins!"
                  : "🛡️ Crew Wins!"}
              </strong>

              <span>
                The secret footballer was{" "}
                {game.secret}.
              </span>

              {caughtImposters.length > 0 && (
                <small>
                  Caught imposter
                  {caughtImposters.length > 1
                    ? "s"
                    : ""}:{" "}
                  {caughtImposters
                    .map(
                      (index) =>
                        cleanNames[index]
                    )
                    .join(", ")}
                </small>
              )}

              {escapedImposters.length > 0 && (
                <small>
                  Escaped imposter
                  {escapedImposters.length > 1
                    ? "s"
                    : ""}:{" "}
                  {escapedImposters
                    .map(
                      (index) =>
                        cleanNames[index]
                    )
                    .join(", ")}
                </small>
              )}

              {finalGuess.trim() && (
                <small>
                  Final guess: "
                  {finalGuess.trim()}" —{" "}
                  {outcome === "imposter"
                    ? "correct, nice steal 😈"
                    : "not quite"}
                </small>
              )}
            </div>

            <button
              className="game-button secondary"
              onClick={reset}
            >
              Play Again
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default FootballImposter;
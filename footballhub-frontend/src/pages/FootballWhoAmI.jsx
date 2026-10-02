import { useMemo, useState } from "react";
import "./GamePages.css";

const FOOTBALLERS = [
  "Lionel Messi","Cristiano Ronaldo","Kylian Mbappe","Erling Haaland","Vinicius Junior",
  "Jude Bellingham","Mohamed Salah","Lamine Yamal","Neymar","Harry Kane",
  "Robert Lewandowski","Kevin De Bruyne","Son Heung-min","Rodri","Ousmane Dembele",
  "Victor Osimhen","Phil Foden","Virgil van Dijk","Luka Modric","Antoine Griezmann",
  "Raphinha","Pedri","Bukayo Saka","Cole Palmer","Bruno Fernandes","Frenkie de Jong",
  "Khvicha Kvaratskhelia","Rafael Leao","Lautaro Martinez","Federico Valverde",
  "Jamal Musiala","Florian Wirtz","Joshua Kimmich","Thibaut Courtois","Jan Oblak",
  "Mike Maignan","Achraf Hakimi","Alphonso Davies","Antonio Rudiger","Marquinhos",
  "Christian Pulisic","Romelu Lukaku","Martin Odegaard","Declan Rice","William Saliba",
  "Trent Alexander-Arnold","Andrew Robertson","Alisson","Bernardo Silva","Ruben Dias",
  "John Stones","Kyle Walker","Gabriel Magalhaes","Gabriel Martinelli","Alexander Isak",
  "Bruno Guimaraes","Anthony Gordon","James Maddison","Dominic Solanke","Darwin Nunez",
  "Luis Diaz","Diogo Jota","Enzo Fernandez","Moises Caicedo","Nicolas Jackson",
  "Marc Cucurella","Reece James","Emiliano Martinez","Kai Havertz","Gabriel Jesus",
  "Marcus Rashford","Mason Mount","Casemiro","Christian Eriksen","Lisandro Martinez",
  "Matheus Cunha","Michael Olise","Lucas Paqueta","Richarlison","Pedro Neto",
  "Jack Grealish","Jordan Pickford","Paulo Dybala","Sandro Tonali","Nicolo Barella",
  "Eduardo Camavinga","Aurelien Tchouameni","Arda Guler","Joao Felix","Joao Cancelo",
  "Gavi","Dani Olmo","Rodrygo","Brahim Diaz","Eder Militao","Theo Hernandez",
  "Dusan Vlahovic","Victor Boniface","Benjamin Sesko","Serge Gnabry","Leroy Sane",
  "Kingsley Coman","Karim Benzema","Sadio Mane","N'Golo Kante","Toni Kroos",
  "Sergio Ramos","Thiago Silva","Angel Di Maria","Luis Suarez",

  "Pele","Diego Maradona","Johan Cruyff","Franz Beckenbauer","Zinedine Zidane",
  "Ronaldo Nazario","Ronaldinho","Michel Platini","George Best","Garrincha",
  "Eusebio","Ferenc Puskas","Marco van Basten","Ruud Gullit","Bobby Charlton",
  "Cafu","Roberto Carlos","Rivaldo","Romario","Kaka","Dani Alves","Zico",
  "Xavi Hernandez","Andres Iniesta","Carles Puyol","Sergio Busquets","David Villa",
  "Samuel Eto'o","Patrick Kluivert","Xabi Alonso","Iker Casillas","Fernando Torres",
  "Thierry Henry","Wayne Rooney","Steven Gerrard","Frank Lampard","Paul Scholes",
  "Ryan Giggs","David Beckham","John Terry","Rio Ferdinand","Nemanja Vidic",
  "Ashley Cole","Peter Schmeichel","Alan Shearer","Eric Cantona","Dennis Bergkamp",
  "Patrick Vieira","Didier Drogba","Sergio Aguero","Yaya Toure","Vincent Kompany",
  "Cesc Fabregas","Michael Essien","Robin van Persie","Petr Cech","Paolo Maldini",
  "Andrea Pirlo","Francesco Totti","Alessandro Del Piero","Fabio Cannavaro",
  "Gianluigi Buffon","Franco Baresi","Roberto Baggio","Filippo Inzaghi",
  "Gennaro Gattuso","Luis Figo","Zlatan Ibrahimovic","Arjen Robben","Franck Ribery",
  "Wesley Sneijder","Clarence Seedorf","Michael Ballack","Miroslav Klose",
  "Andriy Shevchenko","Pavel Nedved","Ruud van Nistelrooy","Edgar Davids",
  "Javier Zanetti","Hernan Crespo","Gabriel Batistuta","Diego Forlan"
];

const DIFFICULTIES = {
  Easy: {
    wrongGuesses: 3,
    cards: ["🟨", "🟨", "🟥"],
    description: "You get 3 incorrect guesses before elimination."
  },
  Medium: {
    wrongGuesses: 2,
    cards: ["🟨", "🟥"],
    description: "You get 2 incorrect guesses before elimination."
  },
  Hard: {
    wrongGuesses: 1,
    cards: ["🟥"],
    description: "One wrong guess and you're eliminated."
  }
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function FootballWhoAmI() {
  const [names, setNames] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4"
  ]);

  const [difficulty, setDifficulty] = useState("Easy");
  const [game, setGame] = useState(null);
  const [stage, setStage] = useState("setup");

  const [revealIndex, setRevealIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);

  const [guessIndex, setGuessIndex] = useState(0);
  const [guess, setGuess] = useState("");

  const [finishOrder, setFinishOrder] = useState([]);
  const [error, setError] = useState("");

  const cleanNames = useMemo(
    () =>
      names.map(
        (name, index) => name.trim() || `Player ${index + 1}`
      ),
    [names]
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
    if (names.length <= 2) return;

    setNames((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function startGame() {
    if (cleanNames.length < 2) {
      setError("You need at least 2 players.");
      return;
    }

    const lowerNames = cleanNames.map((name) =>
      name.toLowerCase()
    );

    if (new Set(lowerNames).size !== cleanNames.length) {
      setError("Every player needs a different name.");
      return;
    }

    const shuffledFootballers = shuffle(FOOTBALLERS);

    const assignments = cleanNames.map((name, index) => ({
      playerIndex: index,
      playerName: name,
      footballer: shuffledFootballers[index]
    }));

    const playerStates = assignments.map((player) => ({
      playerIndex: player.playerIndex,
      playerName: player.playerName,
      footballer: player.footballer,
      wrongGuesses: 0,
      eliminated: false,
      correct: false,
      placement: null
    }));

    setGame({
      assignments,
      playerStates,
      difficulty,
      wrongGuessesAllowed: DIFFICULTIES[difficulty].wrongGuesses
    });

    setRevealIndex(0);
    setGuessIndex(0);
    setGuess("");
    setCardRevealed(false);
    setFinishOrder([]);
    setError("");

    setStage("reveal");
  }

  function revealCard() {
    setCardRevealed(true);
  }

  function finishReveal() {
    setCardRevealed(false);

    if (revealIndex < cleanNames.length - 1) {
      setRevealIndex((current) => current + 1);
      return;
    }

    setGuessIndex(0);
    setGuess("");
    setStage("guessing");
  }

  function normaliseGuess(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
  }

  function checkGameFinished(states) {
    const unfinishedPlayers = states.filter(
      (player) =>
        !player.eliminated &&
        !player.correct
    );

    if (unfinishedPlayers.length === 0) {
      setStage("results");
      return true;
    }

    return false;
  }

  function submitGuess() {
    if (!game) return;

    const currentPlayer = game.playerStates[guessIndex];

    if (!currentPlayer) return;

    if (
      currentPlayer.eliminated ||
      currentPlayer.correct
    ) {
      moveToNextPlayer();
      return;
    }

    if (!guess.trim()) {
      setError("Enter a footballer name.");
      return;
    }

    const correctGuess =
      normaliseGuess(guess) ===
      normaliseGuess(currentPlayer.footballer);

    if (correctGuess) {
      const placement = finishOrder.length + 1;

      const updatedStates = game.playerStates.map(
        (player, index) =>
          index === guessIndex
            ? {
                ...player,
                correct: true,
                placement
              }
            : player
      );

      const updatedFinishOrder = [
        ...finishOrder,
        guessIndex
      ];

      setGame({
        ...game,
        playerStates: updatedStates
      });

      setFinishOrder(updatedFinishOrder);
      setGuess("");
      setError("");

      /*
       * Do NOT end the game here.
       * The player has simply secured their position.
       */
      if (checkGameFinished(updatedStates)) {
        return;
      }

      moveToNextPlayer(updatedStates);
      return;
    }

    const newWrongGuesses =
      currentPlayer.wrongGuesses + 1;

    const eliminated =
      newWrongGuesses >= game.wrongGuessesAllowed;

    const updatedStates = game.playerStates.map(
      (player, index) =>
        index === guessIndex
          ? {
              ...player,
              wrongGuesses: newWrongGuesses,
              eliminated
            }
          : player
    );

    setGame({
      ...game,
      playerStates: updatedStates
    });

    setGuess("");
    setError("");

    if (eliminated) {
      if (checkGameFinished(updatedStates)) {
        return;
      }

      moveToNextPlayer(updatedStates);
      return;
    }

    setError(
      `Wrong footballer! You lost 1 ${
        game.difficulty === "Hard"
          ? "card"
          : "heart"
      }.`
    );
  }

  function moveToNextPlayer(states = game?.playerStates) {
    if (!states) return;

    let nextIndex = -1;

    for (let i = 1; i <= states.length; i++) {
      const index =
        (guessIndex + i) % states.length;

      const player = states[index];

      if (
        !player.eliminated &&
        !player.correct
      ) {
        nextIndex = index;
        break;
      }
    }

    if (nextIndex === -1) {
      setStage("results");
      return;
    }

    setGuessIndex(nextIndex);
    setGuess("");
    setError("");
  }

  function resetGame() {
    setGame(null);
    setStage("setup");
    setRevealIndex(0);
    setGuessIndex(0);
    setGuess("");
    setCardRevealed(false);
    setFinishOrder([]);
    setError("");
  }

  function getRemainingLives(player) {
    if (!game) return [];

    const cards =
      DIFFICULTIES[game.difficulty].cards;

    return cards.slice(player.wrongGuesses);
  }

  function getPlacement(player) {
    if (!player.correct) return null;

    return player.placement;
  }

  return (
    <main className="game-page who-am-i-page">

      <section className="game-hero">
        <div>
          <span className="game-kicker">.WHO AM I?</span>

          <h1>
            Guess the
            <span> Footballer.</span>
          </h1>

          <p>
            Get your secret footballer, make your guesses,
            don't get a red card, and be the first player to
            correctly identify your footballer.
          </p>
        </div>
      </section>


      {stage === "setup" && (
        <section className="game-grid two">

          <div className="game-card">

            <span className="step">01 · PLAYERS</span>

            <h2>Who's playing?</h2>

            <p>
              Enter the names of everyone playing.
            </p>

            <div className="name-list">

              {names.map((name, index) => (
                <div className="name-row" key={index}>

                  <input
                    value={name}
                    onChange={(e) =>
                      updateName(index, e.target.value)
                    }
                    placeholder={`Player ${index + 1}`}
                  />

                  {names.length > 2 && (
                    <button
                      type="button"
                      className="mini-button"
                      onClick={() => removePlayer(index)}
                    >
                      ×
                    </button>
                  )}

                </div>
              ))}

            </div>

            <button
              type="button"
              className="game-button secondary"
              onClick={addPlayer}
              disabled={names.length >= 10}
            >
              + Add Player
            </button>

          </div>


          <div className="game-card">

            <span className="step">02 · DIFFICULTY</span>

            <h2>Choose your difficulty</h2>

            <p>
              The difficulty controls how many wrong guesses
              a player can make before elimination.
            </p>

            <div className="difficulty-list">

              {Object.entries(DIFFICULTIES).map(
                ([level, settings]) => (
                  <button
                    type="button"
                    key={level}
                    className={
                      difficulty === level
                        ? "difficulty-option active"
                        : "difficulty-option"
                    }
                    onClick={() => setDifficulty(level)}
                  >

                    <div>
                      <strong>{level}</strong>

                      <span>
                        {settings.description}
                      </span>
                    </div>

                    <div className="difficulty-cards">
                      {settings.cards.map((card, index) => (
                        <span key={index}>{card}</span>
                      ))}
                    </div>

                  </button>
                )
              )}

            </div>

            <div className="who-am-i-rule-box">

              <strong>How cards work</strong>

              <p>
                Every wrong guess earns a card.
              </p>

              <p>
                If a Red card is gotten then the player is eliminated.
              </p>

              <div className="card-rule-display" />

            </div>

            <button
              type="button"
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
              01 · REVEAL FOOTBALLERS · {revealIndex + 1}/{cleanNames.length}
            </span>

            <h2>
              {cleanNames[revealIndex]}'s footballer
            </h2>

            <p>
              Pass the phone around. Everyone except the
              player whose name is shown should look at the screen.
            </p>

            {!cardRevealed ? (

              <button
                type="button"
                className="who-am-i-hidden-card"
                onClick={revealCard}
              >
                <span>?</span>

                <strong>
                  Tap to reveal footballer
                </strong>

                <small>
                  Only the other players should look.
                </small>
              </button>

            ) : (

              <div className="who-am-i-secret-card">

                <span className="secret-card-label">
                  SECRET FOOTBALLER
                </span>

                <strong>
                  {game.assignments[revealIndex].footballer}
                </strong>

                <small>
                  Remember the footballer.
                  {" "}
                  {cleanNames[revealIndex]} must not see the screen.
                </small>

              </div>

            )}

            {cardRevealed && (
              <button
                type="button"
                className="game-button"
                onClick={finishReveal}
              >
                {revealIndex === cleanNames.length - 1
                  ? "Everyone Has Their Footballer"
                  : "Hide & Pass"}
              </button>
            )}

          </div>

        </section>
      )}


      

      {stage === "guessing" && game && (
        <section className="game-grid">

          <div className="game-card wide">

            <span className="step">
              02 · GUESSING ROUND
            </span>

            <h2>
              Guessing Tabs
            </h2>

            <p>
              Each player has their own tab. Open your turn,
              enter your guess, and see if you can identify
              your secret footballer.
            </p>


            <div className="who-am-i-tabs">

              {game.playerStates.map((player, index) => {

                const active =
                  index === guessIndex &&
                  !player.eliminated &&
                  !player.correct;

                return (
                  <button
                    type="button"
                    key={player.playerName}
                    className={
                      active
                        ? "who-am-i-tab active"
                        : "who-am-i-tab"
                    }
                    onClick={() => {
                      if (
                        !player.eliminated &&
                        !player.correct
                      ) {
                        setGuessIndex(index);
                        setGuess("");
                        setError("");
                      }
                    }}
                    disabled={
                      player.eliminated ||
                      player.correct
                    }
                  >

                    <strong>
                      {player.playerName}
                    </strong>

                    <span>
                      {player.eliminated
                        ? "❌ Eliminated"
                        : player.correct
                          ? `🏅 ${getPlacement(player)}${
                              getPlacement(player) === 1
                                ? "st"
                                : getPlacement(player) === 2
                                  ? "nd"
                                  : getPlacement(player) === 3
                                    ? "rd"
                                    : "th"
                            } Place`
                          : "❤️ " +
                            getRemainingLives(player).length +
                            " left"}
                    </span>

                  </button>
                );
              })}

            </div>


            {game.playerStates[guessIndex] &&
              !game.playerStates[guessIndex].eliminated &&
              !game.playerStates[guessIndex].correct && (
                <div className="who-am-i-guess-panel">

                  <span className="step">
                    {game.playerStates[guessIndex].playerName.toUpperCase()}'S TAB
                  </span>

                  <h2>
                    Who Am I?
                  </h2>

                  <p>
                    Enter the footballer you think you were given.
                  </p>


                  <div className="who-am-i-lives">

                    <strong>Lives:</strong>

                    <span>
                      {DIFFICULTIES[game.difficulty].cards.map(
                        (card, index) => (
                          <span
                            key={index}
                            className={
                              index <
                              game.playerStates[guessIndex].wrongGuesses
                                ? "life-used"
                                : ""
                            }
                          >
                            {card}
                          </span>
                        )
                      )}
                    </span>

                  </div>


                  <input
                    className="who-am-i-guess-input"
                    type="text"
                    value={guess}
                    onChange={(e) => {
                      setGuess(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitGuess();
                      }
                    }}
                    placeholder="Enter your footballer guess..."
                    autoComplete="off"
                  />


                  <button
                    type="button"
                    className="game-button"
                    onClick={submitGuess}
                  >
                    Submit Guess
                  </button>


                  {error && (
                    <div className="game-message error">
                      {error}
                    </div>
                  )}

                </div>
              )}

          </div>

        </section>
      )}


      

      {stage === "results" && game && (
        <section className="game-grid">

          <div className="game-card wide who-am-i-result">

            <span className="step">
              GAME OVER
            </span>

            <div className="winner-icon">
              🏆
            </div>

            <h2>
              Final Results
            </h2>

            <p>
              The game is over. Everyone either guessed their
              footballer or was eliminated.
            </p>


            {finishOrder.length > 0 && (
              <div className="who-am-i-finish-order">

                <h3>🏆 Finishing Order</h3>

                {finishOrder.map((playerIndex, index) => {
                  const player =
                    game.playerStates[playerIndex];

                  return (
                    <div
                      className="who-am-i-finish-row"
                      key={player.playerName}
                    >

                      <strong>
                        {index === 0
                          ? "🥇"
                          : index === 1
                            ? "🥈"
                            : index === 2
                              ? "🥉"
                              : `#${index + 1}`}
                      </strong>

                      <span>
                        {player.playerName}
                      </span>

                      <small>
                        {player.footballer}
                      </small>

                    </div>
                  );
                })}

              </div>
            )}


            <div className="who-am-i-final-players">

              <h3>All Players</h3>

              {game.playerStates.map((player) => (

                <div
                  className="who-am-i-final-player"
                  key={player.playerName}
                >

                  <strong>
                    {player.playerName}
                  </strong>

                  <span>
                    {player.correct
                      ? `🏅 Finished #${player.placement}`
                      : "❌ Eliminated"}
                  </span>

                  <small>
                    Secret: {player.footballer}
                  </small>

                </div>

              ))}

            </div>


            <button
              type="button"
              className="game-button"
              onClick={resetGame}
            >
              Play Again
            </button>

          </div>

        </section>
      )}

    </main>
  );
}

export default FootballWhoAmI;
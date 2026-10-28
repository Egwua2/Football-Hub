import { useEffect, useMemo, useState } from "react";
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
  "Kingsley Coman","Karim Benzema","Sadio Mane","N'Golo Kante","Toni Kroos","Sergio Ramos",
  "Thiago Silva","Angel Di Maria","Luis Suarez","Viktor Gyökeres","Ademola Lookman",
  "Thomas Müller","Ferran Torres","Nico Williams","Marcus Thuram","Alejandro Garnacho",
  "Rasmus Højlund","Cody Gakpo","Ollie Watkins","Jarrod Bowen","Artem Dovbyk",
  "Randal Kolo Muani","Christopher Nkunku","Josko Gvardiol","Alexis Mac Allister",
  "Dominik Szoboszlai","Kobbie Mainoo","Vitinha","Granit Xhaka","Mateo Kovačić",
  "Hakan Çalhanoğlu","Eberechi Eze","João Palhinha","Rúben Neves","Warren Zaïre-Emery",
  "Manuel Neuer","Ederson","David Raya","Matthijs de Ligt","Dayot Upamecano",
  "Kim Min-jae","Jules Koundé","Ronald Araújo","Alessandro Bastoni","Benjamin Pavard",
  "Federico Dimarco","Yann Sommer","Ilkay Gundogan","Raheem Sterling","Jadon Sancho",
  "Riyad Mahrez","Pierre-Emerick Aubameyang",

  "Pele","Diego Maradona","Johan Cruyff","Franz Beckenbauer","Zinedine Zidane",
  "Ronaldo Nazario","Ronaldinho","Michel Platini","George Best","Garrincha",
  "Eusebio","Ferenc Puskas","Marco van Basten","Ruud Gullit","Bobby Charlton",
  "Cafu","Roberto Carlos","Rivaldo","Romario","Kaka","Dani Alves","Zico","Marcelo",
  "Xavi Hernandez","Andres Iniesta","Carles Puyol","Gerard Pique","Sergio Busquets",
  "David Villa","David Silva","Samuel Eto'o","Patrick Kluivert","Xabi Alonso",
  "Iker Casillas","Fernando Torres","Thierry Henry","Wayne Rooney","Steven Gerrard",
  "Frank Lampard","Paul Scholes","Ryan Giggs","David Beckham","John Terry",
  "Rio Ferdinand","Nemanja Vidic","Ashley Cole","Peter Schmeichel","Alan Shearer",
  "Eric Cantona","Dennis Bergkamp","Patrick Vieira","Didier Drogba","Sergio Aguero",
  "Yaya Toure","Vincent Kompany","Cesc Fabregas","Michael Essien","Robin van Persie",
  "Petr Cech","Paolo Maldini","Andrea Pirlo","Francesco Totti","Alessandro Del Piero",
  "Fabio Cannavaro","Gianluigi Buffon","Franco Baresi","Roberto Baggio","Filippo Inzaghi",
  "Gennaro Gattuso","Luis Figo","Zlatan Ibrahimovic","Arjen Robben","Franck Ribery",
  "Wesley Sneijder","Clarence Seedorf","Michael Ballack","Miroslav Klose",
  "Andriy Shevchenko","Pavel Nedved","Ruud van Nistelrooy","Edgar Davids",
  "Javier Zanetti","Hernan Crespo","Gabriel Batistuta","Diego Forlan",
  "Alfredo Di Stéfano","Lev Yashin","Gerd Müller","Bobby Moore","Lothar Matthäus",
  "Sócrates","Karl-Heinz Rummenigge","Oliver Kahn","George Weah","Hristo Stoichkov",
  "Michael Laudrup","Frank Rijkaard","Ronald Koeman","Gordon Banks","Gary Lineker",
  "Kenny Dalglish","Alessandro Nesta","Mario Kempes","David Trezeguet","Lilian Thuram",
  "Michael Owen","Paul Gascoigne","Edinson Cavani","James Rodriguez","Radamel Falcao",
  "Gonzalo Higuain","Carlos Tevez","Javier Hernandez","Alexis Sanchez","Arturo Vidal",
  "Hugo Lloris","Raphael Varane","Olivier Giroud","Marcel Desailly","Laurent Blanc",
  "Ian Wright","Peter Crouch","Gianluca Vialli","Diego Costa","Mario Balotelli",
  "Mario Gotze","Mesut Ozil","Bastian Schweinsteiger","Philipp Lahm","Edwin van der Sar",
  "Paolo Rossi","Marco Materazzi","Gianfranco Zola","Robbie Fowler"
];

const DIFFICULTIES = {
  Easy: {
    wrongGuesses: 3,
    cards: ["🟨", "🟨", "🟥"],
    description: "Two yellow cards, then a red card (3 wrong guesses)."
  },
  Medium: {
    wrongGuesses: 2,
    cards: ["🟨", "🟥"],
    description: "A yellow card, then a red card (2 wrong guesses)."
  },
  Hard: {
    wrongGuesses: 1,
    cards: ["🟥"],
    description: "One wrong guess earns a red card and eliminates you."
  }
};

const GAME_MODES = {
  Classic: {
    description: "Take turns guessing until everyone is correct or eliminated."
  },
  Timer: {
    description: "Play multiple rounds. There is one overall winner: the player with the lowest cumulative time. Using all 3 guesses adds a 3-minute penalty to that round."
  }
};


function shuffle(items) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getOrdinal(number) {
  if (number === 1) return "1st";
  if (number === 2) return "2nd";
  if (number === 3) return "3rd";
  return `${number}th`;
}

function FootballWhoAmI() {
  const [names, setNames] = useState(["", "", "", ""]);

  const [difficulty, setDifficulty] = useState("Easy");
  const [gameMode, setGameMode] = useState("Classic");
  const [roundCount, setRoundCount] = useState(7);
  const [game, setGame] = useState(null);
  const [stage, setStage] = useState("setup");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  const [revealIndex, setRevealIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);

  const [guessIndex, setGuessIndex] = useState(0);
  const [guess, setGuess] = useState("");

  const [finishOrder, setFinishOrder] = useState([]);
  const [error, setError] = useState("");

  const cleanNames = useMemo(
    () => names.map((name) => name.trim()),
    [names]
  );

  useEffect(() => {
    if (!timerRunning || stage !== "guessing" || game?.mode !== "Timer") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((currentTime) => Math.max(0, currentTime - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning, stage, game?.mode]);

  useEffect(() => {
    function handleSpacebar(event) {
      if (event.code !== "Space") return;

      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (isTyping || stage !== "guessing" || game?.mode !== "Timer") {
        return;
      }

      event.preventDefault();
      setTimerRunning((running) => !running);
    }

    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [stage, game?.mode]);

  function updateName(index, value) {
    setNames((current) =>
      current.map((name, i) =>
        i === index ? value : name
      )
    );
  }

  function addPlayer() {
    if (names.length >= 10) return;

    setNames((current) => [...current, ""]);
  }

  function removePlayer(index) {
    if (names.length <= 2) return;

    setNames((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function startGame() {
    if (cleanNames.some((name) => !name)) {
      setError("Please enter a name for every player.");
      return;
    }

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

    const roundsToPlay = gameMode === "Timer" ? roundCount : 1;
    const shuffledFootballers = shuffle(FOOTBALLERS);
    const roundAssignments = Array.from({ length: roundsToPlay }, (_, roundIndex) => {
      const start = roundIndex * cleanNames.length;
      const roundFootballers = shuffledFootballers.slice(start, start + cleanNames.length);

      return cleanNames.map((name, index) => ({
        playerIndex: index,
        playerName: name,
        footballer: roundFootballers[index]
      }));
    });

    function makePlayerStates(assignments) {
      return assignments.map((player) => ({
        playerIndex: player.playerIndex,
        playerName: player.playerName,
        footballer: player.footballer,
        wrongGuesses: 0,
        eliminated: false,
        timedOut: false,
        correct: false,
        placement: null,
        timeUsedSeconds: null
      }));
    }

    const assignments = roundAssignments[0];
    const playerStates = makePlayerStates(assignments);

    setGame({
      assignments,
      playerStates,
      roundAssignments,
      roundHistory: [],
      roundNumber: 1,
      totalRounds: roundsToPlay,
      difficulty,
      mode: gameMode,
      wrongGuessesAllowed: DIFFICULTIES[difficulty].wrongGuesses
    });

    setRevealIndex(0);
    setGuessIndex(0);
    setGuess("");
    setCardRevealed(false);
    setFinishOrder([]);
    setTimerRunning(false);
    setTimeLeft(180);
    setError("");

    setStage("reveal");
  }

  function revealCard() {
    setCardRevealed(true);
  }

  function finishReveal() {
    setCardRevealed(false);

    if (game?.mode === "Timer") {
      setGuessIndex(revealIndex);
      setGuess("");
      setError("");
      setTimeLeft(180);
      setTimerRunning(true);
      setStage("guessing");
      return;
    }

    if (revealIndex < cleanNames.length - 1) {
      setRevealIndex((current) => current + 1);
      return;
    }

    setGuessIndex(0);
    setGuess("");
    setTimerRunning(false);
    setTimeLeft(180);
    setStage("guessing");
  }

  function normaliseGuess(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
  }

  function checkGameFinished(states) {
    // Timer Mode ends after all configured rounds, not when one round is complete.
    if (game?.mode === "Timer") return false;

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

    if (game.mode === "Timer" && !timerRunning) {
      setError("Start the timer before submitting your guess.");
      return;
    }

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
      const timeUsedSeconds =
        game.mode === "Timer" ? Math.max(0, 180 - timeLeft) : null;
      let updatedStates = game.playerStates.map(
        (player, index) =>
          index === guessIndex
            ? {
                ...player,
                correct: true,
                timeUsedSeconds,
                placement: game.mode === "Timer" ? null : finishOrder.length + 1
              }
            : player
      );

      let updatedFinishOrder;
      if (game.mode === "Timer") {
        updatedFinishOrder = updatedStates
          .map((player, index) => ({ player, index }))
          .filter(({ player }) => player.correct)
          .sort(
            (a, b) =>
              a.player.timeUsedSeconds - b.player.timeUsedSeconds ||
              a.player.wrongGuesses - b.player.wrongGuesses ||
              a.index - b.index
          )
          .map(({ index }) => index);

        updatedStates = updatedStates.map((player, index) => ({
          ...player,
          placement: player.correct
            ? updatedFinishOrder.indexOf(index) + 1
            : null
        }));
      } else {
        updatedFinishOrder = [...finishOrder, guessIndex];
      }

      setGame({
        ...game,
        playerStates: updatedStates
      });

      setFinishOrder(updatedFinishOrder);
      setGuess("");
      setError("");

      if (game.mode === "Timer") {
        setTimerRunning(false);
        setTimeLeft(180);
      }

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
    const cardReceived =
      DIFFICULTIES[game.difficulty].cards[newWrongGuesses - 1] || "🟥";

    const updatedStates = game.playerStates.map(
      (player, index) =>
        index === guessIndex
          ? {
              ...player,
              wrongGuesses: newWrongGuesses,
              eliminated,
              timeUsedSeconds:
                game.mode === "Timer" && eliminated
                  ? newWrongGuesses >= 3
                    ? Math.max(0, 180 - timeLeft) + 180
                    : 180
                  : player.timeUsedSeconds
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
      if (game.mode === "Timer") {
        setTimerRunning(false);
        setTimeLeft(180);
      }

      if (checkGameFinished(updatedStates)) {
        return;
      }

      moveToNextPlayer(updatedStates);
      return;
    }

    setError(
      `Wrong footballer! You received a ${
        cardReceived === "🟥" ? "red card" : "yellow card"
      }.`
    );
  }

  function moveToNextPlayer(states = game?.playerStates) {
    if (!states) return;

    if (game?.mode === "Timer") {
      const nextIndex = guessIndex + 1;

      if (nextIndex < states.length) {
        setGame({ ...game, playerStates: states });
        setGuessIndex(nextIndex);
        setGuess("");
        setError("");
        setTimerRunning(false);
        setTimeLeft(180);
        setRevealIndex(nextIndex);
        setCardRevealed(false);
        setStage("reveal");
        return;
      }

      finishTimerRound(states);
      return;
    }

    let nextIndex = -1;

    if (game?.mode !== "Timer") {
      for (let i = 1; i <= states.length; i++) {
        const index = (guessIndex + i) % states.length;
        const player = states[index];

        if (!player.eliminated && !player.correct) {
          nextIndex = index;
          break;
        }
      }
    }

    if (nextIndex === -1) {
      setTimerRunning(false);
      setStage("results");
      return;
    }

    setGuessIndex(nextIndex);
    setGuess("");
    setError("");
  }

  function finishTimerRound(states = game?.playerStates) {
    if (!game || game.mode !== "Timer" || !states) return;

    const settledStates = states.map((player) => ({
      ...player,
      timeUsedSeconds: player.timeUsedSeconds ?? 180
    }));

    const roundFinishOrder = settledStates
      .map((player, index) => ({ player, index }))
      .filter(({ player }) => player.correct)
      .sort(
        (a, b) =>
          a.player.timeUsedSeconds - b.player.timeUsedSeconds ||
          a.player.wrongGuesses - b.player.wrongGuesses ||
          a.index - b.index
      )
      .map(({ index }) => index);

    const rankedStates = settledStates.map((player, index) => ({
      ...player,
      placement: player.correct
        ? roundFinishOrder.indexOf(index) + 1
        : null
    }));

    const winner = roundFinishOrder.length > 0
      ? rankedStates[roundFinishOrder[0]]
      : null;

    const roundRecord = {
      roundNumber: game.roundNumber,
      winnerPlayerIndex: winner?.playerIndex ?? null,
      winnerPlayerName: winner?.playerName ?? null,
      results: rankedStates.map((player) => ({
        playerIndex: player.playerIndex,
        playerName: player.playerName,
        footballer: player.footballer,
        correct: player.correct,
        eliminated: player.eliminated,
        timedOut: player.timedOut,
        wrongGuesses: player.wrongGuesses,
        placement: player.placement,
        timeUsedSeconds: player.timeUsedSeconds
      }))
    };

    const updatedHistory = [...(game.roundHistory || []), roundRecord];
    const updatedGame = {
      ...game,
      playerStates: rankedStates,
      roundHistory: updatedHistory
    };

    setTimerRunning(false);
    setTimeLeft(180);
    setFinishOrder(roundFinishOrder);
    setGuess("");
    setError("");

    if (game.roundNumber >= game.totalRounds) {
      setGame(updatedGame);
      setStage("results");
      return;
    }

    const nextRoundNumber = game.roundNumber + 1;
    const nextAssignments = game.roundAssignments[nextRoundNumber - 1];
    const nextPlayerStates = nextAssignments.map((player) => ({
      playerIndex: player.playerIndex,
      playerName: player.playerName,
      footballer: player.footballer,
      wrongGuesses: 0,
      eliminated: false,
      timedOut: false,
      correct: false,
      placement: null,
      timeUsedSeconds: null
    }));

    setGame({
      ...updatedGame,
      roundNumber: nextRoundNumber,
      assignments: nextAssignments,
      playerStates: nextPlayerStates
    });
    setFinishOrder([]);
    setRevealIndex(0);
    setGuessIndex(0);
    setCardRevealed(false);
    setStage("reveal");
  }

  function toggleTimer() {
    if (!game || game.mode !== "Timer" || stage !== "guessing" || timeLeft <= 0) {
      return;
    }

    setTimerRunning((running) => !running);
  }

  function finishTimerTurn() {
    if (!game || game.mode !== "Timer" || !timerRunning) return;

    const currentPlayer = game.playerStates[guessIndex];
    if (!currentPlayer || currentPlayer.correct || currentPlayer.eliminated) {
      setTimerRunning(false);
      return;
    }

    const updatedStates = game.playerStates.map((player, index) =>
      index === guessIndex
        ? {
            ...player,
            eliminated: true,
            timedOut: true,
            timeUsedSeconds: 180
          }
        : player
    );

    setGame({ ...game, playerStates: updatedStates });
    setTimerRunning(false);
    setTimeLeft(180);
    setGuess("");
    setError(`${currentPlayer.playerName}'s time is up.`);

    if (checkGameFinished(updatedStates)) {
      return;
    }

    moveToNextPlayer(updatedStates);
  }

  function resetGame() {
    setGame(null);
    setStage("setup");
    setRevealIndex(0);
    setGuessIndex(0);
    setGuess("");
    setCardRevealed(false);
    setFinishOrder([]);
    setTimerRunning(false);
    setTimeLeft(180);
    setError("");
  }

  function getWarnings(player) {
    if (!game || player.wrongGuesses === 0) return [];

    return DIFFICULTIES[game.difficulty].cards.slice(0, player.wrongGuesses);
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds ?? 180));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function getPlacement(player) {
    if (!player.correct) return null;

    return player.placement;
  }

  useEffect(() => {
    if (
      stage !== "guessing" ||
      game?.mode !== "Timer" ||
      !timerRunning ||
      timeLeft > 0
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      finishTimerTurn();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // The listed state values cover the state captured by finishTimerTurn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerRunning, stage, game, guessIndex]);

  const timerStandings = game && game.mode === "Timer"
    ? game.playerStates.map((player) => {
        const completedRoundTimes = (game.roundHistory || []).map((round) => {
          const result = round.results.find((entry) => entry.playerIndex === player.playerIndex);
          return result?.timeUsedSeconds ?? null;
        }).filter((seconds) => seconds !== null);

        // During the game, include a finished current-round turn or the running clock.
        // On the results screen every round is already in roundHistory, so nothing is added twice.
        if (stage !== "results") {
          let currentRoundTime = player.timeUsedSeconds;
          if (
            currentRoundTime === null &&
            player.playerIndex === guessIndex &&
            stage === "guessing"
          ) {
            currentRoundTime = Math.max(0, 180 - timeLeft);
          }
          if (currentRoundTime !== null && currentRoundTime !== undefined) {
            completedRoundTimes.push(currentRoundTime);
          }
        }

        return {
          ...player,
          roundTimes: completedRoundTimes,
          cumulativeSeconds: completedRoundTimes.reduce((total, seconds) => total + seconds, 0)
        };
      }).sort((a, b) =>
        a.cumulativeSeconds - b.cumulativeSeconds ||
        a.playerIndex - b.playerIndex
      )
    : [];

  const finalPlayerResults = game
    ? [...game.playerStates].sort((a, b) => {
        if (a.correct && b.correct) {
          return (a.placement ?? Number.MAX_SAFE_INTEGER) -
            (b.placement ?? Number.MAX_SAFE_INTEGER);
        }
        if (a.correct) return -1;
        if (b.correct) return 1;
        if (a.timedOut && !b.timedOut) return -1;
        if (!a.timedOut && b.timedOut) return 1;
        return a.playerIndex - b.playerIndex;
      })
    : [];

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
                    autoComplete="off"
                  />

                  {names.length > 2 && (
                    <button
                      type="button"
                      className="mini-button"
                      onClick={() => removePlayer(index)}
                      aria-label={`Remove player ${index + 1}`}
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
                      <span>{settings.description}</span>
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

            <h3>Choose game mode</h3>

            <div className="difficulty-list">
              {Object.entries(GAME_MODES).map(([modeName, settings]) => (
                <button
                  type="button"
                  key={modeName}
                  className={
                    gameMode === modeName
                      ? "difficulty-option active"
                      : "difficulty-option"
                  }
                  onClick={() => setGameMode(modeName)}
                >
                  <div>
                    <strong>{modeName === "Timer" ? "3-Minute Timer" : "Classic Mode"}</strong>
                    <span>{settings.description}</span>
                  </div>
                  <div className="difficulty-cards">
                    <span>{modeName === "Timer" ? "⏱️" : "⚽"}</span>
                  </div>
                </button>
              ))}
            </div>

            {gameMode === "Timer" && (
              <div style={{ margin: "18px 0", padding: "14px", border: "1px solid rgba(118, 164, 226, 0.28)", borderRadius: "12px" }}>
                <label htmlFor="who-am-i-round-count" style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}>
                  Number of rounds
                </label>
                <input
                  id="who-am-i-round-count"
                  type="number"
                  min="1"
                  max="20"
                  value={roundCount}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setRoundCount(Math.max(1, Math.min(20, Number.isFinite(value) && value ? Math.floor(value) : 1)));
                  }}
                  style={{ width: "110px", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(118, 164, 226, 0.4)", background: "rgba(7, 17, 31, 0.75)", color: "inherit", font: "inherit" }}
                />
                <p style={{ margin: "8px 0 0", fontSize: "0.9rem" }}>
                  Every player gets a new footballer each round. The overall winner is the player with the lowest cumulative time. Using all 3 guesses adds a 3:00 penalty on top of the time used; being eliminated with fewer guesses available or running out of time counts as 3:00 for that round.
                </p>
              </div>
            )}

            <div className="who-am-i-rule-box">
              <strong>How warnings work</strong>

              <p>
                Everyone starts with a clean sheet. Each wrong guess gives you a card.
              </p>

              <p>
                The cards depend on difficulty. A red card eliminates the player.
              </p>

              <div className="card-rule-display">🟨 → 🟨 → 🟥</div>
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
              {game.mode === "Timer"
                ? `ROUND ${game.roundNumber}/${game.totalRounds} · REVEAL FOOTBALLERS · ${revealIndex + 1}/${game.playerStates.length}`
                : `01 · REVEAL FOOTBALLERS · ${revealIndex + 1}/${cleanNames.length}`}
            </span>

            <h2>
              {cleanNames[revealIndex]}'s footballer
            </h2>

            <p>
              {game.mode === "Timer"
                ? `Round ${game.roundNumber} of ${game.totalRounds}: show this footballer to the group only. Once the card is hidden, this player's 3-minute timer starts.`
                : "Pass the phone around. Everyone except the player whose name is shown should look at the screen."}
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
                  Remember the footballer.{" "}
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
                {game.mode === "Timer"
                  ? "Hide & Start Timer"
                  : revealIndex === cleanNames.length - 1
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
              {game.mode === "Timer"
                ? `ROUND ${game.roundNumber}/${game.totalRounds} · TIMED TURNS`
                : "02 · GUESSING ROUND"}
            </span>

            <h2>{game.mode === "Timer" ? "Timed Turns" : "Guessing Tabs"}</h2>

            <p>
              {game.mode === "Timer"
                ? "Each player gets up to 3 minutes per round. Your total time is added across all rounds, and the player with the lowest overall time wins. Using all allowed wrong guesses or running out of time counts as 3:00 for that round."
                : "Each player has their own tab. Open your turn, enter your guess, and see if you can identify your secret footballer."}
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
                      if (game.mode === "Timer") return;
                      if (!player.eliminated && !player.correct) {
                        setGuessIndex(index);
                        setGuess("");
                        setError("");
                      }
                    }}
                    disabled={
                      player.eliminated ||
                      player.correct ||
                      (game.mode === "Timer" && index !== guessIndex)
                    }
                  >
                    <strong>{player.playerName}</strong>

                    <span>
                      {player.timedOut
                        ? "⏱️ Time Up"
                        : player.correct
                          ? `🏅 ${getPlacement(player)}${
                              getPlacement(player) === 1
                                ? "st"
                                : getPlacement(player) === 2
                                  ? "nd"
                                  : getPlacement(player) === 3
                                    ? "rd"
                                    : "th"
                            } Place${game.mode === "Timer" && player.timeUsedSeconds != null ? ` · ${formatTime(player.timeUsedSeconds)}` : ""}`
                          : player.wrongGuesses === 0
                            ? "✅ Clean Sheet"
                            : `${getWarnings(player).join(" ")}${player.eliminated ? " · Eliminated" : ""}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {game.mode === "Timer" && (
              <div style={{ marginTop: "22px", padding: "16px", border: "1px solid rgba(118, 164, 226, 0.28)", borderRadius: "14px", background: "rgba(7, 17, 31, 0.34)" }}>
                <div className="who-am-i-section-heading" style={{ marginBottom: "12px" }}>
                  <span>LIVE RECORDS · ROUND {game.roundNumber} OF {game.totalRounds}</span>
                  <h3>Overall Time & Records</h3>
                </div>
                <p style={{ marginTop: 0, fontSize: "0.88rem", opacity: 0.8 }}>
                  There is only one overall winner: the player with the lowest cumulative time after all rounds. Using all 3 guesses adds a 3:00 penalty on top of the time used; being eliminated with fewer guesses available or running out of time counts as 3:00 for that round.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(42px, 0.45fr) minmax(100px, 1.4fr) minmax(105px, 1fr)", gap: "8px", alignItems: "center", fontSize: "0.84rem" }}>
                  <strong style={{ opacity: 0.7 }}>#</strong>
                  <strong style={{ opacity: 0.7 }}>Player</strong>
                  <strong style={{ opacity: 0.7 }}>Cumulative time</strong>
                  {timerStandings.map((player, index) => (
                    <div key={player.playerName} style={{ display: "contents" }}>
                      <span style={{ color: index === 0 ? "#ffdb70" : "inherit", fontWeight: 800 }}>{index + 1}</span>
                      <strong>{player.playerName}</strong>
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTime(player.cumulativeSeconds)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {game.playerStates[guessIndex] &&
              !game.playerStates[guessIndex].eliminated &&
              !game.playerStates[guessIndex].correct && (
                <div className="who-am-i-guess-panel">
                  <span className="step">
                    {game.playerStates[guessIndex].playerName.toUpperCase()}'S TAB
                  </span>

                  <h2>Who Am I?</h2>

                  <p>
                    Enter the footballer you think you were given.
                  </p>

                  <div className="who-am-i-lives">
                    <strong>Warnings:</strong>
                    <span>
                      {game.playerStates[guessIndex].wrongGuesses === 0 ? (
                        <span>✅ Clean Sheet</span>
                      ) : (
                        getWarnings(game.playerStates[guessIndex]).map((card, index) => (
                          <span key={index}>
                            {card} {card === "🟥" ? "Red Card" : "Yellow Card"}
                          </span>
                        ))
                      )}
                    </span>
                  </div>

                  {game.mode === "Timer" && (
                    <div
                      className="who-am-i-lives"
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "16px"
                      }}
                    >
                      <div>
                        <strong>Time left</strong>
                        <span
                          style={{
                            display: "block",
                            fontSize: "1.8rem",
                            fontWeight: 800,
                            fontVariantNumeric: "tabular-nums",
                            color: timeLeft <= 30 ? "#ef4444" : "inherit"
                          }}
                        >
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="game-button secondary"
                        onClick={toggleTimer}
                        disabled={timeLeft <= 0}
                      >
                        {timerRunning ? "Pause Timer (Space)" : "Start Timer (Space)"}
                      </button>
                      <small>Spacebar starts or pauses the timer when you are not typing in the guess box.</small>
                    </div>
                  )}

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
            <div className="who-am-i-result-header">
              <span className="who-am-i-result-kicker">
                FULL TIME · WHO AM I?
              </span>

              <div className="winner-icon">🏆</div>

              <h2>Final Results</h2>

              <p>
                {game.mode === "Timer"
                  ? `Completed ${game.totalRounds} rounds. The player with the lowest cumulative time is the overall winner.`
                  : "The game is over. Here is how everyone finished."}
              </p>
            </div>

            {game.mode === "Timer" ? (
              <div
                className="who-am-i-winner-card"
                style={{
                  border: "1.5px solid #f4c95d",
                  background: "linear-gradient(135deg, rgba(245, 190, 56, 0.22), rgba(17, 37, 61, 0.98) 72%)",
                  boxShadow: "0 0 0 1px rgba(244, 201, 93, 0.16), 0 12px 32px rgba(0, 0, 0, 0.20)"
                }}
              >
                <span style={{ color: "#ffdb70" }}>🏆 OVERALL WINNER</span>
                <strong>{timerStandings[0].playerName}</strong>
                <small>
                  Lowest overall time · Total: <b>{formatTime(timerStandings[0].cumulativeSeconds)}</b> across {game.totalRounds} rounds
                </small>
              </div>
            ) : finishOrder.length > 0 && (
              <div
                className="who-am-i-winner-card"
                style={{
                  border: "1px solid #f4c95d",
                  background: "linear-gradient(135deg, rgba(245, 190, 56, 0.20), rgba(17, 37, 61, 0.98) 72%)",
                  boxShadow: "0 0 0 1px rgba(244, 201, 93, 0.14), 0 12px 32px rgba(0, 0, 0, 0.20)"
                }}
              >
                <span style={{ color: "#ffdb70" }}>🏆 WINNER</span>
                <strong>{game.playerStates[finishOrder[0]].playerName}</strong>
                <small>
                  Correctly identified <b>{game.playerStates[finishOrder[0]].footballer}</b>
                </small>
              </div>
            )}

            {game.mode !== "Timer" && finishOrder.length > 0 && (
              <div className="who-am-i-finish-order">
                <div className="who-am-i-section-heading">
                  <span>FINAL STANDINGS</span>
                  <h3>Finishing Order</h3>
                </div>

                <div className="who-am-i-podium">
                  {finishOrder.map((playerIndex, index) => {
                    const player = game.playerStates[playerIndex];
                    const podiumClass = index === 0
                      ? "podium-first"
                      : index === 1
                        ? "podium-second"
                        : index === 2
                          ? "podium-third"
                          : "podium-other";

                    return (
                      <div className={`who-am-i-podium-card ${podiumClass}`} key={player.playerName}>
                        <div className="podium-medal">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </div>
                        <strong>{player.playerName}</strong>
                        <span>{player.footballer}</span>
                        <small>{getOrdinal(index + 1)} place</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="who-am-i-final-players">
              <div className="who-am-i-section-heading">
                <span>FULL BREAKDOWN</span>
                <h3>Player Results</h3>
              </div>

              <div className="who-am-i-final-player-list">
                {game.mode === "Timer" ? timerStandings.map((player, index) => (
                  <div
                    className="who-am-i-final-player"
                    key={player.playerName}
                    style={index === 0 ? {
                      border: "1.5px solid #f4c95d",
                      background: "rgba(245, 190, 56, 0.10)",
                      boxShadow: "0 0 0 1px rgba(244, 201, 93, 0.08)"
                    } : undefined}
                  >
                    <div className="final-player-main">
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "62px",
                        padding: "6px 9px",
                        borderRadius: "999px",
                        border: index === 0 ? "1px solid rgba(244, 201, 93, 0.85)" : "1px solid rgba(118, 164, 226, 0.28)",
                        background: index === 0 ? "rgba(245, 190, 56, 0.16)" : "rgba(67, 132, 219, 0.10)",
                        color: index === 0 ? "#ffdb70" : "#91bfff",
                        fontSize: "12px",
                        fontWeight: 800,
                        whiteSpace: "nowrap"
                      }}>
                        {index === 0 ? "🏆 1ST" : getOrdinal(index + 1).toUpperCase()}
                      </span>
                      <strong>{player.playerName}</strong>
                    </div>
                    <div className="final-player-secret">
                      <small>Cumulative time</small>
                      <strong style={{ fontVariantNumeric: "tabular-nums" }}>{formatTime(player.cumulativeSeconds)}</strong>
                      <small>{player.roundTimes.map((seconds, roundIndex) => `Round ${roundIndex + 1}: ${formatTime(seconds)}`).join(" · ")}</small>
                    </div>
                  </div>
                )) : finalPlayerResults.map((player) => (
                  <div
                    className={player.correct ? "who-am-i-final-player correct" : "who-am-i-final-player eliminated"}
                    key={player.playerName}
                    style={player.correct && player.placement === 1 ? {
                      border: "1px solid #f4c95d",
                      background: "rgba(245, 190, 56, 0.10)",
                      boxShadow: "0 0 0 1px rgba(244, 201, 93, 0.08)"
                    } : undefined}
                  >
                    <div className="final-player-main">
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "58px",
                        padding: "6px 9px",
                        borderRadius: "999px",
                        border: player.correct && player.placement === 1 ? "1px solid rgba(244, 201, 93, 0.85)" : "1px solid rgba(118, 164, 226, 0.28)",
                        background: player.correct && player.placement === 1 ? "rgba(245, 190, 56, 0.16)" : "rgba(67, 132, 219, 0.10)",
                        color: player.correct && player.placement === 1 ? "#ffdb70" : player.correct ? "#91bfff" : player.timedOut ? "#f6c75b" : "#f4a5a5",
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "0.03em",
                        whiteSpace: "nowrap"
                      }}>
                        {player.correct ? (player.placement === 1 ? "🥇 1ST" : player.placement === 2 ? "🥈 2ND" : player.placement === 3 ? "🥉 3RD" : getOrdinal(player.placement).toUpperCase()) : player.timedOut ? "TIME UP" : "OUT"}
                      </span>
                      <strong>{player.playerName}</strong>
                      <span>{player.correct ? `Finished ${getOrdinal(player.placement)} place` : player.timedOut ? "⏱️ Time expired" : "🟥 Eliminated"}</span>
                    </div>
                    <div className="final-player-secret">
                      <small>Secret footballer</small>
                      <strong>{player.footballer}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="who-am-i-result-actions">
              <button
                type="button"
                className="game-button"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default FootballWhoAmI;
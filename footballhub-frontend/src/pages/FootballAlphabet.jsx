import { useEffect, useMemo, useState } from "react";
import "./GamePages.css";

// A real footballer whose first name OR surname starts with every letter of
// the alphabet, so answers are actually checked instead of just accepted.
const PLAYERS = [
    "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappe", "Erling Haaland", "Vinicius Junior", "Jude Bellingham",
    "Mohamed Salah", "Lamine Yamal", "Neymar", "Harry Kane", "Robert Lewandowski", "Kevin De Bruyne",
    "Son Heung-min", "Rodri", "Ousmane Dembele", "Victor Osimhen", "Phil Foden", "Virgil van Dijk",
    "Luka Modric", "Antoine Griezmann", "Raphinha", "Pedri", "Bukayo Saka", "Cole Palmer", "Bruno Fernandes",
    "Frenkie de Jong", "Khvicha Kvaratskhelia", "Rafael Leao", "Lautaro Martinez", "Federico Valverde",
    "Jamal Musiala", "Florian Wirtz", "Joshua Kimmich", "Thibaut Courtois", "Jan Oblak", "Mike Maignan",
    "Achraf Hakimi", "Alphonso Davies", "Antonio Rudiger", "Marquinhos", "Christian Pulisic", "Romelu Lukaku",
    "Martin Odegaard", "Declan Rice", "William Saliba", "Trent Alexander-Arnold", "Andrew Robertson", "Alisson",
    "Bernardo Silva", "Ruben Dias", "John Stones", "Kyle Walker", "Gabriel Magalhaes", "Gabriel Martinelli",
    "Alexander Isak", "Bruno Guimaraes", "Anthony Gordon", "Micky van de Ven", "James Maddison", "Dominic Solanke",
    "Darwin Nunez", "Luis Diaz", "Diogo Jota", "Enzo Fernandez", "Moises Caicedo", "Nicolas Jackson",
    "Marc Cucurella", "Reece James", "Malo Gusto", "Emiliano Martinez", "Kai Havertz", "Gabriel Jesus",
    "Marcus Rashford", "Mason Mount", "Casemiro", "Christian Eriksen", "Lisandro Martinez", "Matheus Cunha",
    "Jarrod Bowen", "Eberechi Eze", "Michael Olise", "Morgan Gibbs-White", "Lucas Paqueta", "Richarlison",
    "Pedro Neto", "Ben White", "Conor Gallagher", "Jack Grealish", "Jordan Pickford", "Paulo Dybala",
    "Sandro Tonali", "Nicolo Barella", "Eduardo Camavinga", "Aurelien Tchouameni", "Arda Guler", "Joao Felix",
    "Joao Cancelo", "Gavi", "Dani Olmo", "Rodrygo", "Brahim Diaz", "Eder Militao", "Theo Hernandez",
    "Dusan Vlahovic", "Victor Boniface", "Benjamin Sesko", "Serge Gnabry", "Leroy Sane", "Kingsley Coman",
    "Karim Benzema", "Sadio Mane", "N'Golo Kante", "Toni Kroos", "Sergio Ramos", "Thiago Silva", "Angel Di Maria",
    "Edinson Cavani", "Luis Suarez", "Pele", "Diego Maradona", "Johan Cruyff", "Franz Beckenbauer", "Zinedine Zidane", 
    "Ronaldo Nazario", "Ronaldinho", "Michel Platini", "George Best", "Garrincha", "Eusebio", "Ferenc Puskas", "Marco van Basten",
    "Ruud Gullit", "Bobby Charlton", "Cafu", "Roberto Carlos", "Rivaldo", "Romario", "Kaka", "Dani Alves", "Dunga",
    "Zico", "Xavi Hernandez", "Andres Iniesta", "Carles Puyol", "Sergio Busquets", "David Villa",
    "Samuel Eto'o", "Patrick Kluivert", "Xabi Alonso", "Iker Casillas", "Fernando Torres",
    "Thierry Henry", "Wayne Rooney", "Steven Gerrard", "Frank Lampard", "Paul Scholes", "Ryan Giggs",
    "David Beckham", "John Terry", "Rio Ferdinand", "Nemanja Vidic", "Ashley Cole", "Peter Schmeichel",
    "Alan Shearer", "Eric Cantona", "Dennis Bergkamp", "Patrick Vieira", "Didier Drogba", "Sergio Aguero",
    "Yaya Toure", "Vincent Kompany", "Cesc Fabregas", "Michael Essien", "Robin van Persie", "Petr Cech",
    "Paolo Maldini", "Andrea Pirlo", "Francesco Totti", "Alessandro Del Piero", "Fabio Cannavaro",
    "Gianluigi Buffon", "Franco Baresi", "Roberto Baggio", "Filippo Inzaghi", "Gennaro Gattuso", "Luis Figo",
    "Zlatan Ibrahimovic", "Arjen Robben", "Franck Ribery", "Wesley Sneijder", "Clarence Seedorf", "Michael Ballack",
    "Miroslav Klose", "Andriy Shevchenko", "Pavel Nedved", "Ruud van Nistelrooy", "Edgar Davids", "Javier Zanetti",
    "Hernan Crespo", "Gabriel Batistuta", "Diego Forlan", "Manuel Neuer", "Thomas Müller", "Marco Reus", 
    "Eden Hazard", "Gareth Bale", "Marcelo", "Gerard Pique", "Pepe", "David Silva", "Paul Pogba", "Jordi Alba", 
    "Dani Carvajal", "David Alaba", "Raphael Varane", "Ederson", "Gianluigi Donnarumma", "Josko Gvardiol", 
    "Mateo Kovacic", "Granit Xhaka", "Jeremie Frimpong", "Xavi Simons", "Julian Alvarez", "Raheem Sterling", 
    "Jadon Sancho", "Alejandro Garnacho", "Kobbie Mainoo", "Riyad Mahrez", "Kalidou Koulibaly", "James Rodriguez", 
    "Radamel Falcao", "Arturo Vidal", "Alexis Sanchez", "Thiago Alcantara", "Jules Kounde", "Ibrahima Konate", 
    "Federico Chiesa", "Ciro Immobile", "Kaoru Mitoma", "Min-jae Kim", "Ollie Watkins", "Manuel Akanji", 
    "Nathan Ake", "Leandro Trossard", "Thomas Partey", "Jorginho", "Kieran Trippier", "Olivier Giroud", 
    "Hugo Lloris", "Keylor Navas", "Javier Hernandez", "Clint Dempsey", "Landon Donovan", "Tim Howard", 
    "Alfredo Di Stefano", "Lev Yashin", "Raul", "Lothar Matthäus", "Oliver Kahn", "Philipp Lahm", 
    "Bastian Schweinsteiger", "Hristo Stoichkov", "Gheorghe Hagi", "Hugo Sanchez", "Socrates", "Ian Rush", 
    "Kenny Dalglish", "Ian Wright", "Michael Owen", "Gary Lineker", "Juan Roman Riquelme", "Javier Mascherano", 
    "Carlos Tevez", "Gonzalo Higuain", "Dida", "Julio Cesar", "Maicon", "Lucio", "Alessandro Nesta", 
    "Christian Vieri", "George Weah", "Rene Higuita", "Roger Milla", "Roy Keane", "Claude Makelele", "Sol Campbell", 
    "Tony Adams", "Robbie Fowler", "Nicolas Anelka", "Jamie Vardy", "Kasper Schmeichel", "Kevin Keegan", "Dino Zoff", 
    "Giuseppe Meazza", "Paolo Rossi", "Marco Tardelli", "Daniele De Rossi", "Giorgio Chiellini", "Leonardo Bonucci", 
    "Gianfranco Zola", "Antonio Di Natale", "Juan Sebastian Veron", "Fernando Hierro", "Guti", "Emilio Butragueno", 
    "Francisco Gento", "Luis Enrique", "Ronald Koeman", "Diego Simeone", "Fernando Redondo", "Ivan Rakitic", 
    "Gerd Muller", "Sepp Maier", "Paul Breitner", "Karl-Heinz Rummenigge", "Rudi Voller", "Jurgen Klinsmann", 
    "Matthias Sammer", "Stefan Effenberg", "Jens Lehmann", "Deco", "Rui Costa", "Nuno Gomes", "Pauleta", 
    "Hidetoshi Nakata", "Shunsuke Nakamura", "Keisuke Honda", "Ji-sung Park", "Tim Cahill", "Mark Viduka", 
    "Harry Kewell", "Rafael Marquez", "Claudio Pizarro", "Paolo Guerrero", "Jay-Jay Okocha", "Nwankwo Kanu", 
    "Kolo Toure", "Abedi Pele", "Asamoah Gyan", "Emmanuel Adebayor", "Pierre-Emerick Aubameyang", 
    "Henrik Larsson", "Freddie Ljungberg", "Davor Suker", "Zvonimir Boban", "Dejan Savicevic", 
    "Predrag Mijatovic", "Gheorghe Popescu", "Jose Luis Chilavert", "Jorge Campos", "Cuauhtemoc Blanco", 
    "Fabien Barthez", "Lilian Thuram", "Marcel Desailly", "Laurent Blanc", "Bixente Lizarazu", "David Ginola", 
    "Ivan Toney", "Douglas Luiz", "Leon Bailey", "Cristian Romero", "Dejan Kulusevski", "Destiny Udogie", 
    "Pedro Porro", "Alejandro Balde", "Pau Cubarsi", "Ronald Araujo", "Andreas Christensen", 
    "Marc-Andre ter Stegen", "Ilkay Gundogan", "Dayot Upamecano", "Matthijs de Ligt", "Noussair Mazraoui", 
    "Marcus Thuram", "Hakan Calhanoglu", "Alessandro Bastoni", "Federico Dimarco", "Denzel Dumfries", 
    "Milan Skriniar", "Gianluca Mancini", "Lorenzo Pellegrini", "Alvaro Morata", "Koke", "Memphis Depay", 
    "Wout Weghorst", "Cody Gakpo", "Donyell Malen", "Joao Palhinha", "Matheus Nunes", "Diogo Dalot", 
    "Luke Shaw", "Aaron Wan-Bissaka", "Harry Maguire", "Scott McTominay", "Amadou Onana", "Jarrad Branthwaite", 
    "Jordan Henderson", "Fabinho", "Roberto Firmino", "Naby Keita", "Georginio Wijnaldum", "Xherdan Shaqiri", 
    "Divock Origi", "Dejan Lovren", "Joel Matip", "Joe Gomez", "Cesar Azpilicueta", "Hakim Ziyech", 
    "Timo Werner", "Kepa Arrizabalaga", "Edouard Mendy", "Ben Chilwell", "Trevoh Chalobah", "Levi Colwill", 
    "Aymeric Laporte", "Oleksandr Zinchenko", "Eddie Nketiah", "James Milner", "Gareth Barry", "Jermain Defoe", 
    "Robbie Keane", "Leighton Baines", "Seamus Coleman", "Mark Noble", "James Ward-Prowse", "Yohan Cabaye", 
    "Michu", "Diego Godin", "Jose Gimenez", "Saul Niguez", "Jan Vertonghen", "Toby Alderweireld", "Dries Mertens", 
    "Marek Hamsik", "Lorenzo Insigne", "Ciro Ferrara", "Fabio Grosso", "Stanley Matthews", "Duncan Edwards", 
    "Giuseppe Bergomi", "Gaetano Scirea", "Giacinto Facchetti", "Sandro Mazzola", "Gianni Rivera", "Luigi Riva", 
    "Just Fontaine", "Raymond Kopa", "Jean-Pierre Papin", "Carlos Alberto", "Nilton Santos", "Djalma Santos", 
    "Mario Zagallo", "Rivellino", "Tostao", "Jairzinho", "Leonidas", "Tomas Rosicky", "Sami Hyypia", 
    "Jari Litmanen", "Eidur Gudjohnsen", "Roy Makaay", "Giovane Elber", "Marcelo Salas", "Ivan Zamorano", 
    "Ariel Ortega", "Hakan Sukur", "Ali Daei", "Mehdi Taremi", "Sardar Azmoun", "Warren Zaire-Emery", 
    "Bradley Barcola", "Evan Ferguson", "Rico Lewis", "Oscar Bobb", "Harvey Elliott", "Curtis Jones", "Leny Yoro", 
    "Joao Neves", "Viktor Gyokeres", "Ousmane Diomande", "Antonio Silva", "David Seaman", "Neville Southall", 
    "Claudio Taffarel", "Rogerio Ceni", "Samir Handanovic", "Wojciech Szczesny", "Shay Given", "Brad Friedel", 
    "Jussi Jaaskelainen", "Pablo Zabaleta", "Aleksandar Kolarov", "Nemanja Matic", "Ander Herrera", "Juan Mata", 
    "Santi Cazorla", "Laurent Koscielny", "Per Mertesacker", "Olivier Dacourt","Michael Laudrup", "Brian Laudrup", "Esteban Cambiasso", "Dejan Stankovic", "Walter Samuel", "Ivan Cordoba",
    "Marco Materazzi", "David Trezeguet", "Robert Pires", "Gilberto Silva", "Emmanuel Petit", "Teddy Sheringham",
    "Andy Cole", "Dwight Yorke", "Ole Gunnar Solskjaer", "Matthew Le Tissier", "Paolo Di Canio", "Juninho Paulista",
    "Juninho Pernambucano", "Lucas Moura", "Willian", "Oscar", "Ramires", "Fernandinho", "Fred", "Fabrizio Ravanelli",
    "Gianluca Vialli", "Roberto Mancini", "Enrico Chiesa", "Sinisa Mihajlovic", "Alvaro Recoba", "Carlos Valderrama",
    "Faustino Asprilla", "Freddy Rincon", "Mario Yepes", "Ivan Kaviedes", "Enzo Francescoli", "Paolo Montero",
    "Diego Lugano", "Maxi Rodriguez", "Ezequiel Lavezzi", "Javier Pastore", "Angel Correa", "Rodrigo De Paul",
    "Leandro Paredes", "Giovani Lo Celso", "Nahuel Molina", "Gonzalo Montiel", "Emiliano Buendia", "Nicolas Otamendi",
    "Emanuel Mammana", "Willy Caballero", "Sergio Romero", "Claudio Bravo", "Arturo Vidal", "Gary Medel",
    "Mauricio Isla", "Eduardo Vargas", "Charles Aranguiz", "Juan Arango", "Tomas Rincon", "Salomon Rondon",
    "Nolberto Solano", "Jefferson Farfan", "Carlos Vela", "Andres Guardado", "Hector Herrera", "Guillermo Ochoa",
    "Hirving Lozano", "Jesus Corona", "Jared Borgetti", "Pavel Pardo", "Oswaldo Sanchez", "Rigobert Song",
    "Patrick Mboma", "Geremi Njitap", "Taribo West", "Sunday Oliseh", "Victor Ikpeba", "Obafemi Martins",
    "Taye Taiwo", "Joseph Yobo", "Benni McCarthy", "Steven Pienaar", "Lucas Radebe", "Mark Fish", "Doctor Khumalo",
    "Samuel Kuffour", "Tony Yeboah", "Stephen Appiah", "Sulley Muntari", "Kevin-Prince Boateng", "Kwadwo Asamoah",
    "Thomas Nkono", "Noureddine Naybet", "Mustapha Hadji", "Marouane Chamakh", "Youssef En-Nesyri", "Yassine Bounou",
    "Sofyan Amrabat", "Riyad Mahrez", "Islam Slimani", "Ismael Bennacer", "Seydou Keita", "Frederic Kanoute",
    "Mahamadou Diarra", "Pierre-Emerick Aubameyang", "Serhou Guirassy", "Ademola Lookman", "Lois Openda",
    "Teun Koopmeiners", "Riccardo Calafiori", "Joshua Zirkzee", "Davide Frattesi", "Gianluca Scamacca", 
    "Mateo Retegui", "Giacomo Raspadori", "Manuel Locatelli", "Domenico Berardi", "Adrien Rabiot", "Presnel Kimpembe",
    "Corentin Tolisso", "Lucas Hernandez", "Benjamin Pavard", "Ferland Mendy", "Aurelien Tchouameni", "Isco",
    "Marco Asensio", "Dani Ceballos", "Nacho Fernandez", "Lucas Vazquez", "Marcos Llorente", "Mikel Oyarzabal",
    "Mikel Merino", "Martin Zubimendi", "David Raya", "Unai Simon", "Robert Sanchez", "Inaki Williams",
    "Nico Williams", "Ansu Fati", "Ferran Torres", "Yeremy Pino", "Gerard Moreno", "Borja Iglesias", "Dani Parejo",
    "Jesus Navas", "Sergio Canales", "Raul Albiol", "Pau Torres", "Eric Garcia", "Aymeric Laporte", "Robin Le Normand",
    "Alejandro Grimaldo", "Hector Bellerin", "Kieran Tierney", "Andrew Robertson", "John McGinn", "Scott McTominay",
    "Che Adams", "Lyndon Dykes", "Craig Gordon", "Allan McGregor", "Gareth Bale", "Aaron Ramsey", "Joe Allen",
    "Ben Davies", "Brennan Johnson", "Harry Wilson", "Daniel James", "Kieffer Moore", "Neco Williams", "Wayne Hennessey",
    "Roy Hodgson", "Glenn Hoddle", "Paul Gascoigne", "Chris Waddle", "Bryan Robson", "Terry Butcher", "Peter Shilton",
    "Gordon Banks", "Geoff Hurst", "Martin Peters", "Jimmy Greaves", "Dixie Dean", "Tom Finney", "Nat Lofthouse",
    "John Charles", "Ian Rush", "Neville Southall", "Kevin Ratcliffe", "Gary Speed", "Uwe Seeler", "Fritz Walter",
    "Gunter Netzer", "Wolfgang Overath", "Berti Vogts", "Sepp Herberger", "Helmut Rahn", "Paul Breitner",
    "Karl-Heinz Schnellinger", "Andreas Brehme", "Jurgen Kohler", "Thomas Hassler", "Andreas Moller", "Mario Basler",
    "Oliver Bierhoff", "Carsten Jancker", "Dietmar Hamann", "Jens Jeremies", "Torsten Frings", "Bernd Schneider",
    "Per Mertesacker", "Lukas Podolski", "Mario Gotze", "Andre Schurrle", "Julian Draxler", "Mats Hummels",
    "Jerome Boateng", "Sami Khedira", "Mesut Ozil", "Jonas Hector", "Kevin Volland", "Timo Werner", "Leon Goretzka",
    "Niklas Sule", "Matthias Ginter", "Christian Gunter", "Robin Gosens", "David Raum", "Lukas Klostermann",
    "Jonathan Tah", "Waldemar Anton", "Maximilian Mittelstadt", "Chris Fuhrich", "Deniz Undav", "Niclas Fullkrug"
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

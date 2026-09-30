import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { playerApi, squadApi } from "../services/api";
import PlayerAvatar from "../components/PlayerAvatar";
import pitchImage from "../assets/football-pitch.jpg";
import "./SquadBuilder.css";

const FORMATION_LAYOUTS = {
  "4-3-3": [
    [
      { slot: "LW", label: "LW" },
      { slot: "ST", label: "ST" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-4-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-2-3-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "CAM_A", label: "CAM" },
      { slot: "CAM_B", label: "CAM" },
      { slot: "CAM_C", label: "CAM" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-1-4-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "DM", label: "DM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-3-2-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "CAM_A", label: "CAM" },
      { slot: "CAM_B", label: "CAM" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-2-2-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "CAM_A", label: "CAM" },
      { slot: "CAM_B", label: "CAM" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-4-1-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "CAM", label: "CAM" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-3-1-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "CAM", label: "CAM" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-1-2-3": [
    [
      { slot: "LW", label: "LW" },
      { slot: "ST", label: "ST" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "DM", label: "DM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-5-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-5-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-4-3": [
    [
      { slot: "LW", label: "LW" },
      { slot: "ST", label: "ST" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-4-1-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "CAM", label: "CAM" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-4-2-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "CAM_A", label: "CAM" },
      { slot: "CAM_B", label: "CAM" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-3-3-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "LW", label: "LW" },
      { slot: "CAM", label: "CAM" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
      { slot: "DM_C", label: "DM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-1-4-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "DM", label: "DM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "3-2-4-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CAM_A", label: "CAM" },
      { slot: "CAM_B", label: "CAM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
    ],
    [
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "5-3-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "LWB", label: "LWB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
      { slot: "RWB", label: "RWB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "5-4-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "LM", label: "LM" },
      { slot: "CM_A", label: "CM" },
      { slot: "CM_B", label: "CM" },
      { slot: "RM", label: "RM" },
    ],
    [
      { slot: "LWB", label: "LWB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
      { slot: "RWB", label: "RWB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "5-2-3": [
    [
      { slot: "LW", label: "LW" },
      { slot: "ST", label: "ST" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
    ],
    [
      { slot: "LWB", label: "LWB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
      { slot: "RWB", label: "RWB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "5-3-1-1": [
    [
      { slot: "ST", label: "ST" },
    ],
    [
      { slot: "CAM", label: "CAM" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "LWB", label: "LWB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
      { slot: "RWB", label: "RWB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "5-2-1-2": [
    [
      { slot: "ST_A", label: "ST" },
      { slot: "ST_B", label: "ST" },
    ],
    [
      { slot: "CAM", label: "CAM" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
    ],
    [
      { slot: "LWB", label: "LWB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "CB_C", label: "CB" },
      { slot: "RWB", label: "RWB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-2-1-3": [
    [
      { slot: "LW", label: "LW" },
      { slot: "ST", label: "ST" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "CAM", label: "CAM" },
    ],
    [
      { slot: "DM_A", label: "DM" },
      { slot: "DM_B", label: "DM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-3-3 DM": [
    [
      { slot: "LW", label: "LW" },
      { slot: "ST", label: "ST" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "CAM_A", label: "CAM" },
      { slot: "DM", label: "DM" },
      { slot: "CAM_B", label: "CAM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],

  "4-3-3 False 9": [
    [
      { slot: "LW", label: "LW" },
      { slot: "CF", label: "CF" },
      { slot: "RW", label: "RW" },
    ],
    [
      { slot: "CM_A", label: "CM" },
      { slot: "DM", label: "DM" },
      { slot: "CM_B", label: "CM" },
    ],
    [
      { slot: "LB", label: "LB" },
      { slot: "CB_A", label: "CB" },
      { slot: "CB_B", label: "CB" },
      { slot: "RB", label: "RB" },
    ],
    [
      { slot: "GK", label: "GK" },
    ],
  ],
};

const FORMATIONS = Object.keys(FORMATION_LAYOUTS);

const DAILY_MESSAGES = [

  "Something to try? Build an XI of players who are not in the top 5 leagues.",

  "Random squad time: Build an XI of forgotten ballers.",

  "Today's Football Hub challenge: Start with any player of your choice, then add a player that has played with them. Repeat with the next player.",

  "Try something different today. Pick a formation you normally never use and build an XI.",

  "Today's challenge: Build a squad with players from the same country. Can you make it work?",

  "Today's challenge: Build a squad with players from the same league but different teams. Let's see how it goes!",

  "No superstars allowed. Build an XI without using any player who has won the Ballon d'Or.",

  "Build an XI using only players who have played in at least two different continents.",

  "One club only. Pick a club and build an XI using only players who have played for them.",

  "Build an XI where every player has won a Champions League.",

  "Build an XI of players who have never won the Champions League.",

  "Nationality roulette: Pick 3 countries and build your entire XI using only players from those countries.",

  "Build an XI using players from 11 different countries. No nationality can appear twice.",

  "Underrated XI: Pick the best players you think never get enough respect.",

  "Build an XI using only players who are currently under 23.",

  "Old-school challenge: Build an XI using only players aged 30 or older.",

  "Build an XI of players who played for your favourite club but are no longer there.",

  "Build an XI using players who have played for both rival clubs.",

  "Build an XI of players who have played together at club level but never for the same club at the same time.",

  "Build an XI where every player comes from a different league.",

  "Build an XI using only players who have represented their country at a World Cup.",

  "Build an XI using players who have won a major international trophy.",

  "Build an XI of players who have never won a major international trophy.",

  "Build an XI using only players who have scored in a Champions League final.",

  "Build an XI of players who have scored a hat-trick for their national team.",

  "Build an XI using only left-footed players. Good luck finding a goalkeeper.",

  "Build an XI using only right-footed players.",

  "Build an XI where every player has a different preferred position.",

  "Build an XI without using your country's players.",

  "Build an XI using only players who have played in the Premier League.",

  "Build an XI using only players who have played in LaLiga.",

  "Build an XI using only players who have played in Serie A.",

  "Build an XI using only players who have played in the Bundesliga.",

  "Build an XI using only players who have played in Ligue 1.",

  "Build an XI of players who have played for at least three different clubs.",

  "Build an XI of players who started their careers at the same club.",

  "Build an XI using only academy graduates.",

  "Build an XI of players who moved directly from one rival club to another.",

  "Build an XI of players who have played under the same manager.",

  "Build an XI where every player has a different manager from the previous player.",

  "Build an XI of players who have won a domestic league title in at least two countries.",

  "Build an XI of players who have played in both Europe and South America.",

  "Build an XI using only players who have scored 20+ goals in a single league season.",

  "Build an XI of players known more for their assists than their goals.",

  "Build an XI of players who are famous for scoring spectacular goals.",

  "Build an XI of players who are known for their defensive ability.",

  "Build an XI of players who have captained their national team.",

  "Build an XI of players who have worn the number 10 shirt.",

  "Build an XI of players who have worn the number 7 shirt.",

  "Build an XI where every player wears a different shirt number.",

  "Build an XI using only players whose first names start with the same letter.",

  "Build an XI using only players whose last names start with the same letter.",

  "Letter challenge: Every player's first or last name must start with the letter M.",

  "Alphabet challenge: Build an XI where every player's name starts with a different letter.",

  "Build an XI of players whose surnames are longer than their first names.",

  "Build an XI of players who have scored against their former club.",

  "Build an XI of players who have scored in a World Cup.",

  "Build an XI of players who have scored in a Champions League knockout stage.",

  "Build an XI of players who have played in a Champions League final.",

  "Build an XI using only players who have won a domestic cup.",

  "Build an XI of players who have played for at least one club outside their home country.",

  "Build an XI without using anyone from the Premier League, LaLiga, Serie A, Bundesliga or Ligue 1.",

  "Build an XI from exactly 5 different leagues.",

  "Build an XI from exactly 3 different countries.",

  "Build an XI where every player is from a different club.",

  "Build an XI using only players whose careers started before you were born.",

  "Build an XI using only players who made their professional debut before 2010.",

  "Build an XI using only players who made their professional debut after 2020.",

  "Build an XI of players who were teammates at international level but never at club level.",

  "Build an XI of players who were teammates at club level but never represented the same country.",

  "Build an XI using players who have played under at least two legendary managers.",

  "Build an XI of players who have changed positions during their careers.",

  "Build an XI using only players who can comfortably play at least two positions.",

  "Build an XI of players who were once considered wonderkids.",

  "Build an XI of players who came through a famous football academy.",

  "Build an XI of players who left their boyhood club and became stars elsewhere.",

  "Build an XI of players who returned to a club they had previously left.",

  "Build an XI where every player must have played for at least one club outside Europe.",

  "Build an XI of players who have won a trophy with their national team AND their club.",

  "Build an XI of players who have never received a red card.",

  "Build an XI of players who have scored directly from a free kick.",

  "Build an XI of players who have scored directly from a corner.",

  "Build an XI of players who have scored a goal from outside the box.",

  "Build an XI of players famous for penalty taking.",

  "Build an XI of players famous for taking free kicks.",

  "Build an XI of players who have scored in a final.",

  "Build an XI of players who have won a trophy in their debut season at a club.",

  "Build an XI of players who have played in more than one World Cup.",

  "Build an XI of players who have scored in more than one World Cup.",

  "Build an XI using only players who have been teammates with a Ballon d'Or winner.",

  "Build an XI using only players who have played with a World Cup winner.",

  "Build an XI where every player has played with at least one current or former teammate of yours.",

  "Build an XI of players who have played for clubs beginning with the same letter.",

  "Build an XI where every player's club starts with a different letter.",

  "Build an XI of players who have played in the same stadium but never as teammates.",

  "Build an XI of players who have scored in the same stadium for different clubs.",

  "Build an XI of players who have played for clubs in at least three different countries.",

  "Build an XI with the weirdest possible combination of players that somehow still makes sense.",

  "Chaos challenge: Pick your goalkeeper first and build the entire XI around them.",

  "Reverse challenge: Pick your striker first, then build backwards to the goalkeeper.",

  "No repeats: Every player must come from a different club AND a different country.",

  "Budget challenge: Pretend you only have 100 million to build your XI. Spend wisely.",

  "Rivalry challenge: Build an XI using players from clubs that have a famous rivalry.",

  "Throwback challenge: Build an XI of players you remember from your childhood.",

  "Nostalgia challenge: Build an XI using players who were at their peak between 2005 and 2015.",

  "Future XI: Build an XI using players you think will become world-class.",

  "Forgotten XI: Build an XI of players who were once considered elite but are rarely talked about now.",

  "Cult hero challenge: Build an XI of players who became fan favourites without necessarily being superstars.",

  "One-season wonder challenge: Build an XI of players who had one unforgettable season.",

  "Underdog challenge: Build an XI using players who were never highly rated as youngsters.",

  "The Impossible XI: Build the strongest team you can without using any player from your favourite club.",

];

function SquadBuilder() {
  const [formation, setFormation] = useState("4-3-3");
  const [squadName, setSquadName] = useState("");
  const [manager, setManager] = useState(null);
  const [managerSearch, setManagerSearch] = useState("");
  const [managerResults, setManagerResults] = useState([]);
  const [managerSearching, setManagerSearching] = useState(false);
  const [squadId, setSquadId] = useState(null);
  const [squadPlayers, setSquadPlayers] = useState({});

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [players, setPlayers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dailyMessage, setDailyMessage] = useState("");
  const [showDailyMessage, setShowDailyMessage] = useState(false);
  const pitchExportRef = useRef(null);

  const layout = FORMATION_LAYOUTS[formation];

  const playerCount = Object.keys(squadPlayers).length;

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastShown = localStorage.getItem("footballHub.squadBuilderMessageDate");

    if (lastShown !== today) {
      const message = DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];
      setDailyMessage(message);
      setShowDailyMessage(true);
      localStorage.setItem("footballHub.squadBuilderMessageDate", today);
    }
  }, []);

  async function exportPitch() {
    if (!pitchExportRef.current) return;

    try {
      setError("");
      setMessage("Preparing your pitch image...");

      const exportManager = pitchExportRef.current.querySelector(".export-manager");

      if (exportManager) {
        exportManager.style.display = "flex";
      }

      const playerImages = pitchExportRef.current.querySelectorAll(".pitch-player img");

      playerImages.forEach((image) => {
        image.setAttribute("crossorigin", "anonymous");
      });

      await new Promise((resolve) => setTimeout(resolve, 250));

      const canvas = await html2canvas(pitchExportRef.current, {
        backgroundColor: "#07111f",
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000,
        scale: 2,
      });

      if (exportManager) {
        exportManager.style.display = "none";
      }

      const link = document.createElement("a");
      link.download = `${(squadName || "football-hub-squad").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setMessage("Full squad exported ✓");
    } catch (err) {
      const exportManager = pitchExportRef.current?.querySelector(".export-manager");

      if (exportManager) {
        exportManager.style.display = "none";
      }

      setError("Some player pictures could not be included in the export. Make sure the player images have loaded and try again.");
    }
  }

  async function createSquad() {
    setError("");
    setMessage("");

    if (!squadName.trim()) {
      setError("Enter a squad name first.");
      return;
    }

    if (!manager) {
      setError("Search for and select a manager first.");
      return;
    }

    try {
      setLoading(true);

      const squad = await squadApi.create(
        squadName.trim(),
        formation,
        manager.name
      );

      setSquadId(squad.id);
      localStorage.setItem("footballHub.lastSquadId", String(squad.id));
      setSquadPlayers({});
      setSelectedSlot(null);

      setMessage(
        `${squad.name} created using ${formation}.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchPlayers() {
    setError("");
    setMessage("");

    if (!searchText.trim()) {
      setPlayers([]);
      return;
    }

    try {
      setSearching(true);

      const results = await playerApi.search(
        searchText.trim()
      );

      setPlayers(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }

  async function addPlayer(player) {
    setError("");
    setMessage("");

    if (!squadId) {
      setError("Create your squad first.");
      return;
    }

    if (!selectedSlot) {
      setError("Select an empty position on the pitch first.");
      return;
    }

    if (squadPlayers[selectedSlot]) {
      setError("That position is already occupied.");
      return;
    }

    try {
      await squadApi.addPlayer(
        squadId,
        player.id,
        selectedSlot
      );

      setSquadPlayers((current) => ({
        ...current,
        [selectedSlot]: player,
      }));

      setMessage(
        `${player.name} added to ${getDisplayLabel(selectedSlot)}.`
      );

      setSelectedSlot(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function removePlayer(slot) {
    setError("");
    setMessage("");

    if (!squadId) return;

    try {
      await squadApi.removePosition(
        squadId,
        slot
      );

      const removedPlayer = squadPlayers[slot];

      setSquadPlayers((current) => {
        const updated = { ...current };
        delete updated[slot];
        return updated;
      });

      setSelectedSlot(null);

      if (removedPlayer) {
        setMessage(`${removedPlayer.name} removed.`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function getDisplayLabel(slot) {
    for (const row of layout) {
      const position = row.find(
        (item) => item.slot === slot
      );

      if (position) {
        return position.label;
      }
    }

    return slot;
  }

  function handleFormationChange(event) {
    if (squadId) return;

    setFormation(event.target.value);
    setSquadPlayers({});
    setSelectedSlot(null);
    setPlayers([]);
    setMessage("");
    setError("");
  }

  async function searchManagers() {
    setError("");
    setMessage("");

    if (!managerSearch.trim()) {
      setManagerResults([]);
      return;
    }

    try {
      setManagerSearching(true);

      const results = await playerApi.search(
        managerSearch.trim()
      );

      setManagerResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setManagerSearching(false);
    }
  }

  function selectManager(player) {
    setManager(player);
    setManagerSearch("");
    setManagerResults([]);
    setError("");
    setMessage(`${player.name} selected as manager.`);
  }

  return (
    <main className="squad-builder-page">

      <section className="builder-header">
        <div>
          <span className="builder-kicker">
             .SQUAD BUILDER
          </span>

          <h1>
            Build Your <span>Ultimate XI</span>
          </h1>

          <p>
            Pick your formation, choose your players and
            create your squad your way.
          </p>
        </div>

        <div className="squad-counter">
          <strong>{playerCount}</strong>
          <span>/ 11 players</span>
        </div>
      </section>

      {showDailyMessage && (
        <div className="daily-squad-message">
          <div>
            <span>⚡ DAILY SQUAD CHALLENGE</span>
            <p>{dailyMessage}</p>
          </div>
          <button onClick={() => setShowDailyMessage(false)} aria-label="Close message">×</button>
        </div>
      )}

      <section className="builder-layout">

        <aside className="builder-sidebar">

          <div className="builder-panel">
            <div className="panel-title">
              <span>01</span>
              <h2>Squad Details</h2>
            </div>

            <label>Squad Name</label>

            <input
              type="text"
              placeholder="e.g. Michael's XI"
              value={squadName}
              onChange={(event) =>
                setSquadName(event.target.value)
              }
              disabled={Boolean(squadId)}
            />

            <label>Formation</label>

            <select
              value={formation}
              onChange={handleFormationChange}
              disabled={Boolean(squadId)}
            >
              {FORMATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {!squadId && (
              <button
                className="primary-action"
                onClick={createSquad}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Squad"}
              </button>
            )}

            {squadId && (
              <div className="created-status">
                <span>✓</span>
                <div>
                  <strong>Squad Created</strong>
                  <small>{formation}</small>
                </div>
              </div>
            )}
          </div>

          <div className="builder-panel">

            <div className="panel-title">
              <span>02</span>
              <h2>Add Player</h2>
            </div>

            <div className="selected-position">
              <span>Selected position</span>

              <strong>
                {selectedSlot
                  ? getDisplayLabel(selectedSlot)
                  : "Select a position"}
              </strong>
            </div>

            <div className="player-search">
              <input
                type="text"
                placeholder="Search player..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchPlayers();
                  }
                }}
                disabled={!squadId}
              />

              <button
                onClick={searchPlayers}
                disabled={!squadId || searching}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            <div className="search-results">

              {players.length === 0 && (
                <div className="empty-search">
                  {squadId
                    ? "Search for a player to add."
                    : "Create your squad to start adding players."}
                </div>
              )}

              {players.map((player) => (
                <button
                  className="search-player"
                  key={player.id}
                  onClick={() => addPlayer(player)}
                  disabled={!selectedSlot}
                >
                  <PlayerAvatar player={player} small />

                  <div>
                    <strong>{player.name}</strong>
                    <span>
                      {player.club || "Unknown club"}
                    </span>
                  </div>

                  <b>+</b>
                </button>
              ))}

            </div>
          </div>

          <div className="manager-card">
            <div className="panel-title manager-title">
              <span>03</span>
              <h2>Team Manager</h2>
            </div>

            <div className="selected-manager">
              {manager ? (
                <PlayerAvatar player={manager} small />
              ) : (
                <div className="manager-icon">🧠</div>
              )}

              <div>
                <small>Selected manager</small>
                <strong>{manager?.name || "No manager selected"}</strong>
                {manager?.club && <span>{manager.club}</span>}
              </div>
            </div>

            {!squadId && (
              <>
                <div className="manager-search">
                  <input
                    type="text"
                    placeholder="Search any player as manager..."
                    value={managerSearch}
                    onChange={(event) => setManagerSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        searchManagers();
                      }
                    }}
                  />

                  <button
                    onClick={searchManagers}
                    disabled={managerSearching}
                  >
                    {managerSearching ? "..." : "Search"}
                  </button>
                </div>

                <div className="manager-results search-results">
                  {managerResults.length === 0 ? (
                    <div className="empty-search">
                      Search for any player to use as manager.
                    </div>
                  ) : (
                    managerResults.map((player) => (
                      <button
                        className="search-player manager-result"
                        key={player.id}
                        onClick={() => selectManager(player)}
                      >
                        <PlayerAvatar player={player} small />

                        <div>
                          <strong>{player.name}</strong>
                          <span>{player.club || "Unknown club"}</span>
                        </div>

                        <b>+</b>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {(message || error) && (
            <div
              className={
                error
                  ? "builder-message error"
                  : "builder-message"
              }
            >
              {error || message}
            </div>
          )}

        </aside>

        <section className="pitch-section">

          <div className="pitch-header">
            <div>
              <span>TACTICAL BOARD</span>
              <h2>{formation}</h2>
            </div>

            <p>
              {playerCount === 11
                ? "Starting XI complete ✓"
                : "Click an empty position to place a player"}
            </p>
          </div>

          <div className="pitch-export-area" ref={pitchExportRef}>
            <div className="pitch-wrapper">

              <div className="football-pitch">
                <img
                  className="pitch-background"
                  src={pitchImage}
                  alt="Football pitch"
                />

                <div className="pitch-formation">

                {layout.map((row, rowIndex) => (
                  <div
                    className={`pitch-row pitch-row-${rowIndex}`}
                    key={`${formation}-row-${rowIndex}`}
                  >

                    {row.map((position) => {

                      const player =
                        squadPlayers[position.slot];

                      const isSelected =
                        selectedSlot === position.slot;

                      return (
                        <div
                          key={position.slot}
                          className={`pitch-position ${
                            isSelected
                              ? "selected"
                              : ""
                          } ${
                            player
                              ? "occupied"
                              : "empty"
                          }`}
                          onClick={() =>
                            setSelectedSlot(position.slot)
                          }
                        >

                          <div className="position-label">
                            {position.label}
                          </div>

                          {player ? (
                            <div className="pitch-player">

                              <PlayerAvatar
                                player={player}
                              />

                              <span className="pitch-player-name">
                                {player.name}
                              </span>

                              <button
                                className="remove-player"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removePlayer(
                                    position.slot
                                  );
                                }}
                                title="Remove player"
                              >
                                ×
                              </button>

                            </div>
                          ) : (
                            <div className="empty-player">
                              <span>+</span>
                            </div>
                          )}

                        </div>
                      );
                    })}

                  </div>
                ))}

                </div>
              </div>

              <div className="export-manager">
                <span>TEAM MANAGER</span>
                {manager?.photo && (
                  <img
                    src={manager.photo}
                    alt={manager.name || "Manager"}
                    crossOrigin="anonymous"
                  />
                )}
                <strong>{manager?.name || "No manager selected"}</strong>
              </div>
            </div>
          </div>

          <div className="pitch-footer">
            <span>
              {playerCount}/11 selected
            </span>

            <span>
              Players can be placed anywhere — no position restrictions.
            </span>

            <button className="export-pitch-button" onClick={exportPitch} disabled={playerCount === 0}>
              🖼 Export Pitch
            </button>
          </div>

        </section>
      </section>
    </main>
  );
}

export default SquadBuilder;
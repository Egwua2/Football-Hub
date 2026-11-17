import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TRACKS = [
  "01-100-bad-days.mp3",
  "02-bang.mp3",
  "03-im-ready.mp3",
  "04-worlds-smallest-violin.mp3",
  "05-wake-me-up.mp3",
  "06-cheat-on-me.mp3",
  "07-doja.mp3",
  "08-la-da-dee.mp3",
  "09-counting-stars.mp3",
  "10-the-joker-and-the-queen.mp3",
  "11-jeje.mp3",
  "12-wet-dreamz.mp3",
  "13-rigamortus.mp3",
  "14-untitled-08.mp3",
  "15-patrick-star.mp3",
  "16-nonstop.mp3",
  "17-declan-rice.mp3",
  "18-koffee.mp3",
  "19-martin-gina.mp3",
  "20-addicted.mp3",
  "21-love-me-jeje.mp3",
];

function shuffleTracks() {
  const tracks = [...TRACKS];

  for (let i = tracks.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[randomIndex]] = [tracks[randomIndex], tracks[i]];
  }

  return tracks;
}

function MusicPlayer() {
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const lastTrackRef = useRef(null);
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(
    () => localStorage.getItem("footballHubMusicMuted") === "true"
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = 0.35;
    audio.muted = muted;

    function playNextTrack() {
      if (queueRef.current.length === 0) {
        queueRef.current = shuffleTracks();

        // Avoid repeating the final song from the previous shuffle cycle.
        if (
          queueRef.current.length > 1 &&
          queueRef.current[queueRef.current.length - 1] === lastTrackRef.current
        ) {
          [queueRef.current[0], queueRef.current[queueRef.current.length - 1]] = [
            queueRef.current[queueRef.current.length - 1],
            queueRef.current[0],
          ];
        }
      }

      const track = queueRef.current.pop();
      if (!track) return;

      lastTrackRef.current = track;
      audio.src = `/music/${track}`;
      audio.load();

      audio.play().catch(() => {
        // A later login/signup click can retry if the browser blocks playback.
        startedRef.current = false;
      });
    }

    function startMusic() {
      if (startedRef.current) return;
      startedRef.current = true;
      queueRef.current = shuffleTracks();
      playNextTrack();
    }

    window.addEventListener("footballHub:startMusic", startMusic);
    audio.addEventListener("ended", playNextTrack);

    return () => {
      window.removeEventListener("footballHub:startMusic", startMusic);
      audio.removeEventListener("ended", playNextTrack);
    };
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
    localStorage.setItem("footballHubMusicMuted", String(muted));
  }, [muted]);

  function toggleMute() {
    setMuted((current) => !current);
  }

  return (
    <>
      <audio ref={audioRef} preload="none" />
      <button
        type="button"
        className="music-toggle"
        onClick={toggleMute}
        aria-label={muted ? "Unmute website music" : "Mute website music"}
        title={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        <span>{muted ? "Unmute" : "Mute"}</span>
      </button>
    </>
  );
}

export default MusicPlayer;

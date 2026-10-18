import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { RxTrackPrevious, RxPlay, RxTrackNext, RxPause } from "react-icons/rx";
import { SlVolume1, SlVolume2, SlVolumeOff } from "react-icons/sl";
import "../../sass/AudioPlayer.scss";
import { mediaUrl } from "../../config.js";

// Hörproben (Dateien im Backend unter storage/audio) – alles Coversongs, daher mit Original
const TRACKS = [
  { file: "use me.mp3", title: "Use Me", original: "Bill Withers" },
  { file: "superstition.mp3", title: "Superstition", original: "Stevie Wonder" },
  { file: "Aint nobody.mp3", title: "Ain't Nobody", original: "Rufus & Chaka Khan" },
].map((track) => ({ ...track, src: mediaUrl(`/media/audio/${track.file}`) }));

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

function AudioPlayer() {
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [durations, setDurations] = useState({});
  const [cover, setCover] = useState(null);

  const track = TRACKS[index];

  // Cover der Plattenhülle: erstes Bild der Galerie (Bandfoto)
  useEffect(() => {
    axios.get("/api/public/gallery")
      .then((res) => {
        const first = res.data.data?.[0];
        if (first?.images?.md) setCover(mediaUrl(`/media/images/${first.images.md}`));
      })
      .catch(() => {});
  }, []);

  // Längen aller Titel für die Trackliste vorab lesen (nur Metadaten)
  useEffect(() => {
    TRACKS.forEach((t) => {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = t.src;
      probe.onloadedmetadata = () => setDurations((d) => ({ ...d, [t.file]: probe.duration }));
    });
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Bei Titelwechsel weiterspielen, wenn gerade gespielt wird
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [index]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const changeTrack = (direction) => setIndex((i) => (i + direction + TRACKS.length) % TRACKS.length);

  const selectTrack = (i) => {
    if (i === index) {
      togglePlay();
      return;
    }
    setIsPlaying(true);
    setIndex(i);
  };

  const seek = (event) => {
    const time = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const VolumeIcon = isMuted || volume === 0 ? SlVolumeOff : volume > 0.5 ? SlVolume2 : SlVolume1;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div id="audio-player" className={isPlaying ? "is-playing" : ""}>
      <audio
        ref={audioRef}
        src={track.src}
        muted={isMuted}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => changeTrack(1)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Plattenhülle mit Vinyl: rutscht beim Abspielen heraus und dreht sich */}
      <div className="record" aria-hidden="true">
        <div className="vinyl">
          <span className="vinyl-label">Wonders</span>
        </div>
        <div className="sleeve" style={cover ? { backgroundImage: `url("${cover}")` } : undefined}></div>
      </div>

      <div className="deck">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-meta">Jody Cooper &amp; the Wonders – Original: {track.original}</p>

        <div className="seek">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={seek}
            aria-label="Position im Titel"
            aria-valuetext={`${formatTime(currentTime)} von ${formatTime(duration)}`}
            style={{ "--fill": `${progress}%` }}
          />
          <div className="seek-times">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="transport">
          <button type="button" className="transport-btn" onClick={() => changeTrack(-1)} aria-label="Vorheriger Titel">
            <RxTrackPrevious />
          </button>
          <button
            type="button"
            className="transport-btn play"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Abspielen"}
          >
            {isPlaying ? <RxPause /> : <RxPlay />}
          </button>
          <button type="button" className="transport-btn" onClick={() => changeTrack(1)} aria-label="Nächster Titel">
            <RxTrackNext />
          </button>

          <div className="volume">
            <button
              type="button"
              className="transport-btn small"
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? "Ton an" : "Stumm schalten"}
            >
              <VolumeIcon />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              aria-label="Lautstärke"
              style={{ "--fill": `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
        </div>

        <ol className="tracklist">
          {TRACKS.map((t, i) => (
            <li key={t.file}>
              <button
                type="button"
                className={i === index ? "current" : ""}
                onClick={() => selectTrack(i)}
                aria-current={i === index ? "true" : undefined}
              >
                <span className="track-no">{i + 1}</span>
                <span className="track-text">
                  <span className="track-name">{t.title}</span>
                  <span className="track-original">Original: {t.original}</span>
                </span>
                <span className="track-length">{durations[t.file] ? formatTime(durations[t.file]) : ""}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default AudioPlayer;

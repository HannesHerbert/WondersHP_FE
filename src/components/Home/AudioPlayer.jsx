import ReactAudioPlayer from "react-audio-player";
import { useState, useEffect, useRef } from "react";
import { RxTrackPrevious, RxPlay, RxTrackNext, RxPause } from "react-icons/rx";
import { PiMusicNotesLight } from "react-icons/pi";
import { SlVolume1, SlVolume2, SlVolumeOff } from "react-icons/sl";
import { LuListMusic } from "react-icons/lu";
import "../../sass/AudioPlayer.scss";

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([
    "/src/assets/audio/use me.mp3",
    "/src/assets/audio/superstition.mp3",
    "/src/assets/audio/Aint nobody.mp3",
  ]);

  const [currAudioIndex, setCurrAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const timeBarRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInit, setIsInit] = useState(true);
  const [volume, setVolume] = useState(0);
  const [playerIsShown, setPlayerIsShown] = useState(true);
  const [songListIsShown, setSongListIsShown] = useState(false);

  const togglePlayer = () => {
    setPlayerIsShown(!playerIsShown);
  };

  const getSongTitle = (songPath) => {
    const lastSlashIndex = songPath.lastIndexOf("/");
    const lastDotIndex = songPath.lastIndexOf(".");
    return songPath.slice(lastSlashIndex + 1, lastDotIndex);
  };

  const AUDIO_LIST = audioFiles.map((file, index) => {
    const songTitle = getSongTitle(file);
    return (
      <li
        key={index}
        onClick={() => setCurrAudioIndex(index)}
        className={index === currAudioIndex ? "current" : ""}
      >
        {songTitle}
      </li>
    );
  });

  const changeAudio = (direction) => {
    let newAudioIndex;
    if (currAudioIndex + direction === -1) {
      newAudioIndex = audioFiles.length - 1;
    } else if (currAudioIndex + direction > audioFiles.length - 1) {
      newAudioIndex = 0;
    } else {
      newAudioIndex = currAudioIndex + direction;
    }
    setCurrAudioIndex(newAudioIndex);
  };

  const setPlayMode = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isInit === true) {
      audioRef.current.volume = volume;
      setIsInit(false);
    } else {
      setIsPlaying(true);
      audioRef.current.play();
    }
  }, [currAudioIndex]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const changePlayTime = (evt) => {
    setIsPlaying(true);
    const elemDimensions = evt.currentTarget.getBoundingClientRect();
    const clickedRatio =
      (evt.clientX - elemDimensions.x) / elemDimensions.width;
    audioRef.current.currentTime = duration * clickedRatio;
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const togglePlayList = () => {
    setSongListIsShown(!songListIsShown);
  };

  return (
    <div id="audio-player" className={playerIsShown ? "show" : ""}>
      <div className="player-toggle" onClick={togglePlayer}>
        <PiMusicNotesLight />
      </div>

      <audio
        ref={audioRef}
        src={audioFiles[currAudioIndex]}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => changeAudio(1)}
      />

      <div className="duration-display">
        <span>
          {formatTime(currentTime)} - {formatTime(duration)}
        </span>

        <div
          ref={timeBarRef}
          className="time-bar"
          title={currentTime}
          onClick={(evt) => changePlayTime(evt)}
        >
          <div
            className="time-bar-inner"
            style={{ width: (currentTime / duration) * 100 + "%" }}
          ></div>
        </div>
      </div>

      <div className="controls">
        <div className="volume-control">
          <div>
            {volume > 0.5 ? (
              <SlVolume2 />
            ) : volume > 0 ? (
              <SlVolume1 />
            ) : (
              <SlVolumeOff />
            )}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>

        <div onClick={() => changeAudio(-1)}>
          <RxTrackPrevious />
        </div>

        <div onClick={() => setPlayMode()}>
          {isPlaying ? <RxPause /> : <RxPlay />}
        </div>

        <div onClick={() => changeAudio(1)}>
          <RxTrackNext />
        </div>

        <div className="songlist-toggle">
          <LuListMusic onClick={togglePlayList} />
        </div>
        <ul className={`songlist${songListIsShown ? " shown" : ""}`}>
          {AUDIO_LIST}
        </ul>
      </div>

      {/* <div className="audio-player-footer">
        <div className="volume-control">
          <div>
            {volume > 0.5 ? (
              <SlVolume2 />
            ) : volume > 0 ? (
              <SlVolume1 />
            ) : (
              <SlVolumeOff />
            )}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>

        <div className="songlist-toggle">
          <LuListMusic onClick={togglePlayList} />
        </div>
        <ul
          className={`songlist${songListIsShown ? " shown" : ""}`}
        >
          {AUDIO_LIST}
        </ul>
      </div> */}
    </div>
  );
}

export default AudioPlayer;

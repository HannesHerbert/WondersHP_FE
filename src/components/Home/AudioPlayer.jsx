import ReactAudioPlayer from "react-audio-player";
import { useState, useEffect, useRef } from "react";
import { RxTrackPrevious, RxPlay, RxTrackNext, RxPause } from "react-icons/rx";
import { PiMusicNotesLight } from "react-icons/pi";
import { SlVolume1, SlVolume2, SlVolumeOff } from "react-icons/sl";
import { LuListMusic } from "react-icons/lu";
import "../../sass/AudioPlayer.scss";
import useMe from "../../assets/audio/use me.mp3";
import superstition from "../../assets/audio/superstition.mp3";
import aintNobody from "../../assets/audio/Aint nobody.mp3";

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([
    useMe,
    superstition,
    aintNobody,
  ]);

  const [currAudioIndex, setCurrAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const timeBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInit, setIsInit] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [mouseXDurationBar, setMouseXDurationBar] = useState(0);
  const [mouseXVolumeBar, setMouseXVolumeBar] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

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

  const handleVolumeChange = (evt) => {
    // const newVolume = parseFloat(event.target.value);
    const elemDimensions = evt.currentTarget.getBoundingClientRect();
    const clickedRatio =
      (evt.clientX - elemDimensions.x) / elemDimensions.width;
    setVolume(clickedRatio);
    audioRef.current.volume = clickedRatio;
  };

  const handleMouseMoveOnTimeBar = (evt) => {
    const elemDimensions = evt.currentTarget.getBoundingClientRect();
    const mouseX = evt.clientX - elemDimensions.left;
    const percentage = formatTime((mouseX / elemDimensions.width) * duration);
    setMouseXDurationBar(percentage);
  };

  const handleMouseMoveOnVolumeBar = (evt) => {
    const elemDimensions = evt.currentTarget.getBoundingClientRect();
    const mouseX = evt.clientX - elemDimensions.left;
    const percentage = Math.trunc((mouseX / elemDimensions.width) * 100);
    setMouseXVolumeBar(percentage);
  };

  const toggleAudioMuted = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  return (
    <div id="audio-player">
      <audio
        muted={isAudioMuted}
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
          title={mouseXDurationBar}
          onClick={(evt) => changePlayTime(evt)}
          onMouseMove={handleMouseMoveOnTimeBar}
        >
          <div
            className="time-bar-inner"
            style={{ width: (currentTime / duration) * 100 + "%" }}
          ></div>
        </div>
      </div>

      <div className="controls">
        <div>
          <div onClick={() => changeAudio(-1)}>
            <RxTrackPrevious />
          </div>

          <div onClick={() => setPlayMode()}>
            {isPlaying ? <RxPause /> : <RxPlay />}
          </div>

          <div onClick={() => changeAudio(1)}>
            <RxTrackNext />
          </div>
        </div>

        <div>
          <div className="volume-control">
            <div className="volume-toggle" onClick={() => toggleAudioMuted()}>
              {isAudioMuted ? (
                <SlVolumeOff />
              ) : volume > 0.5 ? (
                <SlVolume2 />
              ) : volume > 0 ? (
                <SlVolume1 />
              ) : (
                <SlVolumeOff />
              )}
            </div>

            <div
              ref={volumeBarRef}
              className="volume-bar"
              title={`${mouseXVolumeBar}%`}
              onClick={(evt) => handleVolumeChange(evt)}
              onMouseMove={handleMouseMoveOnVolumeBar}
            >
              <div
                className="volume-bar-inner"
                style={{ width: volume * 100 + "%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <ul className="songlist">{AUDIO_LIST}</ul>
    </div>
  );
}

export default AudioPlayer;

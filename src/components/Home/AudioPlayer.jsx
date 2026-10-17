import ReactAudioPlayer from "react-audio-player";
import { useState, useEffect, useRef } from "react";
import { RxTrackPrevious, RxPlay, RxTrackNext, RxPause } from "react-icons/rx";
import { PiMusicNotesLight } from "react-icons/pi";
import { SlVolume1, SlVolume2, SlVolumeOff } from "react-icons/sl";
import { LuListMusic } from "react-icons/lu";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import "../../sass/AudioPlayer.scss";
import { mediaUrl } from "../../config.js";
const useMe = mediaUrl("/media/audio/use me.mp3");
const superstition = mediaUrl("/media/audio/superstition.mp3");
const aintNobody = mediaUrl("/media/audio/Aint nobody.mp3");

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
  // const [volume, setVolume] = useState(0.5);
  const [volume, setVolume] = useState(0);

  const [mouseXDurationBar, setMouseXDurationBar] = useState(0);
  const [mouseXVolumeBar, setMouseXVolumeBar] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const [isDraggingTime, setIsDraggingTime] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  useEffect(() => {
    const handleMouseMove = (evt) => {
      if (isDraggingTime && timeBarRef.current) {
        const elemDimensions = timeBarRef.current.getBoundingClientRect();
        let clickedRatio = (evt.clientX - elemDimensions.x) / elemDimensions.width;
        clickedRatio = Math.max(0, Math.min(1, clickedRatio));
        if (audioRef.current) {
          audioRef.current.currentTime = duration * clickedRatio;
        }
      }
      if (isDraggingVolume && volumeBarRef.current) {
        const elemDimensions = volumeBarRef.current.getBoundingClientRect();
        let clickedRatio = (evt.clientX - elemDimensions.x) / elemDimensions.width;
        clickedRatio = Math.max(0, Math.min(1, clickedRatio));
        setVolume(clickedRatio);
        if (audioRef.current) {
          audioRef.current.volume = clickedRatio;
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTime(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingTime || isDraggingVolume) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTime, isDraggingVolume, duration]);

  const getSongTitle = (songPath) => {
    const lastSlashIndex = songPath.lastIndexOf("/");
    const lastDotIndex = songPath.lastIndexOf(".");
    return songPath.slice(lastSlashIndex + 1, lastDotIndex);
  };

  const AUDIO_LIST = (audioFiles || []).map((file, index) => {
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

  const playAudio = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio play interrupted:", error);
        });
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playAudio();
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
      playAudio();
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
    let clickedRatio =
      (evt.clientX - elemDimensions.x) / elemDimensions.width;
    clickedRatio = Math.max(0, Math.min(1, clickedRatio));
    audioRef.current.currentTime = duration * clickedRatio;
  };

  const handleVolumeChange = (evt) => {
    // const newVolume = parseFloat(event.target.value);
    const elemDimensions = evt.currentTarget.getBoundingClientRect();
    let clickedRatio =
      (evt.clientX - elemDimensions.x) / elemDimensions.width;
    clickedRatio = Math.max(0, Math.min(1, clickedRatio));
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
        src={audioFiles[currAudioIndex] || null}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => changeAudio(1)}
      />

      <div className="audio-player-header">

        <div className="note-icon">
          <span><HiOutlineMusicalNote /></span>
        </div>

        <div className="song-info">
          <div className="song-title">{getSongTitle(audioFiles[currAudioIndex])}</div>
          <div className="song-interpret">Interpret-Info</div>
        </div>

      </div>

      <div className="duration-display">

        <div
          ref={timeBarRef}
          className="time-bar"
          title={mouseXDurationBar}
          onMouseDown={(evt) => {
            evt.preventDefault();
            setIsDraggingTime(true);
            changePlayTime(evt);
          }}
          onMouseMove={handleMouseMoveOnTimeBar}
        >
          <div
            className="time-bar-inner"
            style={{ width: (currentTime / duration) * 100 + "%" }}
          ></div>
        </div>

        <div className="current-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
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
              onMouseDown={(evt) => {
                evt.preventDefault();
                setIsDraggingVolume(true);
                handleVolumeChange(evt);
              }}
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

const albumArt = document.querySelector("img");
const titleTxt = document.getElementById("title");
const artistTxt = document.getElementById("artist");
const music = document.querySelector("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progressContainer = document.getElementById("progress-container");
const seek = document.getElementById("progress");
const musicDuration = document.getElementById("duration");
const musicCurrentTime = document.getElementById("current-time");

const muteBtn = document.getElementById("mute");
const shuffleBtn = document.getElementById("shuffle");

const mainContainer = document.getElementById("main-container");

const songList = [
  {
    name: "Yoasobi-1",
    diplayName: "Yoru ni Kakeru",
    artist: "YOASOBI ",
  },
  {
    name: "Talking",
    diplayName: "Talking",
    artist: "KANA-BOON ",
  },
  {
    name: "Yoasobi-2",
    diplayName: "Ultramarine",
    artist: "YOASOBI ",
  },
  {
    name: "Kessen Spirit",
    diplayName: "Kessen Spirit",
    artist: "CHiCO with HoneyWorks ",
  },
];

let isPause = false;
let isShuffled = false;

const toggleIcon = (isPause) => {
  isPause
    ? playBtn.classList.replace("fa-pause", "fa-play")
    : playBtn.classList.replace("fa-play", "fa-pause");
  let toggleTitle = isPause ? "Play" : "Pause";
  playBtn.setAttribute("title", toggleTitle);
};

const setBG = () => {
  mainContainer.style.background = 'url("./dancy.gif")';
  mainContainer.style.backgroundSize = "auto";
  mainContainer.style.backgroundPosition = "right bottom";
  mainContainer.style.backgroundRepeat = "no-repeat";
};
const setSmallBG = () => {
  setBG();
  mainContainer.style.backgroundPosition = "center top";
};

const togglePlay = () => {
  isPause = music.paused;
  isPause ? music.play() : music.pause();
  if (window.innerWidth > 450) {
    isPause ? setBG() : (mainContainer.style.background = "#50cccd");
  } else {
    isPause ? setSmallBG() : (mainContainer.style.background = "#50cccd");
  }
  toggleIcon(music.paused);
};

const loadSong = (song) => {
  titleTxt.textContent = song.diplayName;
  artistTxt.textContent = song.artist;
  albumArt.src = `img/${song.name}.jpg`;
  music.src = `music/${song.name}.mp3`;
};

let songNumber = 0;

const previousMusic = () => {
  songNumber === 0 ? (songNumber = songList.length - 1) : songNumber--;
  loadSong(songList[songNumber]);
  togglePlay();
};

const shuffleIndex = () => {
  return Math.floor(Math.random() * songList.length);
};

const nextMusic = () => {
  songNumber === songList.length - 1 ? (songNumber = 0) : songNumber++;
  if (isShuffled) {
    let rand;
    do {
      rand = shuffleIndex();
    } while (songNumber - 1 === rand);
    songNumber = rand;
  }
  loadSong(songList[songNumber]);
  togglePlay();
};

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", previousMusic);
nextBtn.addEventListener("click", nextMusic);

const seekProgress = (e) => {
  if (isPause) {
    //Sets the seek
    const { duration, currentTime } = e.srcElement;
    let progress = (currentTime / duration) * 100;
    seek.style.width = `${progress}%`;

    // Sets the music duration
    const durationMin = Math.floor(duration / 60);
    let durationSecs = Math.floor(duration % 60);
    if (durationSecs < 10) {
      durationSecs = `0${durationSecs}`;
    }
    // Delay to avoid NaN
    if (durationSecs) {
      musicDuration.textContent = durationMin + ":" + durationSecs;
    }

    // Sets the current time
    const currentMin = Math.floor(currentTime / 60);
    let currentSecs = Math.floor(currentTime % 60);
    if (currentSecs < 10) {
      currentSecs = `0${currentSecs}`;
    }
    musicCurrentTime.textContent = `${currentMin}:${currentSecs}`;
  }
};

//Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  console.log(duration * (clickX / width));
  music.currentTime = duration * (clickX / width);
}

music.addEventListener("timeupdate", seekProgress);
music.addEventListener("ended", nextMusic);
progressContainer.addEventListener("click", setProgressBar);

let isMuted = music.muted;

const mutePlayer = () => {
  music.muted = !isMuted;
  isMuted = music.muted;
  let muteTitle = isMuted ? "Unmute" : "Mute";
  muteBtn.setAttribute("title", muteTitle);
  isMuted
    ? muteBtn.classList.replace("fa-volume-down", "fa-volume-mute")
    : muteBtn.classList.replace("fa-volume-mute", "fa-volume-down");
};

const toggleShuffle = () => {
  if (isShuffled) {
    nextMusic();
  }
  isShuffled
    ? (shuffleBtn.style.filter = "brightness(60%)")
    : (shuffleBtn.style.filter = "brightness(100%)");
  let shuffleTitle = isShuffled ? "Stop shuffle" : "Shuffle";
  shuffleBtn.setAttribute("title", shuffleTitle);
};

const shufflePlayer = () => {};

muteBtn.addEventListener("click", mutePlayer);
shuffleBtn.addEventListener("click", () => {
  isShuffled = !isShuffled;
  toggleShuffle();
});

//On load
loadSong(songList[songNumber]);

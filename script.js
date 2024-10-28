// Select elements
const playPauseButton = document.getElementById("play-pause");
const stopButton = document.getElementById("stop");
const nextButton = document.getElementById("next");
//const audioElement = document.getElementById("audio");
const previousButton = document.getElementById("prev");
const volumeButton = document.getElementById("volume-button");
const volumeSlider = document.getElementById("volume-slider");
const seekBar = document.getElementById("seek-bar");
const songAttribute = document.querySelector(".song-title p");
const elapsedTimeDisplay = document.getElementById("elapsed-time");
const totalTimeDisplay = document.getElementById("total-time");
const playlistElement = document.getElementById("playlist");
const playerContainer = document.querySelector(".music-player-container");

// Define a playlist of songs
const playlist = [
  { title: "Track One", artist: "Artist One", src: "sample.mp3" },
  {
    title: "Track Two",
    artist: "Artist Two",
    src: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
  },
  {
    title: "Track Three",
    artist: "Artist Three",
    src: "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
  },
  {
    title: "Track Four",
    artist: "Artist Four",
    src: "https://samplelib.com/lib/preview/mp3/sample-9s.mp3",
  },
];

let currentTrackIndex = 0;
// Variables to track state
let isPlaying = false;
let updateInterval;

// Load the first track initially
function loadTrack(index) {
  const track = playlist[index];
  if (!track) {
    console.error(`Track at index ${index} does not exist`);
    return;
  }
  audio.src = track.src;
  songAttribute.textContent = `${track.title} - ${track.artist}`;
  playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  isPlaying = false;
  //updateElapsedTimeAndSeekBar();
}

function loadPlaylist() {
  playlistElement.innerHTML = "";

  for (let index = 0; index < playlist.length; index++) {
    const track = playlist[index]; // Access the current track object
    const listItem = document.createElement("li");
    listItem.textContent = `${track.title} - ${track.artist}`;

    const tempAudio = new Audio(track.src);

    tempAudio.addEventListener("loadedmetadata", () => {
      const totalMinutes = Math.floor(tempAudio.duration / 60);
      const totalSeconds = Math.floor(tempAudio.duration % 60);
      const duration = `${totalMinutes}:${
        totalSeconds < 10 ? "0" : ""
      }${totalSeconds}`;
      listItem.innerHTML = `${track.title} - ${track.artist} <span class="track-duration">${duration}</span>`;
    });

    listItem.addEventListener("click", () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      playPauseButton.click();
    });

    playlistElement.appendChild(listItem);
  }
}

loadPlaylist();
loadTrack(currentTrackIndex);

// Update UI to highlight the current track
function updatePlaylistHighlight(index) {
  const playlistItems = document.querySelectorAll("#playlist li");
  playlistItems.forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });
}

audio.addEventListener("play", () =>
  updatePlaylistHighlight(currentTrackIndex)
);

// Play/Pause functionality
playPauseButton.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    playerContainer.classList.remove("active");
    clearInterval(updateInterval);
  } else {
    audio.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    updateInterval = setInterval(updateElapsedTimeAndSeekBar, 500);
    playerContainer.classList.add("active");
  }
  isPlaying = !isPlaying;
});

//next functionality
nextButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playPauseButton.click();
});

//previous functionality
previousButton.addEventListener("click", () => {
  currentTrackIndex =
    (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  playPauseButton.click();
});

// Stop functionality
stopButton.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  isPlaying = false;
  playerContainer.classList.remove("active");
  clearInterval(updateInterval);
  updateElapsedTimeAndSeekBar();
});

// Update elapsed time and seek bar as song plays
function updateElapsedTimeAndSeekBar() {
  const elapsedMinutes = Math.floor(audio.currentTime / 60);
  const elapsedSeconds = Math.floor(audio.currentTime % 60);
  elapsedTimeDisplay.textContent = `${elapsedMinutes}:${
    elapsedSeconds < 10 ? "0" : ""
  }${elapsedSeconds}`;
  seekBar.value = (audio.currentTime / audio.duration) * 100;
}

// Update total time on metadata load
audio.addEventListener("loadedmetadata", () => {
  updateTotalTime();
});

//play next song in the playlist when track ends
audio.addEventListener("ended", () => {
  const activePlaylistItems = document.querySelector("#playlist li.active");
  activePlaylistItems ? activePlaylistItems.classList.remove("active") : null;

  if (currentTrackIndex < playlist.length - 1) {
    currentTrackIndex++;
    loadTrack(currentTrackIndex);
    playPauseButton.click();
  } else {
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    playerContainer.classList.remove("active");
  }
});

// Function to update the total time
function updateTotalTime() {
  const totalMinutes = Math.floor(audio.duration / 60);
  const totalSeconds = Math.floor(audio.duration % 60);
  totalTimeDisplay.textContent = `${totalMinutes}:${
    totalSeconds < 10 ? "0" : ""
  }${totalSeconds}`;
  seekBar.max = 100;
}

// Switch button to play when song ends
// audio.addEventListener("ended", () => {
//   playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
//   isPlaying = false;
//   playerContainer.classList.remove("active");
// });

// Seek functionality
seekBar.addEventListener("input", () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Volume control
volumeSlider.addEventListener("input", () => {
  const volumeLevel = volumeSlider.value;
  audio.volume = volumeLevel;
  if (volumeLevel == 0) {
    volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else if (volumeLevel <= 0.5) {
    volumeButton.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
});

// Volume button toggling mute/unmute
volumeButton.addEventListener("click", () => {
  if (audio.muted) {
    audio.muted = false;
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    audio.muted = true;
    volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
});

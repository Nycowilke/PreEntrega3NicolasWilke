const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");
ulTag = wrapper.querySelector("ul");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
localStorage.setItem("currentMusicIndex", musicIndex);

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong();
  ulTag = wrapper.querySelector("ul")
});
function loadMusic(indexNumb){
 const { name, artist, src } = allMusic[indexNumb - 1];
  musicName.innerText = name;
  musicArtist.innerText = artist;
  musicImg.src = `images/${src}.jpg`;
  mainAudio.src = `songs/${src}.mp3`;
  localStorage.setItem('allMusic', JSON.stringify(allMusic));
}
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}
function prevMusic(){
  musicIndex--; 
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}
function nextMusic(){
  musicIndex++; 
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; 
  const duration = e.target.duration; 
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ 
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; 
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});
mainAudio.addEventListener("ended", ()=>{
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat":
      nextMusic(); 
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; 
      loadMusic(musicIndex); 
      playMusic(); 
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); 
      musicIndex = randIndex; 
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const liElements = allMusic.map((music, index) => {
  const liTag = document.createElement("li");
  liTag.setAttribute("li-index", index + 1);

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  const spanName = document.createElement("span");
  spanName.innerText = music.name;

  const pArtist = document.createElement("p");
  pArtist.innerText = music.artist;

  rowDiv.appendChild(spanName);
  rowDiv.appendChild(pArtist);

  const audioDuration = document.createElement("span");
  audioDuration.id = music.src;
  audioDuration.classList.add("audio-duration");
  audioDuration.innerText = music.duration;

  const audioTag = document.createElement("audio");
  audioTag.classList.add(music.src);
  audioTag.src = `songs/${music.src}.mp3`;

  liTag.appendChild(rowDiv);
  liTag.appendChild(audioDuration);
  liTag.appendChild(audioTag);

  audioTag.addEventListener("loadeddata", () => {
    let duration = audioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    audioDuration.innerText = `${totalMin}:${totalSec}`;
    audioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });

  return liTag;
});

ulTag.append(...liElements);

function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");
  allLiTag.forEach((li, i) => {
    if (i === musicIndex) {
      li.classList.add("playing");
      li.querySelector(".audio-duration").innerText = "Playing";
    } else {
      li.classList.remove("playing");
      const duration = li.querySelector(".audio-duration");
      const durationText = duration.getAttribute("t-duration");
      li.addEventListener("click", () => clicked(li, i + 1));
      duration.innerText = durationText;
    }
  });
}

function clicked(li, additionalIndex = 0) {
  musicIndex = li.liIndex + additionalIndex;
  playMusic();
}

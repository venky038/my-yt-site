const API_KEY = "AIzaSyDAGO0gTV7UG1PeRF-w-wEjyGRNvz9iDpI";
const CHANNEL_ID = "UC2Nm5nz_4YsPXvTjaoCesyw";

const videoList = document.getElementById("videoList");
const shortsList = document.getElementById("shortsList");
const searchInput = document.getElementById("search");

async function fetchVideos() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`;

  const res = await fetch(url);
  const data = await res.json();

  data.items.forEach(item => {
    if (!item.id.videoId) return;

    const isShort = item.snippet.title.toLowerCase().includes("short");
    const container = isShort ? shortsList : videoList;

    const videoEl = document.createElement("div");
    videoEl.className = "video-item";
    videoEl.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${item.id.videoId}" title="${item.snippet.title}" allowfullscreen></iframe>
      <span>${item.snippet.title}</span>
    `;
    container.appendChild(videoEl);
  });
}

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const allVideos = document.querySelectorAll(".video-item");
  allVideos.forEach(v => {
    const title = v.innerText.toLowerCase();
    v.style.display = title.includes(query) ? "block" : "none";
  });
});

fetchVideos();

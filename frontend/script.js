const videoList = document.getElementById("videoList");
const shortsList = document.getElementById("shortsList");
const searchInput = document.getElementById("search");

async function fetchVideos() {
  const res = await fetch("http://localhost:5000/videos");
  const data = await res.json();

  const videoIds = data.items.filter(item => item.id.videoId).map(item => item.id.videoId);
  if (videoIds.length === 0) return;

  const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds.join(",")}&key=YOUR_PUBLICLY_SAFE_API_KEY`);
  const details = await detailsRes.json();

  details.items.forEach(video => {
    const title = video.snippet.title;
    const videoId = video.id;
    const duration = parseISODuration(video.contentDetails.duration);
    const isShort = duration <= 60;
    const container = isShort ? shortsList : videoList;

    const videoEl = document.createElement("div");
    videoEl.className = "video-item";
    videoEl.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}" title="${title}" allowfullscreen></iframe>
      <span>${title}</span>
    `;
    container.appendChild(videoEl);
  });
}

async function fetchShortsFromPlaylist() {
  const res = await fetch("http://localhost:5000/shorts");
  const data = await res.json();

  if (data.items) {
    data.items.forEach(item => {
      const videoId = item.snippet.resourceId.videoId;
      const title = item.snippet.title;

      const videoEl = document.createElement("div");
      videoEl.className = "video-item";
      videoEl.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" title="${title}" allowfullscreen></iframe>
        <span>${title}</span>
      `;
      shortsList.appendChild(videoEl);
    });
  }
}

function parseISODuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || 0, 10);
  const minutes = parseInt(match?.[2] || 0, 10);
  const seconds = parseInt(match?.[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
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
fetchShortsFromPlaylist();

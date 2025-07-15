const API_KEY = "AIzaSyDAGO0gTV7UG1PeRF-w-wEjyGRNvz9iDpI";
const CHANNEL_ID = "UC2Nm5nz_4YsPXvTjaoCesyw";
const videoList = document.getElementById("videoList");
const shortsList = document.getElementById("shortsList");
const searchInput = document.getElementById("search");

async function fetchVideos() {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}` +
                    `&part=snippet,id&order=date&maxResults=20`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error.message);
      return;
    }

    const videoIds = data.items
      .filter(item => item.id.videoId)
      .map(item => item.id.videoId);

    if (videoIds.length === 0) return;

    // Now fetch details including duration
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(",")}&part=snippet,contentDetails`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    videosData.items.forEach(video => {
      const title = video.snippet.title;
      const videoId = video.id;
      const duration = parseISODuration(video.contentDetails.duration); // in seconds

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

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// Converts ISO 8601 duration format (e.g. PT59S) to seconds
function parseISODuration(iso) {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0, 10);
  const seconds = parseInt(match?.[2] || 0, 10);
  return minutes * 60 + seconds;
}

// Search bar filter
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const allVideos = document.querySelectorAll(".video-item");
  allVideos.forEach(v => {
    const title = v.innerText.toLowerCase();
    v.style.display = title.includes(query) ? "block" : "none";
  });
});

fetchVideos();

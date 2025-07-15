const API_KEY = "AIzaSyDAGO0gTV7UG1PeRF-w-wEjyGRNvz9iDpI";
const CHANNEL_ID = "UC2Nm5nz_4YsPXvTjaoCesyw";
const SHORTS_PLAYLIST_ID = "PLky6lAH5zVJS4A9nJr6lBnpmPXUoK9FpU";

const videoList = document.getElementById("videoList");
const shortsList = document.getElementById("shortsList");
const searchInput = document.getElementById("search");

async function fetchVideos() {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data.error) {
      console.error("YouTube API Error:", data.error.message);
      return;
    }

    const videoIds = data.items.filter(item => item.id.videoId).map(item => item.id.videoId);
    if (videoIds.length === 0) return;

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(",")}&part=snippet,contentDetails`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    videosData.items.forEach(video => {
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

  } catch (err) {
    console.error("Fetch error:", err);
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

async function fetchShortsFromPlaylist() {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${SHORTS_PLAYLIST_ID}&maxResults=20&key=${API_KEY}`;

  try {
    const res = await fetch(url);
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

  } catch (error) {
    console.error("Error fetching Shorts playlist:", error);
  }
}

fetchVideos();
fetchShortsFromPlaylist();

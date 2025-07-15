from flask import Flask, jsonify
import requests, os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

API_KEY = os.getenv("YT_API_KEY")
CHANNEL_ID = os.getenv("CHANNEL_ID")
SHORTS_PLAYLIST_ID = os.getenv("SHORTS_PLAYLIST_ID")

app = Flask(__name__)
CORS(app)

@app.route("/videos")
def videos():
    search_url = f"https://www.googleapis.com/youtube/v3/search?key={API_KEY}&channelId={CHANNEL_ID}&part=snippet,id&order=date&maxResults=50"
    res = requests.get(search_url)
    return res.json()

@app.route("/shorts")
def shorts():
    shorts_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={SHORTS_PLAYLIST_ID}&maxResults=20&key={API_KEY}"
    res = requests.get(shorts_url)
    return res.json()

if __name__ == "__main__":
    app.run()

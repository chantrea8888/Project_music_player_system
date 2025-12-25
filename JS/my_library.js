document.addEventListener('DOMContentLoaded', function() {

    // DOM Elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const loopBtn = document.getElementById('loop-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressContainer = document.querySelector('.progress-bar');
    const progressBar = document.getElementById('song-progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const songTitleEl = document.getElementById('song-title');
    const songArtistEl = document.getElementById('song-artist');
    const albumArtEl = document.getElementById('album-art');
    const nowPlayingList = document.getElementById('now-playing-list');

    // App State
    const state = {
        currentSongIndex: 0,
        isPlaying: false,
        isShuffled: false,
        isLooping: false,
        volume: 80,
        currentPlaylist: [],
        shuffledPlaylist: [],
        audioElement: null
    };

    // Sample Songs
    const sampleSongs = [
        {
            id: 1,
            title: "VANNDA-THIEF",
            artist: "Vannda",
            duration: "3:04",
            albumArt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4Hrv_kSLO30u9azM0mS5brAf_1ZOE8Iu8SA&s",
            fileUrl: "Music/VANNDA-THIEF.mp3",
            lyrics: [] // You can add lyrics later
        },
        {
            id: 2,
            title: "កើតមកខុសគេ",
            artist: "Vannda",
            duration: "2:21",
            albumArt: "https://i.ytimg.com/vi/6KZ0TlsFtV4/maxresdefault.jpg",
            fileUrl: "Music/vanda-song-kh-vannda-koetmkkhusge-some-time-skull-2-2022.m4a",
            lyrics: []
        }
    ];

    state.currentPlaylist = [...sampleSongs];

    // Initialize Audio
    function initAudioElement() {
        if (state.audioElement) {
            state.audioElement.pause();
            state.audioElement.removeEventListener('timeupdate', updateProgress);
            state.audioElement.removeEventListener('loadedmetadata', updateDuration);
            state.audioElement.removeEventListener('ended', handleSongEnd);
        }

        const currentSong = getCurrentSong();
        state.audioElement = new Audio(currentSong.fileUrl);
        state.audioElement.volume = state.volume / 100;

        state.audioElement.addEventListener('timeupdate', updateProgress);
        state.audioElement.addEventListener('loadedmetadata', updateDuration);
        state.audioElement.addEventListener('ended', handleSongEnd);

        updateSongInfo();
        updateNowPlayingList();
        updatePlayPauseButton();
        totalTimeEl.textContent = currentSong.duration; // fallback if metadata slow
    }

    function getCurrentSong() {
        const playlist = state.isShuffled ? state.shuffledPlaylist : state.currentPlaylist;
        return playlist[state.currentSongIndex];
    }

    function updateSongInfo() {
        const song = getCurrentSong();
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        albumArtEl.src = song.albumArt;
        albumArtEl.alt = `${song.title} Album Art`;
        document.title = `${song.title} - ${song.artist}`;
    }

    function updatePlayPauseButton() {
        const icon = playPauseBtn.querySelector('i');
        if (state.isPlaying) {
            icon.classList.replace('fa-play', 'fa-pause');
            playPauseBtn.title = "Pause";
        } else {
            icon.classList.replace('fa-pause', 'fa-play');
            playPauseBtn.title = "Play";
        }
    }

    function updateDuration() {
        if (state.audioElement && state.audioElement.duration) {
            totalTimeEl.textContent = formatTime(state.audioElement.duration);
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    }

    function updateProgress() {
        if (!state.audioElement || !state.audioElement.duration) return;

        const percent = (state.audioElement.currentTime / state.audioElement.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(state.audioElement.currentTime);
    }

    function handleSongEnd() {
        if (state.isLooping) {
            state.audioElement.currentTime = 0;
            state.audioElement.play();
        } else {
            playNextSong();
        }
    }

    function playSong(index) {
        state.currentSongIndex = index;
        initAudioElement();
        state.audioElement.play();
        state.isPlaying = true;
        updatePlayPauseButton();
        updateNowPlayingList();
    }

    function togglePlayPause() {
        if (!state.audioElement) return;

        if (state.isPlaying) {
            state.audioElement.pause();
        } else {
            state.audioElement.play();
        }
        state.isPlaying = !state.isPlaying;
        updatePlayPauseButton();
    }

    function playNextSong() {
        state.currentSongIndex = (state.currentSongIndex + 1) % state.currentPlaylist.length;
        playSong(state.currentSongIndex);
    }

    function playPrevSong() {
        state.currentSongIndex = state.currentSongIndex === 0 
            ? state.currentPlaylist.length - 1 
            : state.currentSongIndex - 1;
        playSong(state.currentSongIndex);
    }

    function toggleShuffle() {
        state.isShuffled = !state.isShuffled;
        shuffleBtn.classList.toggle('active', state.isShuffled);

        if (state.isShuffled) {
            // Create shuffled version (excluding current song to avoid immediate repeat)
            const remaining = state.currentPlaylist.filter((_, i) => i !== state.currentSongIndex);
            for (let i = remaining.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
            }
            state.shuffledPlaylist = [getCurrentSong(), ...remaining];
        }
    }

    function toggleLoop() {
        state.isLooping = !state.isLooping;
        loopBtn.classList.toggle('active', state.isLooping);
    }

    // Render Now Playing List
    function updateNowPlayingList() {
        nowPlayingList.innerHTML = '';
        state.currentPlaylist.forEach((song, index) => {
            const isActive = index === state.currentSongIndex;
            const item = document.createElement('div');
            item.className = `playlist-item p-3 rounded mb-2 ${isActive ? 'active-song' : ''}`;
            item.style.cursor = 'pointer';
            item.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${song.albumArt}" alt="art" class="me-3" style="width:50px; height:50px; object-fit:cover; border-radius:6px;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 ${isActive ? 'text-white' : ''}">${song.title}</h6>
                        <p class="mb-0 small text-muted">${song.artist}</p>
                    </div>
                    <span class="text-muted small">${song.duration}</span>
                    ${isActive ? '<i class="fas fa-play ms-3 text-primary"></i>' : ''}
                </div>
            `;
            item.addEventListener('click', () => playSong(index));
            nowPlayingList.appendChild(item);
        });
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', toggleLoop);

    volumeSlider.addEventListener('input', (e) => {
        state.volume = e.target.value;
        if (state.audioElement) state.audioElement.volume = state.volume / 100;
    });

    // Click on progress bar to seek
    progressContainer.addEventListener('click', (e) => {
        if (!state.audioElement || !state.audioElement.duration) return;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percent = clickX / width;
        state.audioElement.currentTime = percent * state.audioElement.duration;
    });

    // Initial Load
    initAudioElement();
});
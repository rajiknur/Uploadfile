// script.js - Improved version with better structure and error handling

// Global variables
let userData = null;
let currentLyricIndex = -1;
let songDuration = 0;
let isPlaying = false;
let isFirstInteraction = true;

// DOM Elements
const elements = {
    profilePic: document.getElementById('profilePic'),
    profileName: document.getElementById('profileName'),
    profileBio: document.getElementById('profileBio'),
    linksContainer: document.getElementById('linksContainer'),
    currentYear: document.getElementById('currentYear'),
    albumArt: document.getElementById('albumArt'),
    songTitle: document.getElementById('songTitle'),
    artist: document.getElementById('artist'),
    lyrics: document.getElementById('lyrics'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playPauseIcon: document.getElementById('playPauseIcon'),
    musicPlayer: document.getElementById('musicPlayer'),
    musicToggle: document.getElementById('musicToggle'),
    progressBar: document.getElementById('progressBar'),
    currentTimeDisplay: document.getElementById('currentTime'),
    totalTimeDisplay: document.getElementById('totalTime'),
    welcomePanel: document.getElementById('welcomePanel'),
    welcomeCloseBtn: document.getElementById('welcomeCloseBtn'),
    audioPlayer: document.getElementById('audioPlayer'),
    progressContainer: document.querySelector('.progress-container')
};

/**
 * Check and show welcome panel based on last visit time
 */
function checkWelcomePanel() {
    try {
        const lastVisit = localStorage.getItem('lastVisit');
        const currentTime = Date.now();
        
        if (!lastVisit || (currentTime - parseInt(lastVisit)) > 60000) {
            elements.welcomePanel.classList.add('visible');
            localStorage.setItem('lastVisit', currentTime.toString());
        }
    } catch (error) {
        console.error('Error in welcome panel:', error);
    }
}

/**
 * Calculate average color from image for dynamic theming
 */
function getAverageColor(imageElement, callback) {
    try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const extractColor = () => {
            canvas.width = Math.min(imageElement.width, 100);
            canvas.height = Math.min(imageElement.height, 100);
            context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0;
            let pixelCount = 0;
            
            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
                pixelCount++;
            }
            
            r = Math.floor(r / pixelCount);
            g = Math.floor(g / pixelCount);
            b = Math.floor(b / pixelCount);
            
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const textColor = brightness > 128 ? '33, 33, 33' : '255, 255, 255';
            const bgColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
            const hue1 = Math.floor(Math.random() * 360);
            const hue2 = (hue1 + 180) % 360;
            const primaryColor = `hsl(${hue1}, 70%, 50%)`;
            const secondaryColor = `hsl(${hue2}, 70%, 50%)`;

            callback(bgColor, `rgb(${textColor})`, textColor, primaryColor, secondaryColor);
        };

        if (!imageElement.complete) {
            imageElement.onload = extractColor;
        } else {
            extractColor();
        }
    } catch (error) {
        console.error('Error calculating average color:', error);
        // Fallback colors
        callback('rgba(100, 100, 100, 0.15)', 'rgb(33, 33, 33)', '33, 33, 33', 'hsl(200, 70%, 50%)', 'hsl(20, 70%, 50%)');
    }
}

/**
 * Initialize the app with JSON data
 */
function initializeFromJSON(data) {
    try {
        userData = data;

        // Set profile information
        elements.profileName.textContent = data.profile.name || '';
        elements.profileBio.innerHTML = data.profile.bio || '';
        elements.profilePic.src = data.profile.image || '';
        
        elements.profilePic.onload = function() {
            getAverageColor(elements.profilePic, (bgColor, textColor, textColorRgb, primaryColor, secondaryColor) => {
                document.body.style.backgroundColor = bgColor;
                document.documentElement.style.setProperty('--bg-color', bgColor);
                document.documentElement.style.setProperty('--text-color', textColor);
                document.documentElement.style.setProperty('--text-color-rgb', textColorRgb);
                document.documentElement.style.setProperty('--primary-color', primaryColor);
                document.documentElement.style.setProperty('--secondary-color', secondaryColor);
            });
        };

        // Create links
        elements.linksContainer.innerHTML = '';
        data.links.forEach((link, index) => {
            if (!link.url || !link.title) return;
            
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.className = 'link-item animate-link';
            linkElement.style.animationDelay = `${0.1 * (index + 1)}s`;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            
            if (link.icon) {
                const icon = document.createElement('i');
                icon.className = link.icon;
                linkElement.appendChild(icon);
            }
            
            linkElement.appendChild(document.createTextNode(link.title));
            elements.linksContainer.appendChild(linkElement);
        });

        // Set music information
        elements.songTitle.textContent = data.music.title || '';
        elements.artist.textContent = data.music.artist || '';
        elements.albumArt.src = data.music.albumArt || '';
        
        // Initialize audio player
        if (data.music.audioFile) {
            elements.audioPlayer.src = data.music.audioFile;
            
            elements.audioPlayer.addEventListener('loadedmetadata', function() {
                songDuration = elements.audioPlayer.duration;
                elements.totalTimeDisplay.textContent = formatTime(songDuration);
            });

            elements.audioPlayer.addEventListener('timeupdate', updatePlayerProgress);
            elements.audioPlayer.addEventListener('ended', handleAudioEnd);
        } else {
            songDuration = data.music.duration || 0;
            elements.totalTimeDisplay.textContent = formatTime(songDuration);
        }
        
        // Initialize lyrics
        if (data.music.timeSync && Array.isArray(data.music.timeSync)) {
            updateLyricsDisplay(0);
        } else {
            elements.lyrics.textContent = data.music.lyrics || "No lyrics available";
        }
        
        elements.currentYear.textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error initializing from JSON:', error);
    }
}

/**
 * Update player progress bar and time display
 */
function updatePlayerProgress() {
    const currentTime = elements.audioPlayer.currentTime;
    elements.currentTimeDisplay.textContent = formatTime(currentTime);
    const percent = (currentTime / songDuration) * 100;
    elements.progressBar.style.width = `${percent}%`;
    updateLyricsDisplay(currentTime);
}

/**
 * Handle audio end event
 */
function handleAudioEnd() {
    elements.audioPlayer.currentTime = 0;
    if (isPlaying) {
        elements.audioPlayer.play();
    } else {
        isPlaying = false;
        elements.playPauseIcon.className = 'fas fa-play';
    }
}

/**
 * Update lyrics display based on current time
 */
function updateLyricsDisplay(time) {
    if (!userData || !userData.music.timeSync) return;

    try {
        let lyricArray = userData.music.timeSync;
        if (Array.isArray(lyricArray) && lyricArray.length > 0 && Array.isArray(lyricArray[0])) {
            lyricArray = lyricArray[0];
        }

        let currentLyric = null;
        let newLyricIndex = -1;
        
        for (let i = 0; i < lyricArray.length; i++) {
            if (lyricArray[i].time <= time) {
                currentLyric = lyricArray[i];
                newLyricIndex = i;
            } else {
                break;
            }
        }

        if (currentLyric && newLyricIndex !== currentLyricIndex) {
            currentLyricIndex = newLyricIndex;
            elements.lyrics.innerHTML = '';
            
            const lyricLine = document.createElement('div');
            lyricLine.className = 'lyrics-line active';
            lyricLine.textContent = currentLyric.text;
            
            elements.lyrics.appendChild(lyricLine);
            
            lyricLine.classList.add('lyrics-fade-in');
            setTimeout(() => {
                lyricLine.classList.remove('lyrics-fade-in');
            }, 500);
        }
    } catch (error) {
        console.error('Error updating lyrics:', error);
    }
}

/**
 * Format time in MM:SS format
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Toggle play/pause state
 */
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        elements.playPauseIcon.className = 'fas fa-pause';
        if (elements.audioPlayer.src) {
            elements.audioPlayer.play().catch(error => {
                console.error('Playback failed:', error);
                isPlaying = false;
                elements.playPauseIcon.className = 'fas fa-play';
            });
        }
    } else {
        elements.playPauseIcon.className = 'fas fa-play';
        if (elements.audioPlayer.src) {
            elements.audioPlayer.pause();
        }
    }
}

/**
 * Handle progress bar click
 */
function handleProgressClick(e) {
    if (elements.audioPlayer.src) {
        const rect = elements.progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        elements.audioPlayer.currentTime = percent * songDuration;
    }
}

/**
 * First interaction handler
 */
function handleFirstInteraction() {
    if (isFirstInteraction) {
        isFirstInteraction = false;
        if (!isPlaying) {
            togglePlayPause();
        }
        document.removeEventListener('click', handleFirstInteraction, true);
    }
}

// Event Listeners
elements.welcomeCloseBtn.addEventListener('click', () => {
    elements.welcomePanel.classList.remove('visible');
});

elements.musicToggle.addEventListener('click', () => {
    elements.musicPlayer.classList.toggle('hidden');
});

elements.playPauseBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePlayPause();
});

elements.progressContainer.addEventListener('click', handleProgressClick);
document.addEventListener('click', handleFirstInteraction, true);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkWelcomePanel();
    
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            initializeFromJSON(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            // Fallback content or error message
            elements.profileName.textContent = 'Error Loading Content';
            elements.profileBio.textContent = 'Please check your connection and refresh the page.';
        });
});
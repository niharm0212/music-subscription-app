// main.js

const songSearchForm = document.getElementById('songSearchForm');
const songResultsContainer = document.getElementById('songResults');

songSearchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('artist').value;
    const album = document.getElementById('album').value;

    const query = new URLSearchParams({
        title,
        artist,
        album,
    });

    try {
        const response = await fetch(`/songs?${query.toString()}`);
        const songs = await response.json();

        songResultsContainer.innerHTML = '';
        if (songs.length > 0) {
            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('song-item');
                songItem.innerHTML = `
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                    <p>${song.album} (${song.year})</p>
                `;
                songResultsContainer.appendChild(songItem);
            });
        } else {
            songResultsContainer.innerHTML = '<p>No songs found</p>';
        }
    } catch (error) {
        console.error('Error fetching songs:', error);
        songResultsContainer.innerHTML = '<p>Error fetching songs</p>';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const gamesListElement = document.getElementById('games-list');
    const apiUrl = 'https://raw.githubusercontent.com/Gabr322/turbo-octo-waffle/refs/heads/main/ye.json'; // GitHub raw URL

    // Fetch the games data from GitHub
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayGames(data.games);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Display the games with their icons
    function displayGames(games) {
        gamesListElement.innerHTML = games.map(game => {
            return `
                <div class="game" onclick="window.location.href='game.html?game_id=${game.id}'">
                    <img src="${game.icon}" alt="${game.name}">
                    <h3>${game.name}</h3>
                </div>
            `;
        }).join('');
    }
});

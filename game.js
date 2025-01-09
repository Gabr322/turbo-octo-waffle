document.addEventListener('DOMContentLoaded', function() {
    const speedrunsListElement = document.getElementById('speedruns-list');
    const gameTitleElement = document.getElementById('game-title');
    const categorySelect = document.getElementById('category-select');
    const subcategorySelect = document.getElementById('subcategory-select');
    const apiUrl = 'https://raw.githubusercontent.com/Gabr322/turbo-octo-waffle/refs/heads/main/ye.json'; // GitHub raw URL

    // Check if elements exist before adding event listeners
    if (!categorySelect || !subcategorySelect || !speedrunsListElement || !gameTitleElement) {
        console.error('Required HTML elements not found.');
        return; // Stop script execution if elements are missing
    }

    // Get the game ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('game_id'));

    // Fetch the games data from GitHub
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const game = data.games.find(g => g.id === gameId);
            const gameSpeedruns = data.speedruns.filter(speedrun => speedrun.game_id === gameId);

            // Set the game title
            gameTitleElement.textContent = game.name;

            // Populate the category dropdown
            populateCategoryDropdown(game.categories);

            // Display the speedruns for the selected game
            displaySpeedruns(gameSpeedruns);

            // Add event listeners for category and subcategory filters
            categorySelect.addEventListener('change', function() {
                updateSubcategories(game.categories);
                filterSpeedruns(gameSpeedruns);
            });

            subcategorySelect.addEventListener('change', function() {
                filterSpeedruns(gameSpeedruns);
            });

            // Function to update subcategory dropdown based on selected category
            function updateSubcategories(categories) {
                const selectedCategory = categorySelect.value;
                const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
                
                // Clear existing subcategory options
                subcategorySelect.innerHTML = '<option value="all">All Subcategories</option>';
                
                if (selectedCategoryData && selectedCategoryData.subcategories) {
                    selectedCategoryData.subcategories.forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory;
                        option.textContent = subcategory;
                        subcategorySelect.appendChild(option);
                    });
                }
            }

            // Function to filter speedruns based on selected category and subcategory
            function filterSpeedruns(speedruns) {
                const selectedCategory = categorySelect.value;
                const selectedSubcategory = subcategorySelect.value;
                
                let filteredSpeedruns = speedruns;

                // Filter by category
                if (selectedCategory !== 'all') {
                    filteredSpeedruns = filteredSpeedruns.filter(speedrun => speedrun.category === selectedCategory);
                }

                // Filter by subcategory
                if (selectedSubcategory !== 'all') {
                    filteredSpeedruns = filteredSpeedruns.filter(speedrun => speedrun.subcategory === selectedSubcategory);
                }

                displaySpeedruns(filteredSpeedruns);
            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Populate the category dropdown
    function populateCategoryDropdown(categories) {
        categorySelect.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // Display the speedruns, sorted by time
    function displaySpeedruns(speedruns) {
        // Sort the speedruns by time (ascending order)
        speedruns.sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));

        speedrunsListElement.innerHTML = speedruns.map((speedrun, index) => {
            return `
                <div class="speedrun">
                    <p><strong>Place:</strong> ${getPlace(speedrun.place)}</p>
                    <p><strong>Player:</strong> ${speedrun.player}</p>
                    <p><strong>Category:</strong> ${speedrun.category}</p>
                    <p><strong>Subcategory:</strong> ${speedrun.subcategory}</p>
                    <p><strong>Time:</strong> ${speedrun.time}</p>
                    <p><strong>Date:</strong> ${speedrun.date}</p>
                    <p><a href="${speedrun.video_url}" target="_blank">Watch on YouTube</a></p>
                </div>
            `;
        }).join('');
    }

    // Helper function to convert time (MM:SS.mmm) to seconds for comparison
    function timeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        const minutes = parseInt(parts[0], 10);
        const seconds = parseFloat(parts[1]);
        return (minutes * 60) + seconds;
    }

    // Function to return a place label (1st, 2nd, 3rd, etc.)
    function getPlace(position) {
        if (position === 1) return "1st";
        else if (position === 2) return "2nd";
        else if (position === 3) return "3rd";
        else return `${position}th`;
    }
});

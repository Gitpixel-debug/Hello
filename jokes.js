document.addEventListener('DOMContentLoaded', function () {
    const getJokeBtn = document.querySelector('#getjoke');
    const settingsBtn = document.querySelector('#settings');
    const settingsDiv = document.getElementById('settings_div');
    const jokesList = document.querySelector('#jokes_list');

    let lang = 'en';
    let amount = 2;

function handleSettingsClick() {
    // If the settings div is open, get the data before closing
    if (settingsDiv.innerHTML !== '') {
        // Find the form elements inside the currently displayed div
        const dropdown = document.getElementById('language-select');
        const amountRange = document.getElementById('amount_range');

        // Check if the elements exist before trying to read their values
        if (dropdown && amountRange) {
            lang = dropdown.value;
            amount = parseInt(amountRange.value);
        }

        // Hide the div
        settingsDiv.innerHTML = '';
        return;
    }

        // Otherwise, show the settings form
        settingsDiv.innerHTML = `
            <form id="my_form" class="card card-body bg-white shadow-sm">
                <div class="mb-3">
                    <label for="language-select" class="form-label">Choose a language:</label>
                    <select name="language" id="language-select" class="form-select">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="cs">Czech</option>
                        <option value="pt">Portuguese</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="amount_range" class="form-label">Amount (1–10):</label>
                    <input type="range" id="amount_range" name="amount" min="1" max="10" value="${amount}" class="form-range">
                    <span id="amount_value" class="ms-2 fw-bold">${amount}</span>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        `;

        // Wait for the new form elements to be in the DOM
        let dropdown = document.getElementById('language-select');
        let amountRange = document.getElementById('amount_range');
        let amountValueDisplay = document.getElementById('amount_value');
        let myForm = document.getElementById('my_form');

        // Set the default values
        dropdown.value = lang;

        // Add event listener for the range input
        amountRange.addEventListener('input', function () {
            amountValueDisplay.textContent = this.value;
        });

        // Add submit listener to the form
        myForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            lang = formData.get('language');
            amount = parseInt(formData.get('amount'));
            settingsDiv.innerHTML = ''; // Clear and hide the settings div on submit
        });
    }

    settingsBtn.addEventListener('click', handleSettingsClick);

    // Your existing get joke functionality
    getJokeBtn.onclick = function () {
        getJokeBtn.disabled = true;
        jokesList.innerHTML = '';
        fetch(`https://v2.jokeapi.dev/joke/Any?lang=${lang}&blacklistFlags=nsfw,religious,political,racist,sexist&amount=${amount}`)
            .then(response => response.json())
            .then(data => amount === 1 ? [data] : data.jokes)
            .then(jokes => {
                jokes.forEach(item => {
                    const jokeContainer = document.createElement('li');
                    jokeContainer.className = 'list-group-item mb-3';
                    const setupText = document.createElement('p');
                    setupText.className = 'fw-bold';
                    if (item.delivery) {
                        setupText.textContent = item.setup;
                    } else {
                        setupText.textContent = item.joke;
                    }
                    jokeContainer.append(setupText);
                    if (item.delivery) {
                        const revealBtn = document.createElement('button');
                        revealBtn.textContent = 'Reveal';
                        revealBtn.className = 'btn btn-sm btn-outline-success mt-2';
                        jokeContainer.append(revealBtn);
                        const punchlineText = document.createElement('p');
                        punchlineText.textContent = item.delivery;
                        punchlineText.className = 'mt-2';
                        punchlineText.style.display = 'none';
                        jokeContainer.append(punchlineText);
                        revealBtn.onclick = function () {
                            punchlineText.style.display = 'block';
                            revealBtn.disabled = true;
                            revealBtn.style.display = 'none';
                        };
                    }
                    jokesList.append(jokeContainer);
                });
                getJokeBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error fetching joke:', error);
                getJokeBtn.disabled = false;
            });
    };
});

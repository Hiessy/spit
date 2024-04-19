document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with a global view
    var map = L.map('map').setView([0, 0], 2);

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Event listener for form submission
    document.getElementById('messageForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const message = document.getElementById('message').value.trim();

        if (message === '') {
            alert('Please enter a message.');
            return;
        }

        // Retrieve user's coordinates
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const data = { message: message, coordinates: { latitude: latitude, longitude: longitude } };
                sendMessage(data);

                // Zoom in to the user's location
                map.setView([latitude, longitude], 10); // Adjust zoom level as needed
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }

        document.getElementById('message').value = '';
    });


    // Function to send message data to server
    function sendMessage(data) {
        fetch('/send_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    // Event listener for the "Display Coordinates" button
    document.getElementById('displayCoordinates').addEventListener('click', function() {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.style.display = 'block';
        displayMessages();
    });

    // Function to retrieve and display messages from the server
    function displayMessages() {
        fetch('/get_messages')
        .then(response => response.json())
        .then(messages => {
            displayMessagesOnMap(messages); // Display messages on the map
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to display messages on the map as markers
    function displayMessagesOnMap(messages) {
        messages.forEach(message => {
            const coordinates = [message.coordinates.latitude, message.coordinates.longitude];
            const marker = L.marker(coordinates).addTo(map);
            marker.bindPopup(message.message);
        });
    }
});

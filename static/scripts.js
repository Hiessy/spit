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
            const data = {message: message, coordinates: {latitude: latitude, longitude: longitude}};
            sendMessage(data);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }

    document.getElementById('message').value = '';
});

function sendMessage(data) {
    fetch('/send_message', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

document.getElementById('displayCoordinates').addEventListener('click', function() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.style.display = 'block';
    displayMessages();
});

function displayMessages() {
    fetch('/get_messages')
    .then(response => response.json())
    .then(messages => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
            messagesDiv.innerHTML += `<p>${message.message} - Coordinates: (${message.coordinates.latitude}, ${message.coordinates.longitude})</p>`;
        });
    })
    .catch(error => console.error('Error:', error));
}

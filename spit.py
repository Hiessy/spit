from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

messages = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    content = request.json
    messages.append(content)
    
    # Save messages to a file
    save_messages_to_file(messages)
    
    return jsonify({'status': 'success'})

@app.route('/get_messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

def save_messages_to_file(messages):
    with open('messages.txt', 'w') as file:
        for message in messages:
            file.write(json.dumps(message) + '\n')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

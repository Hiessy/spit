from flask import Flask, render_template, request, jsonify, send_from_directory
import json

app = Flask(__name__)


messages = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/spit', methods=['POST'])
def send_message():
    content = request.json
    messages.append(content)
    
    # Save messages to a file
    save_messages_to_file(messages)
    
    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

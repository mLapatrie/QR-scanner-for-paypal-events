from flask import Flask, render_template, jsonify, request
import requests
from bs4 import BeautifulSoup


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/fetch-url', methods=['POST'])
def fetch_url():
    data = request.get_json()
    url = data.get('url')
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'lxml')
        
        table_body = soup.find('table')
        if table_body:
            
            ticket_scanned = ""
            
            rows = table_body.find_all('tr')
            if len(rows) >= 20:
                ticket_scan = rows[7]
                
                ticket_scanned = ticket_scan.find_all('td')[1]
                if "Yes" in ticket_scanned:
                    ticket_scanned = "Yes"
                elif "No" in ticket_scanned:
                    ticket_scanned = "No"
                
                tickets_type = rows[12:]
                
                print(tickets_type)
                
                tickets_type_html = ""
                
                for i in tickets_type:
                    tickets_type_html += "</br>" + str(i)
                
                
                return jsonify({
                    'content': str(response.text), 
                    'ticket_scanned': str(ticket_scanned),
                    'tickets_type': tickets_type_html,
                })
                
            else:
                return jsonify({'error': 'Not enough rows in the table'})
        else:
            return jsonify({'error': 'No table body found'})

    except requests.RequestException as e:
        return jsonify({'error': str(e)})
    

if __name__ == '__main__':
    app.run(debug=True)

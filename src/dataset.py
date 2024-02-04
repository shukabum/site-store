from math import radians, cos, sin, asin, sqrt
import pandas as pd
from flask import Flask, render_template, request, jsonify  # Add jsonify import
import re

from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Assuming 'data' is your DataFrame
data = pd.read_csv(r"C:\Users\user\OneDrive\Desktop\proj\site-store\src\Grocery_Store_Locations.csv")
data['CLEAN_ADDRESS'] = data['ADDRESS'].apply(lambda x: re.sub('[^A-Za-z0-9]+', ' ', x))
data['CLEAN_ADDRESS'] = data['CLEAN_ADDRESS'].str.replace('\d+', '', regex=True)

def haversine(lon1, lat1, lon2, lat2):
    # Convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon/2) ** 2
    a = max(min(a, 1), 0)  # Clamp 'a' to the valid range
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r


def recommend_nearby_stores(clean_address):
    clean_address = clean_address.lower().strip()  # convert to lowercase and remove leading/trailing spaces
    store = data[data['CLEAN_ADDRESS'].str.lower().str.strip() == clean_address]
    if store.empty:
        print(f"No store found for address: {clean_address}")
        return []
    lat, lon = store['Y'].iloc[0], store['X'].iloc[0]
    data['DISTANCE'] = data.apply(lambda row: haversine(lon, lat, row['X'], row['Y']), axis=1)
    nearest_stores = data.sort_values('DISTANCE')[:6]
    return nearest_stores['STORENAME'].to_list()# Convert to list
# print(recommend_nearby_stores('connecticut avenue nw'))

@app.route('/get_nearby_stores', methods=['POST'])
def get_nearby_stores():
    clean_address = request.form['clean_address']
    nearby_stores = recommend_nearby_stores(clean_address)
    return jsonify({"nearby_stores": nearby_stores})

if __name__ == '__main__':
    app.run(debug=True)

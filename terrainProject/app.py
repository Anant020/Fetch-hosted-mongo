from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return 'Terrain Analysis and Route Optimization Platform'

@app.route('/process_imagery', methods=['POST'])
def process_imagery():
    try:
        # Get the satellite imagery data from the request
        imagery_data = request.files['imagery'].read()

        # Preprocess the satellite imagery
        preprocessed_imagery = preprocess_imagery(imagery_data)

        # Analyze terrain features
        terrain_analysis = analyze_terrain(preprocessed_imagery)

        return jsonify({'terrain_analysis': terrain_analysis}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



def preprocess_imagery(imagery_data):
    # Convert the raw imagery data to an OpenCV image object
    image_array = np.frombuffer(imagery_data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Perform preprocessing tasks such as resizing and filtering
    resized_image = cv2.resize(image, (500, 500))
    # Additional preprocessing steps...
    # Example: Convert image to grayscale
    gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)

    return gray_image

def analyze_terrain(image):
    # Perform terrain analysis using OpenCV or other libraries
    # Example: Calculate mean pixel intensity as terrain feature
    mean_intensity = np.mean(image)
    terrain_analysis = {'mean_intensity': mean_intensity}
    # Additional analysis steps...
    # Example: Perform edge detection
    edges = cv2.Canny(image, 100, 200)
    # Example: Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    # Example: Calculate terrain slope
    slope = calculate_slope(contours)
    terrain_analysis['slope'] = slope

    return terrain_analysis

def calculate_slope(contours):
    # Calculate terrain slope from contours
    # Example implementation: Calculate the difference in y-coordinates
    if len(contours) > 0:
        # Assuming the first contour represents the terrain boundary
        boundary_contour = contours[0]
        ymin = np.min(boundary_contour[:,:,1])
        ymax = np.max(boundary_contour[:,:,1])
        slope = (ymax - ymin) / len(boundary_contour)
    else:
        slope = 0.0
    
    return slope

if __name__ == '__main__':
    app.run(debug=True)

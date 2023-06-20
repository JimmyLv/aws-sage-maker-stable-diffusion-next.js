from flask import Flask, render_template, url_for, request, jsonify
import boto3, json, os
import base64

app = Flask(__name__)

sm_runtime = boto3.client('runtime.sagemaker')


@app.route('/')
def index():
     return render_template('index.html')
     
     
@app.route('/predictor', methods=['POST','GET'])
def make_prediction():

    endpoint_name = "stable-diffusion-v1-5-endpoint"

    input_content = request.form['inputContent']
    input_contents = input_content.split(';')

    payload = {
        'prompt': input_contents, 
        'num_images_per_prompt': 1,
        'height' : int(request.form['width']),
        'width' : int(request.form['length'])
        }
        
    print("payload:", payload)

    encoded_payload = json.dumps(payload).encode("utf-8")

    # invoke SageMaker endpoint
    response = sm_runtime.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType='application/json',
        Body=encoded_payload,
    )

    response_dict = json.loads(response['Body'].read().decode())
    generated_images = response_dict["generated_images"] 
    
    return render_template('image.html', base64images=generated_images)
        
        
app.run(host='0.0.0.0', port=8080)

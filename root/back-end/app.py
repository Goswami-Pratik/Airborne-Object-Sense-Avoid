import glob
import io
import os
import random
import shutil
import zipfile

import cv2
import torch
from PIL import Image
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from loguru import logger

app = Flask(__name__)
CORS(app)

dictOfModels = {}
listOfKeys = []
bb_center = []
all_bb_centers = []
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
model = torch.hub.load('yolov5', 'custom', path='weights/best.pt', force_reload=True, source="local")


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_prediction(img_bytes, model):
    global bb_center
    global all_bb_centers
    img = Image.open(io.BytesIO(img_bytes))
    # inference
    results = model(img, size=1600)
    cord_thres = results.xyxyn[0][:, :-1].numpy()
    bb_width = cord_thres[0][2] - cord_thres[0][0]
    bb_height = cord_thres[0][3] - cord_thres[0][1]
    bb_center_x, bb_center_y = cord_thres[0][0] + bb_width / 2, cord_thres[0][1] + bb_height / 2
    bb_center = [bb_center_x, bb_center_y]
    all_bb_centers.append(bb_center)
    bb_info = {"width": bb_width, "height": bb_height, "x": bb_center_x, "y": bb_center_y}
    logger.info("Coordinates: {}, Frame: {}", cord_thres, bb_info)
    return results


def delete_folder():
    logger.info("Cleaning: UPLOAD_FOLDER")
    folder = "/workspace/UPLOAD_FOLDER"
    for file in os.listdir(folder):
        file_path = os.path.join(folder, file)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            logger.error('Failed to delete %s. Reason: %s' % (file_path, e))


def generate_video():
    os.chdir("/workspace/UPLOAD_FOLDER")
    filenames = glob.glob('*.*')
    logger.info("FILENAMES: {}", filenames)
    flight_folder = "/workspace/UPLOAD_FOLDER"
    with open("output.txt", "wb") as outfile:
        for filename in filenames:
            outfile.write(f"file {filename}\n".encode())
    if not os.path.isfile(flight_folder + 'flight.mp4'):
        logger.info("Generating video...")
        os.system("ffmpeg -y -r 10 -f concat -i output.txt -c:v libopenh264 -pix_fmt yuv420p flight.mp4")
        os.system("rm output.txt")
    logger.success("Video Successfully Generated")


@app.route('/', methods=['GET'])
def hello_world():
    return "HelloWorld"


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        files = request.files.getlist("files")
        generateVideo = request.form.get("generate_video")
        if files is None or len(files) == 0 or all(file.filename == "" for file in files):
            return jsonify({'Error': 'No files received'})
        if not all(allowed_file(file.filename) for file in files):
            return jsonify({'Error': 'File format not supported'})
        try:
            delete_folder()
            upload_directory = "/workspace/UPLOAD_FOLDER"
            for file in files:
                logger.info("Performing Predictions On: {}", file.filename)
                img_bytes = file.read()
                prediction = get_prediction(img_bytes, model)
                prediction.render()
                for img in prediction.imgs:
                    RGB_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    # all_bb_centers_converted = []
                    try:
                        base_img_width = img.shape[1]
                        base_img_height = img.shape[0]
                        center_x = int(bb_center[0] * base_img_width)
                        center_y = int(bb_center[1] * base_img_height)
                        image = cv2.circle(RGB_img, (center_x, center_y), radius=4, color=(0, 0, 255), thickness=-1)
                        for current_bb in all_bb_centers:
                            x = int(current_bb[0] * base_img_width)
                            y = int(current_bb[1] * base_img_height)
                            #all_bb_centers_converted.append([x, y])
                            image = cv2.circle(image, (x, y), radius=4, color=(0, 255, 0), thickness=3)
                        # i = 0
                        # while i < len(all_bb_centers_converted)-1:
                        #     cv2.line(image, all_bb_centers_converted[i], all_bb_centers_converted[i+1],
                        #              color=(0, 255, 0), thickness=3)
                        #     i += 1
                        frame_boundaries_x = [base_img_width/3, (base_img_width/3)*2]
                        frame_boundaries_y = [base_img_height/3, (base_img_height/3)*2]

                        object_frame_pos = [-1, -1]
                        if center_x < frame_boundaries_x[0]:
                            object_frame_pos[0] = "RIGHT"
                        elif center_x < frame_boundaries_x[1]:
                            object_frame_pos[0] = "MIDDLE"
                        else:
                            object_frame_pos[0] = "LEFT"

                        if center_y < frame_boundaries_y[0]:
                            object_frame_pos[1] = "BOTTOM"
                        elif center_y < frame_boundaries_y[1]:
                            object_frame_pos[1] = "MIDDLE"
                        else:
                            object_frame_pos[1] = "TOP"

                        direction_pred = ""
                        if object_frame_pos[0] == "MIDDLE" and object_frame_pos[1] == "MIDDLE":
                            options = ["TOP", "BOTTOM"]
                            direction_pred = random.choice(options)
                        elif object_frame_pos[0] == "MIDDLE":
                            direction_pred = object_frame_pos[1]
                        elif object_frame_pos[1] == "MIDDLE":
                            direction_pred = object_frame_pos[0]
                        else:
                            direction_pred = object_frame_pos[1] + "-" + object_frame_pos[0]

                        logger.info("Answer: {}", direction_pred)

                        cv2.putText(image, "Prediction: " + direction_pred, (10, 75), cv2.FONT_HERSHEY_SIMPLEX, 2,
                                    (0, 0, 255), 3)
                    except Exception as e:
                        logger.error(e)
                    # im_arr = cv2.imencode('.jpg', RGB_img)[1]
                    # response = make_response(im_arr.tobytes())
                    # response.headers['Content-Type'] = 'image/jpeg'
                    cv2.imwrite(upload_directory + "/" + file.filename, image)
                logger.success("Predictions Complete On: {}", file.filename)
            if generateVideo == "true" and len(files) >= 2:
                logger.info("Preparing Images")
                generate_video()

            # Generate Zip File
            FILEPATH = "/workspace/UPLOAD_FOLDER/"
            # fileobj = io.BytesIO()
            # with zipfile.ZipFile(fileobj, 'w') as zip_file:
            #     zip_info = zipfile.ZipInfo(FILEPATH)
            #     zip_info.date_time = time.localtime(time.time())[:6]
            #     zip_info.compress_type = zipfile.ZIP_DEFLATED
            #     with open(FILEPATH, 'rb') as fd:
            #         zip_file.writestr(zip_info, fd.read())
            # fileobj.seek(0)

            results_file = io.BytesIO()
            zf = zipfile.ZipFile(results_file, mode="w")

            file_paths = []
            for root, directories, files in os.walk(FILEPATH):
                for filename in files:
                    filepath = os.path.join(root, filename)
                    file_paths.append(filepath)
            for file in file_paths:
                zf.write(file)
            zf.close()

            results_file.seek(0)

            logger.success("API CALL Completed, Results Available Check (/workspace/UPLOAD_FOLDER)")
            return send_file(results_file, attachment_filename="results_file.zip", as_attachment=True)

            # response = make_response(fileobj.read())
            # response.headers.set('Content-Type', 'zip')
            # response.headers.set('Content-Disposition', 'attachment', filename='%s.zip' % os.path.basename(FILEPATH))
            #
            # return response
        except:
            return jsonify({'Error': 'Error during prediction'})


if __name__ == '__main__':
    logger.info("Starting Flask APP, Please Wait...")
    delete_folder()
    app.run(debug=True, host='0.0.0.0')

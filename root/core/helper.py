import os
from re import S
import sys
import random
from core.dataset import Dataset
from IPython.display import display


def initialise(random_seed=0):

    # Add current directory to root path
    sys.path.append(os.path.dirname(os.path.realpath(os.getcwd())))
    # Add core library to root path
    sys.path.append(os.path.dirname(os.path.realpath(os.getcwd())) + "/core")
    # Initialize random value
    random.seed(random_seed)

def load_data(partial=True, prefixs=['/part1/', '/part2/', '/part3/'], s3_path='s3://airborne-obj-detection-challenge-training'):

    # Prefix only includes part1 and part2 - training dataset. Part3 used to testing/evaluation.

    notebook_path = os.path.dirname(os.path.realpath("__file__")) + '/data'
    dataset = Dataset(partial)

    for prefix in prefixs:
        path = notebook_path + prefix
        dataset.add(path, s3_path + prefix, prefix)

    return dataset

def run_shell(cmd):

    import subprocess
    # Create a sub process
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
    # Get the output and error
    o, e = proc.communicate()
    # Print out the result
    print('Output: ' + o.decode('ascii'))
    print('Error: ' + e.decode('ascii'))
    print('code: ' + str(proc.returncode))

def random_frame(dataset, num_object=0):
    
    # Get all of the flight ids
    all_flight_ids = dataset.get_flight_ids()

    from random import choice
    # Choose a random flight id
    flight_id = choice(all_flight_ids)

    # Get the random flight
    flight = dataset.get_flight_by_id(flight_id)

    # Verify the maximum number of detected_objects
    max_num_objects = len(flight.detected_objects.keys())

    # Update the number of detected objects
    if (num_object > max_num_objects):
        num_object = max_num_objects

    # Finding a suitable flight
    while(True):
        frame_id = choice(list(flight.frames.keys()))
        frame = flight.get_frame(frame_id)

        if (frame.num_detected_objects >= num_object):
            return frame.image_path(), frame

def image_and_annotation(frame):
    """Return a specific frame images and it's annotated version

    Args:
        frame (object): An instance of the Frame object

    Returns:
        frame_image (object): An instance of Frame image
        frame_image_annotated: An instance of Frame image with annotation
    """

    # Get the image
    frame_image = frame.image(type="cv2")
    # Get the annotated image
    frame_image_annotated = frame.image_annotated()

    # Return the two versions
    return frame_image, frame_image_annotated


def plot_image_and_annotation(image, annotated_image, figsize=(50, 65), dpi=80):
    """Plot the image and it's annotated version to the figure

    Args:
        image (object): The original version of the image
        annotated_image (object): The annotated version of the image
        figsize (tuple, optional): Width and height size for the image. Defaults to (50, 65).
        dpi (int, optional): DPI configuration for the figure. Defaults to 80.
    """

    import matplotlib.pyplot as plt

    # Define the figre instance
    fig = plt.figure(figsize=figsize, dpi=80)
    # Add the first subplot
    ax = fig.add_subplot(1, 2, 1)
    # Show the first image
    ax.imshow(image)
    # Add the second subplot
    ax = fig.add_subplot(1, 2, 2)
    # Show the second image
    ax.imshow(annotated_image)
    # Display the figure
    plt.show()

def mdprint(text):
    """Display the input text as in Markdown format

    Args:
        text (str): A text that need to be displayed in other formats

    """
    display({
        'text/markdown': text,
        'text/plain': text
    }, raw=True)


def remove_numbers(s):
    return ''.join([i for i in s if not i.isdigit()])

def get_all_rows(dataset):
    # A variable to store every lines
    rows = []
    # Iter through every flight
    for flight_id in dataset.get_flight_ids():
        # Get the flight by id
        flight = dataset.get_flight(flight_id)
        # Iter through every detected object
        for obj_key in flight.detected_objects:
            object_type = remove_numbers(obj_key)
            # Get the object
            obj = flight.detected_objects[obj_key]
            # Get the location of every objects
            for loc in obj.location:
                # Get bbox
                bbox = loc.bb.get_bbox()
                # Get frame id
                frame_id = loc.frame.id
                # Get distance, return nan if that object is not planned
                range_distance = loc.range_distance_m
                # Get the image path
                image_path = loc.frame.image_path()
                # Append to the list
                rows.append([flight_id, object_type, obj_key, frame_id,
                            *bbox, bbox[-1]*bbox[-2], image_path, range_distance])

    return rows

def create_dataframe(dataset, columns):
    # Get all rows of the dataset
    rows = get_all_rows(dataset)

    import pandas as pd
    df = pd.DataFrame(rows)
    df.columns = columns

    # Return the dataframe
    return df

def drawBoundingBoxes(imageInputPath, imageOutputPath, inferenceResults, color):

    import cv2, sys
    # Read the cv2 format of the image
    imageData = cv2.imread(imageInputPath)
    for res in inferenceResults:
        # Get the four dimensions
        left = int(res['left'])
        top = int(res['top'])
        right = int(res['left']) + int(res['width'])
        bottom = int(res['top']) + int(res['height'])
        
        # Get the label
        label = res['label']
        # Get the shape of the image
        imgHeight, imgWidth, _ = imageData.shape
        thick = int((imgHeight + imgWidth) // 900)
        print (left, top, right, bottom)
        
        # Draw the bounding box
        cv2.rectangle(imageData,(left, top), (right, bottom), color, thick)
        cv2.putText(imageData, label, (left, top - 12), 0, 1e-3 * imgHeight, color, thick//3)
    
    # Show the image with annotation
    plt.imshow(imageData)

def get_all_uniqueKeys(dataset):
    all_keys = []
    for flight_id in dataset.get_flight_ids():
        flight = dataset.get_flight(flight_id)
        all_keys.extend([remove_numbers(k) for k in flight.detected_objects])

    unique_keys = list(set(all_keys))
    return unique_keys
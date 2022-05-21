import os

from loguru import logger
from core.dataset import Dataset


def downloadTrainingData():
    notebook_path = os.path.dirname(os.path.realpath("__file__"))
    local_path = notebook_path + '/part2'
    s3_path = 's3://airborne-obj-detection-challenge-training/part2/'
    dataset = Dataset(local_path, s3_path, partial=True, prefix="part2")
    local_path = notebook_path + '/part3'
    s3_path = 's3://airborne-obj-detection-challenge-training/part3/'
    dataset.add(local_path, s3_path, prefix="part3")
    # getFlightsAndFrames(dataset)

    # flight_ids = dataset.get_flight_ids()
    # logger.info("All Flight IDS: {}", flight_ids)
    #
    # flight = dataset.get_flight(flight_ids[0])  # Loading single flight
    # logger.info("Chosen Flight: {}", flight)
    #
    # frames = flight.frames  # All the frames of the flight
    # airborne_objects = flight.get_airborne_objects()  # Get all airborne objects
    # for airborneObject in airborne_objects:
    #     logger.info("Airborne Object: {} ", airborneObject)

    # for f in frames:
    #     logger.info("Frame: {}", frames[f].image_s3_path())

    # flight.download()

    flight_ids = dataset.get_flight_ids()
    # videoBatchSize = 5
    # while videoBatchSize > 0:
    #     for flight in flight_ids:
    #         currentFlight = dataset.get_flight(flight)
    #         logger.info("Downloading Flight: {}", currentFlight)
    #         currentFlight.download()
    #         logger.info("Download Completed")
    #         videoBatchSize = videoBatchSize - 1

    # logger.info("All Flights Downloaded")
    for flight in flight_ids:
        currentFlight = dataset.get_flight(flight)
        logger.info("Start")
        currentFlight.generate_video(speed_x=1)

def main():
    logger.info("Downloading Training Data...")
    downloadTrainingData()


if __name__ == '__main__':
    main()

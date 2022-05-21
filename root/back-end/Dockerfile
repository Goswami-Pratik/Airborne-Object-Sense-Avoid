FROM pytorch/pytorch

WORKDIR /workspace

RUN apt-get update && apt-get install -y python3-opencv
RUN pip install opencv-python

ADD requirements.txt /workspace
ADD yolov5/requirements.txt /workspace/yolov5/requirements.txt
RUN pip install -r /workspace/requirements.txt
RUN pip install -r /workspace/yolov5/requirements.txt

RUN pip install --no-cache torch==1.10.1+cu113 torchvision==0.11.2+cu113 -f https://download.pytorch.org/whl/cu113/torch_stable.html
RUN pip install loguru ffmpeg

ADD . /workspace

CMD [ "python" , "/workspace/app.py" ]
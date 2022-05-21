from helper import *

class Yolo_V5:

    def change_content(self, content, path):
        import subprocess
        subprocess.call(["sed -i '" + content + "' " + path], shell=True)
    
    def imShow(self, path):
        try:
            import cv2
            import matplotlib.pyplot as plt

            image = cv2.imread(path)
            height, width = image.shape[:2]
            resized_image = cv2.resize(image,(3*width, 3*height), interpolation = cv2.INTER_CUBIC)

            fig = plt.gcf()
            fig.set_size_inches(18, 10)
            plt.axis("off")
            plt.imshow(cv2.cvtColor(resized_image, cv2.COLOR_BGR2RGB))
            plt.show()
        except AttributeError:
            raise TypeError("File not found !")

    def plot_image(self, path):
        import matplotlib.pyplot as plt
        from matplotlib.pyplot import figure
        figure(figsize=(50, 60), dpi=80)
        image = plt.imread(path)
        plt.imshow(image) 
        plt.show()
import React from 'react';
import "./Project.css";

const Project = () => {
    return (
        <>
            <div className="project-container">
                <h1>Airborne Object Tracking</h1>
                <h2>Sense & Avoid 🛩️</h2>
                <hr/>
                <div className="paragraph-text">
                    <h4 className="paragraph-heading-text heading-blue">Introduction:</h4>
                    <p>
                        Across the globe, demand for a cheap, reliable, and swift mode of transportation is in desperate need.
                        Various companies such as Amazon have introduced “amazon prime air” services that aim to take advantage
                        of unmanned drone flights to deliver (Drone Delivery – The Future of Logistics | Bray Solutions, 2017).
                        The extensive usage of drones in the commercial, agricultural, and military sectors (Commercial Drones:
                        A Guide to the Top Models on the Market, 2020) has resulted in an increased demand for autonomous drones.
                        The current drone sales surpassed $1.25 billion as of 2020 and are expected to grow to $63.6 billion by 2025.
                        According to business insiders, the market is predicted to sell 2.4 million by 2023 – an increase of
                        66.8% and in the agricultural sector, the consumption is predicted to rise by 69% between 2010 to 2050
                        (Intelligence Insider, 2021). However, drones lack sense and avoidance capabilities which are crucial
                        for drones to be able to detect and track airborne objects observed in a planned flight.
                    </p>
                    <p>
                        Nowadays drones use a range of expensive sensors such as LIDAR, infrared triangulation, lasers, and
                        passive acoustic sensors (for ultrasound). Solving the problem using only a single monocular video feed
                        – from visual cameras, is very attractive as cameras are very lightweight and much cheaper to produce.
                        Tesla and other car manufacturers presently have an implementation of sense and avoid in their self-drive
                        autopilot systems (Autopilot | Tesla UK, 2016), which uses a set of camera and computer vision models
                        to improve road safety to avoid accidents and help to navigate to the destination.
                    </p>
                    <p>
                        The project aims to build an airborne object tracking system that will allow drones to sense and avoid
                        obstacles in an autonomous flight. Due to the weight and battery performance constraints, drones lack
                        safety-critical features such as a traffic collision avoidance system (TCAS) (Erwin Tracy, 2015),
                        therefore air traffic controllers (ATC) can’t actively monitor drones in uncontrolled airspace.
                        The airspace is relatively sparse and there is still a chance that a drone will encounter unforeseen
                        object/static object.
                    </p>
                    <p>
                        The objective of the project is to take an image or a monocular video feed and to perform image
                        analysis to detect any airborne object in the video frame. The detected object then will be classified
                        and tracked throughout multiple frames, where eventually the model will use various factors
                        and a decision tree. Upon further decision making the model will perform
                        the necessary manoeuvre to create a safer route.
                    </p>
                    <h4 className="paragraph-heading-text heading-green"><a>Aims & Objectives:✅</a></h4>
                    <p>
                        The project aim is to create a model that will take an image or a monocular video feed, then detect
                        any airborne object that could potentially collide with our object by tracking its motion across
                        multiple frames. Below are the set objectives that I will need to accomplish.
                    </p>
                    <ol>
                        <li>
                            Research to find literature on existing drone sense & avoid systems, research on autonomous flights,
                            pretrained classification models, computer vision algorithms and techniques.
                        </li>
                        <li>Research on methodologies to use (spiral, iterative or agile), create plans to manage and track the
                            project’s progress.
                        </li>
                        <li>
                            Research on existing suitable public datasets, validate dataset for any personal/critical information
                            and get approved by Brunel research ethics online (BREO).
                        </li>
                        <li>
                            Perform preprocessing on the dataset (e.g. normalizing, transformation, scaling) and prepare the dataset
                            into training, testing and validation set.
                        </li>
                        <li>
                            Design and build the AI model that detects airborne objects and classifies them. Apply advanced
                            vision algorithms and techniques such as faster R-CNN, logistic regression and decision trees to train.
                        </li>
                        <li>
                            Test the model performance on the validation set and do a thorough analysis to validate if the build
                            model meets the benchmarks.
                        </li>
                        <li>
                            Create prototypes of the user interface, build the web application which implements the trained
                            AI model and carry out testing of the entire app.
                        </li>
                        <li>
                            Evaluate model accuracy at detecting, tracking and predicting collision with the object.
                        </li>
                    </ol>
                    <h4 className="paragraph-heading-text heading-red"><a>Reference🔗</a></h4>
                    <p>
                        Autopilot | Tesla UK (2016). Available at: <a href="https://www.tesla.com/en_GB/autopilot">https://www.tesla.com/en_GB/autopilot</a> (Accessed:
                        October 25, 2021).
                    </p>
                    <p>
                        Commercial Drones: A Guide to the Top Models on the Market (2020). Available at:
                        <a href="https://www.flyability.com/commercial-drones">https://www.flyability.com/commercial-drones</a> (Accessed: October 25, 2021).
                    </p>
                    <p>
                        Drone Delivery – The Future of Logistics | Bray Solutions (2017). Available at:
                        <a href="https://www.braysolutions.com/drone-delivery/">https://www.braysolutions.com/drone-delivery/</a> (Accessed: October 25, 2021).
                    </p>
                    <p>
                        Erwin Tracy (2015) Sense and Avoid - L3Harris Geospatial. Available at:
                        <a href="https://www.l3harrisgeospatial.com/Learn/Blogs/Blog-Details/ArtMID/10198/ArticleID/15516/Sense-andAvoid">
                            https://www.l3harrisgeospatial.com/Learn/Blogs/Blog-Details/ArtMID/10198/ArticleID/15516/Sense-andAvoid</a> (Accessed: October 25, 2021).
                    </p>
                    <p>
                        Intelligence Insider (2021) Drone Industry Analysis 2021: Market Trends & Growth Forecasts. Available at:
                        <a href="https://www.businessinsider.com/drone-industry-analysis-market-trends-growthforecasts?r=US&IR=T">
                            https://www.businessinsider.com/drone-industry-analysis-market-trends-growthforecasts?r=US&IR=T</a> (Accessed: October 27, 2021).
                    </p>
                </div>
            </div>
        </>
    );
};

export default Project;
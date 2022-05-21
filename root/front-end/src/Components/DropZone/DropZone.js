import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./DropZone.css";
import {AxiosResponse} from "axios";

const DropZone = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [generateVideo, setGenerateVideo] = useState(false);

    const modalImageRef = useRef();
    const modalRef = useRef();
    const fileInputRef = useRef();

    // Upload Progress Bar
    const uploadModalRef = useRef();
    const uploadRef = useRef();
    const progressRef = useRef();

    const dragOver = (e) => {
        e.preventDefault();
    }

    const dragEnter = (e) => {
        e.preventDefault();
    }

    const dragLeave = (e) => {
        e.preventDefault();
    }

    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    const handleFiles = (files) => {
        for(let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
            } else {
                files[i]['invalid'] = true;
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                setErrorMessage('File type not permitted');
                setUnsupportedFiles(prevArr => [...prevArr, files[i]]);
            }
        }
    }

    const validateFile = (files) => {
        const validFileType = ['image/jpeg', 'image/jpg', 'image/png'];
        return validFileType.indexOf(files.type) !== -1;
    }

    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = (fileName) => {
        const validFileIndex = validFiles.findIndex(e => e.name === fileName);
        validFiles.splice(validFileIndex, 1);

        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(e => e.name === fileName);
        selectedFiles.splice(selectedFileIndex, 1);
        setSelectedFiles([...selectedFiles]);

        const unsupportedFileIndex = unsupportedFiles.findIndex(e => e.name === fileName);
        if (unsupportedFileIndex !== -1) {
            unsupportedFiles.splice(unsupportedFileIndex, 1);
            setUnsupportedFiles([...unsupportedFiles]);
        }
    }

    const openImageModal = (file) => {
        const reader = new FileReader();
        modalRef.current.style.display = "block";
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            modalImageRef.current.style.backgroundImage = `url(${e.target.result})`;
        }
    }

    const closeModal = () => {
        modalRef.current.style.display = "none";
        modalImageRef.current.style.backgroundImage = 'none';
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    }

    const uploadFiles = () => {
        uploadModalRef.current.style.display = 'block';
        uploadRef.current.innerHTML = 'Uploading Files...';
        const formData = new FormData();

        for (let i = 0; i < validFiles.length; i++) {
            formData.append('files', validFiles[i]);
        }
        formData.append('generate_video', generateVideo);

        axios.post('http://localhost:5000/predict', formData, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                progressRef.current.innerHTML = `${uploadPercentage}%`;
                progressRef.current.style.width = `${uploadPercentage}%`;
                if (uploadPercentage === 100) {
                    uploadRef.current.innerHTML = 'Processing Images!';
                    validFiles.length = 0;
                    setValidFiles([...validFiles]);
                    setSelectedFiles([...validFiles]);
                    setUnsupportedFiles([...validFiles]);
                    setGenerateVideo(false);
                }
            }
        }).then((response: AxiosResponse) => {
            if (response.status === 200) {
                closeUploadModal();
                // const disposition = response.request.getResponseHeader('Content-Disposition')
                let fileName = "";
                // let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                // let matches = filenameRegex.exec(disposition);
                // if (matches != null && matches[1]) {
                //     fileName = matches[1].replace(/['"]/g, '');
                // }
                let blob = new Blob([response.data], { type: 'application/zip' })

                const downloadUrl = URL.createObjectURL(blob)
                let a = document.createElement("a");
                a.href = downloadUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
            }
        }).catch(() => {
            uploadRef.current.innerHTML = `<span class="error">Error During Prediction, Try Again...</span>`;
            progressRef.current.style.backgroundColor = 'red';
        });
    }

    const closeUploadModal = () => {
        uploadModalRef.current.style.display = 'none';
    }

    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find(item => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);

    }, [selectedFiles]);

    return (
        <>
            <div className="drop-container" onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave}
                 onDrop={fileDrop} onClick={fileInputClicked}>
                <div className="drop-message">
                    <input ref={fileInputRef} className="file-input" type="file" multiple onChange={filesSelected}/>
                    <div className="upload-icon"/>
                    <div>Drag & Drop</div>
                    or <b>browse</b>
                    <div className="drop-message-support">Supports: JPEG, JPG, PNG</div>
                </div>
            </div>

            <div className="file-display-container">
                {unsupportedFiles.length === 0 && validFiles.length ?
                    <div>
                        <div className="form-check form-check-inline generate-button">
                            <input className="form-check-input" type="checkbox" id="generateVideo" onChange={() => {setGenerateVideo(!generateVideo);}}/>
                            <label className="form-check-label" htmlFor="generateVideo">Generate Video File</label>
                        </div>
                        <button className="btn btn-primary btn-round file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button>
                    </div> : ''}

                {unsupportedFiles.length ? <h6>Please remove all unsupported files.</h6> : ''}
                <div className="file-status-bar">
                    {
                        validFiles.map((data, i) =>
                            <div className="file-status-bar" key={i}>
                                <div className="file-type-logo"/>
                                <div className="file-type">{fileType(data.name)}</div>
                                <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                                <span className="file-view-logo" onClick={!data.invalid && validFiles.length > 0 ? () => openImageModal(data) : () => removeFile(data.name)}/>
                                <span className="file-remove" onClick={() => removeFile(data.name)}>X</span>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="modal" ref={modalRef}>
                <div className="overlay"/>
                <span className="close" onClick={(() => closeModal())}>X</span>
                <div className="modal-image" ref={modalImageRef}/>
            </div>

            <div className="upload-modal" ref={uploadModalRef}>
                <div className="overlay"/>
                {/*<div className="close" onClick={(() => closeUploadModal())}>X</div>*/}
                <div className="progress-container">
                    <span ref={uploadRef}/>
                    <div className="progress">
                        <div className="progress-bar" ref={progressRef}/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DropZone;
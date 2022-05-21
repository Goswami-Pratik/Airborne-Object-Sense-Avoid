import React, {useRef, useState} from 'react';
import "./Contact-us.css";
import axios, {AxiosResponse} from "axios";
import {sendForm} from "emailjs-com";
import emailjs from "emailjs-com";

const ContactUs = () => {

    const uploadModalRef = useRef();
    const uploadRef = useRef();

    const closeUploadModal = () => {
        uploadModalRef.current.style.display = 'none';
    }

    const uploadForm = (e) => {
        e.preventDefault();

        uploadModalRef.current.style.display = 'block';
        uploadRef.current.innerHTML = 'Uploading...';

        // axios.post('http://localhost:5000/contactus', formData, {
        //     onUploadProgress: (progressEvent) => {
        //         const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        //         if (uploadPercentage === 100) {
        //             uploadRef.current.innerHTML = 'Processing!';
        //             setFullName("");
        //             setEmail("");
        //             setFormMessage("");
        //         }
        //     }
        // }).catch(() => {
        //     uploadRef.current.innerHTML = `<span class="error">Error Sending, Try Again...</span>`;
        // });

        emailjs.sendForm("service_5a0akpm", "template_vkcsyg7", e.target, "user_4vY3qQ1bKlOKowRTL7hFG")
            .then(r => {
                if (r.status === 200) {
                    uploadRef.current.innerHTML = 'Success!';

                }
            }).catch(() => {
            uploadRef.current.innerHTML = `<span class="error">Error Sending, Try Again...</span>`;
        });

    }

    return (
        <>
            <div className="contact-us-container">
                <h1>Contact us</h1>
                <form className="contact-us-form" onSubmit={e => uploadForm(e)}>
                    <div className="form-group row">
                        <label htmlFor="fullName" className="col-sm-2 col-form-label">Full Name</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="fullName" name="fullName"/>
                        </div>
                    </div>
                    <br/>
                    <div className="form-group row">
                        <label htmlFor="emailAddress" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="emailAddress" name="email"/>
                        </div>
                    </div>
                    <br/>
                    <div className="form-group row">
                        <label htmlFor="message" className="col-sm-2 col-form-label">Message</label>
                        <div className="col-sm-10">
                            <textarea type="text" className="form-control" id="message" rows="5" name="message"/>
                        </div>
                    </div>
                    <br/>
                    <small className="form-text text-muted small">
                        The content of this message are confidential.
                    </small>
                    <br/>
                    <br/>
                    <div className="form-group row">
                        <div >
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="upload-modal" ref={uploadModalRef}>
                <div className="overlay"/>
                <div className="close" onClick={(() => closeUploadModal())}>X</div>
                <div className="progress-container">
                    <span ref={uploadRef}/>
                </div>
            </div>
        </>
    )
}

export default ContactUs;
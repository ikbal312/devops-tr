import React, { useState } from 'react'
import {useNavigate } from "react-router-dom";
import Loader from '../Common/Loader';
import './Student.css';
const CreateStudent = () => {
    const navigate = useNavigate();
    const addStudentApi = "http://localhost/api/student/";
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [student, setStudent] = useState({
        email:"",
        fullname:"",
        course_of_study: "",
        year:"",
        GPA:"",
    })

    const handelInput = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setStudent({ ...student, [name]: value });
    }

    const handelSubmit = async (event) => {
        event.preventDefault();


        try {
            setIsLoading(true);
            const response = await fetch(addStudentApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(student),
            });
        
            console.log(response)
            if (response.ok) {
                console.log('Form submitted successfully!');
                setStudent({name: "",email: "",phone: ""})
                navigate('/show-student');
            } else {
                console.error('Form submission failed!');
            }

        } catch (error) {
            setError(error.message);
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <div className='student-form'>
            <div className='heading'>
            {isLoading && <Loader />}
            {error && <p>Error: {error}</p>}
                <p>Student Form</p>
            </div>
            <form onSubmit={handelSubmit}>
                <div className="mb-3">
                    <label for="name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="fullname" name="fullname" value={student.fullname} onChange={handelInput} />
                </div>
     
                <div className="mb-3">
                    <label for="pwd" className="form-label">Course of study</label>
                    <input type="text" className="form-control" id="course_of_study" name="course_of_study" value={student.desc} onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label for="pwd" className="form-label">Email</label>
                    <input type="text" className="form-control" id="email" name="email" value={student.desc} onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label for="pwd" className="form-label">CGPA</label>
                    <input type="text" className="form-control" id="gpa" name="gpa" value={student.desc} onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label for="pwd" className="form-label">Year</label>
                    <input type="text" className="form-control" id="year" name="year" value={student.desc} onChange={handelInput} />
                </div>
                <button type="submit" className="btn btn-primary submit-btn">Submit</button>
            </form>
        </div>
    )
}

export default CreateStudent
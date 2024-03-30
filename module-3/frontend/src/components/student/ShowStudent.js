import React, { useEffect, useState } from "react";
import axios from "axios";

import Loader from "../Common/Loader";

const ShowStudent = () => {
  const showStudentApi = "http://localhost/api/student";

  const [student, setStudent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handelDelete = async (id) => {
    console.log("id : -", id);

    setIsLoading(true);
    try {
      const response = await fetch(showStudentApi.concat("/") + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setStudent(student.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const getStudents = () => {
    axios
      .get(showStudentApi)
      .then((res) => {

        setStudent(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(student)
  useEffect(() => {
    getStudents();
  }, []);
  if (student.length < 0) {
    return <h1>no student found</h1>;
  } else {
    return (
      <div className="mt-5">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Year</th>
              <th>CGPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {student.map((item, i) => {
              return (
                <tr key={i + 1}>
                  <td>{item.id}</td>
                  <td>{item.fullname}</td>
                  <td>{item.email}</td>
                  <td>{item.course_of_study}</td>
                  <td>{item.year}</td>
                  <td>{item.GPA}</td>
                  <td>


                    <i
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={() => handelDelete(item.id)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default ShowStudent;

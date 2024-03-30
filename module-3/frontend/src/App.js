import "./App.css";
import AddStudent from "./components/student/AddStudent";
import ShowStudent from "./components/student/ShowStudent";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Common/Header";

function App() {
  return (
    <div className="App">
      <header className="container">
        <div className="">
          <Header />
          <Routes>
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/show-student" element={<ShowStudent />} />
          </Routes>
          
        </div>
      </header>
    </div>
  );
}

export default App;

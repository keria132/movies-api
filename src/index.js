import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import SearchPage from "./pages/SearchPage";
import MoviePage from "./pages/MoviePage";
import NoPage from "./pages/NoPage";

export default function App(){
    return(
        <HashRouter >
            <Routes>
                <Route index path="/" element={<SearchPage/>}/>
                <Route path="/movie/:movieId" element={<MoviePage/>}/>
                <Route path="/*" element={<NoPage />} />
            </Routes>
        </HashRouter >
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
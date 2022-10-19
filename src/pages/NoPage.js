import React from 'react';
import { Link } from "react-router-dom";
import "./NoPage.scss";

function NoPage(){
    return(
        <div className="noPage container-fluid row m-auto">
            <h1 className="noPage__header col-12 text-center">Page not found<br/>404</h1>
            <Link to="/" className="noPage__link col-12 text-center">&lt;Go to the main page</Link>
        </div>
    )
}

export default NoPage;
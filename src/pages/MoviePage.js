import { useParams, Link } from "react-router-dom";
import { useState } from "react";
// import MetaTags from 'react-meta-tags';
import "./MoviePage.scss"
let movie = {};

function MoviePage(){
    let params = useParams();

    const [ready, setReady] = useState(0);

    if(ready === 0){
        getMovieInfo(params.movieId, setReady)
        return;
    }

    let backgroundImage;
    console.log(movie);
    for(let i = 0; i<movie.images.length; i++){
        if (movie.images[i].width>=1920){
            backgroundImage =  `url(${movie.images[i].url})`;
            break;
        }
    }

    return (
        <>
            {/* <MetaTags>
                <title>Search page</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </MetaTags> */}

            <section className="header container-fluid row m-auto p-0">

                <div className="header__returnButton col-12 p-3 bg-dark">
                    <Link to="/" className="fs-4 fw-light">&lt;Go back</Link>
                </div>

                <div className="info col-12 ps-3 d-flex align-items-center" style={{backgroundImage: backgroundImage}}>

                    <div className="row">
                        <h1 className="info__title col-12 mt-3"> { movie.title }</h1>

                        <div className="info-details col-12 d-flex align-items-center">
                            <div className="info__rating rounded text-center text-nowrap d-flex justify-content-center align-items-center fw-bold p-1 me-2">IMDb { movie.rating }</div>
                            <p className="info__genre d-flex align-items-center m-0 pe-2">{ movie.genre }</p>
                            <p className="info__type border-start d-flex align-items-center m-0 ps-2 pe-2">{ movie.type == "tvMiniSeries" ? "TVSeries" : movie.type }</p>
                            <p className="info__year border-start d-flex align-items-center m-0 ps-2">{ movie.releaseDate }</p>
                        </div>

                        <button className="info__watch col-4 col-md-3 ms-2 p-2 btn btn-outline-light rounded-pill align-self-end">Watch</button>

                        <p className="info__awards col-12 mt-3">{ movie.awards }</p>
                    </div>
                </div>

            </section>

            <section className="main container-fluid row d-flex mt-5 mb-5">
                <h2 className="main__title col-12 col-md-8 fw-bold mb-4">Watch { movie.title } on the Lorem Ipsum</h2>

                <p className="main__description col-12 col-md-8">{ movie.description }</p>
            </section>

            <footer className="container-fluid p-4 bg-dark text-white text-center fs-4"> Lorem Ipsum </footer>
        </>
    )
}

function getMovieInfo(id, setState){

    const apiKey = "2d4757e1b6msh13937e276a99188p1775c3jsn2eda7d86d856";
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){

        if (this.readyState === 4 && this.status === 200) {

            let movieInfo = JSON.parse(this.response);
            console.log(movieInfo)

            let imageRequest = new XMLHttpRequest();

            imageRequest.onload = function() {
                movieInfo.images = JSON.parse(this.response).images;

                movie.title = movieInfo.title.title;
                movie.rating = movieInfo.ratings.rating;
                movie.type = movieInfo.title.titleType;
                movie.genre = movieInfo.genres[0];
                movie.releaseDate = movieInfo.title.year;
                if(Boolean(movieInfo.ratings.otherRanks)){
                    movie.awards = movieInfo.ratings.otherRanks[0].label + " - " + movieInfo.ratings.otherRanks[0].rank;
                }
                movie.description = movieInfo.plotSummary.text;
                movie.images = movieInfo.images;
                console.log(movie);
                setState(1);
            }

            imageRequest.open("GET", "https://online-movie-database.p.rapidapi.com/title/get-images?tconst=" + id + "&limit=5");
            imageRequest.setRequestHeader("X-RapidAPI-Key", apiKey);
            imageRequest.setRequestHeader("X-RapidAPI-Host", "online-movie-database.p.rapidapi.com");
            imageRequest.withCredentials = false;

            imageRequest.send();
        }

    }

    xhr.open("GET", "https://online-movie-database.p.rapidapi.com/title/get-overview-details?tconst=" + id + "&currentCountry=US");       
    xhr.setRequestHeader("X-RapidAPI-Key", apiKey);
    xhr.setRequestHeader("X-RapidAPI-Host", "online-movie-database.p.rapidapi.com");
    xhr.withCredentials = false;
    xhr.send();

}


export default MoviePage;
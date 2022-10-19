import React from 'react';
import { Link } from "react-router-dom";
// import MetaTags from 'react-meta-tags';
import "./SearchPage.scss"

class SearchPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            movie: {}
        }
    }

    handleChangeQuery(e) {
        this.setState({ input: e.target.value });
    }

    handleSearch(e){
        e.preventDefault();
        console.log('You clicked submit.');
        let title = this.state.input;
        let search = searchMovie.bind(this); //
        search(title);
    }

    shouldComponentUpdate(nextprops, nextstate){
        if(this.state.movie.title == nextstate.movie.title){
            console.log("Component isn't updated");
            return false;
            
        }
        return true;
    }

    render(){
        const movie = (
            <div className="movie bg-dark flex-row flex-wrap p-3 d-flex rounded col-sm-8 col-xl-6">

                <img className="movie__img rounded me-3" src={ this.state.movie.image } />

                <div className="movieInfo container-md row w-75 d-flex align-content-center">
                    
                    <Link className='col-9' to={"/movie/" + this.state.movie.id}>
                        <h4 className="movieInfo__h1">{ this.state.movie.title }</h4>
                    </Link>

                    <div className="movieInfo__rating p-2 col-3 rounded text-center text-nowrap d-flex justify-content-center align-items-center fw-bold">{"IMDb " + this.state.movie.rating }</div>
                    <div className="movieAbout fw-light col-12 d-flex flex-row flex-wrap">
                        <p className="movieAbout__type">{ this.state.movie.type }</p>
                        <p className="movieAbout__genre ms-2 me-2 ps-2 pe-2 border-start border-end">{ this.state.movie.genre }</p>
                        <p className="movieAbout__year">{ this.state.movie.releaseDate }</p>
                    </div>
                    <p className="movieInfo__description pt-2 border-top fw-light col-12">
                        { this.state.movie.description }
                    </p>
                </div>

            </div>
        );

        return(
            <>

                {/* <MetaTags>
                    <title>Search page</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                </MetaTags> */}

                <div className="background">
                    <iframe className="background-video" src=" https://www.youtube-nocookie.com/embed/gA0nQyDZR4A?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist=gA0nQyDZR4A"></iframe>
                </div>

                <section className="searchPage container-md text-white row mx-auto justify-content-center">

                    <h1 className="searchPage__heading col-12 col-md-11 col-lg-10 col-xl-8 text-center mb-5">Unlimited movies, TV shows, and more.<br/><small className="display-6">Watch anywhere. Cancel anytime.</small></h1>
                    {/* <h2 className="searchPage__description col-12">Watch anywhere. Cancel anytime.</h2> */}

                    <div className="searchBar col-10 col-md-9 col-lg-8 col-xl-7 mb-3">
                        <form className='searchBar d-flex justify-content-center input-group'>
                            <input className="searchBar__input w-50" type="text" placeholder="Type here smth.." name="search" onChange={this.handleChangeQuery.bind(this)}/>
                            <button className='searchBar__button btn btn-info text-white' type="submit" onClick={this.handleSearch.bind(this)}>Search</button>
                        </form>
                    </div>

                    {this.state.movie.title == undefined ? "" : movie}
                    
                </section>
            </>
            
        )
    }
}

//SEARCH MOVIE FUNCTION
function searchMovie(title){

    if(title === undefined) return;

    const apiKey = "2d4757e1b6msh13937e276a99188p1775c3jsn2eda7d86d856";
    const xhr = new XMLHttpRequest();
    let movieInfo = {};

    let setState = function(movieInfo){
        this.setState({movie: movieInfo});
    }.bind(this);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.response);
            let result = data.results[0];
            let resultId = result.id.slice(7, -1)

            let detailsRequest = new XMLHttpRequest();
            detailsRequest.onload = function() {
                let movie = JSON.parse(this.response);
                
                movieInfo.id = resultId;
                movieInfo.title = movie.title.title;
                movieInfo.image = movie.title.image.url;
                movieInfo.rating = movie.ratings.rating;
                movieInfo.type = movie.title.titleType;
                movieInfo.genre = movie.genres[0];
                movieInfo.releaseDate = movie.title.year;
                movieInfo.description = movie.plotOutline.text;

                setState(movieInfo);
                console.log(movie);
            }

            detailsRequest.open("GET", "https://online-movie-database.p.rapidapi.com/title/get-overview-details?tconst=" + resultId + "&currentCountry=US");
            detailsRequest.setRequestHeader("X-RapidAPI-Key", apiKey);
            detailsRequest.setRequestHeader("X-RapidAPI-Host", "online-movie-database.p.rapidapi.com");

            detailsRequest.send();
        }
    }

    xhr.open("GET", "https://online-movie-database.p.rapidapi.com/title/v2/find?title=" + title + "&limit=1&sortArg=moviemeter%2Casc");
    xhr.setRequestHeader("X-RapidAPI-Key", apiKey);
    xhr.setRequestHeader("X-RapidAPI-Host", "online-movie-database.p.rapidapi.com");
    xhr.withCredentials = false;

    xhr.send();

}


export default SearchPage;
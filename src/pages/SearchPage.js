import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./SearchPage.scss"

class SearchPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            movie: {},
            lastQuery: ""
        }
    }

    handleChangeQuery(e) {
        this.setState({ input: e.target.value });
    }

    handleSearch(e){
        console.log('You clicked submit.');

        e.preventDefault();
        let title = this.state.input;

        if(title == this.state.lastQuery){
            console.log("Same request, return...")
            return;
        }
        
        this.state.lastQuery = title;
        let promise = searchMovie(title);
        promise.then((result) => this.setState({movie: result}))
        .catch((error) => console.log("Critical error: " + error.message))
    }

    shouldComponentUpdate(nextprops, nextstate){
        if(this.state.movie.title == nextstate.movie.title){
            console.log("Component isn't updated");
            return false;
        }
        return true;
    }

    render(){
        let cardColor;
        let background;

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            background = (
                <div className="background bg-dark"></div>
            );
            cardColor = " bg-secondary";
        }else{
            background = (
                <div className="background">
                    <iframe className="background-video" src=" https://www.youtube-nocookie.com/embed/gA0nQyDZR4A?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist=gA0nQyDZR4A"></iframe>
                </div>
            );
            cardColor = " bg-dark";
        }

        const movie = (
            <div className={"movie flex-row flex-wrap p-3 d-flex rounded col-sm-8 col-xl-6" + cardColor}>

                <img className="movie__img rounded me-3" src={ this.state.movie.image } />

                <div className="movieInfo container-md row w-75 d-flex align-content-center">
                    
                    <Link className='col-12 col-md-9' to={"/movie/" + this.state.movie.id}>
                        <h4 className="movieInfo__h1">{ this.state.movie.title }</h4>
                    </Link>

                    <div className="movieInfo__rating p-2 col-5 col-md-3 rounded text-center text-nowrap d-flex justify-content-center align-items-center fw-bold">{"IMDb " + this.state.movie.rating }</div>
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

                {background}

                <section className="searchPage container-md text-white row mx-auto justify-content-center">

                    <h1 className="searchPage__heading col-12 col-md-11 col-lg-10 col-xl-8 text-center mb-5">Unlimited movies, TV shows, and more.<br/><small className="display-6">Watch anywhere. Cancel anytime.</small></h1>

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

    let myHeaders = new Headers({
        "X-RapidAPI-Key": "2d4757e1b6msh13937e276a99188p1775c3jsn2eda7d86d856",
        "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com"
    })

    return fetch("https://online-movie-database.p.rapidapi.com/title/v2/find?title=" + title + "&limit=1&sortArg=moviemeter%2Casc", {
        headers: myHeaders
    })
    .then((response) => {
        if(!response.ok){
            throw new Error("Network response failed with code: " + response.status, {cause: response});
        }
        return response.json();
    })
    .then((result) => {
        console.log(result)
        if(result.totalMatches == 0){
            throw new Error("No matches for the request query");
        }
        let resultId = result.results[0].id.slice(7, -1);
        //Fetching more details about the movie
        return fetch("https://online-movie-database.p.rapidapi.com/title/get-overview-details?tconst=" + resultId + "&currentCountry=US", {
            headers: myHeaders
        })
    })
    .then(response => response.json())
    .then((result) => {
        
        let movie = {};
        movie.id = result.id.slice(7, -1);
        movie.title = result.title.title;
        movie.image = result.title.image.url;
        movie.rating = result.ratings.rating;
        movie.type = result.title.titleType.charAt(0).toUpperCase() + result.title.titleType.slice(1);;
        movie.genre = result.genres[0];
        movie.releaseDate = result.title.year;
        movie.description = result.plotOutline.text;

        return movie;
    })
    
}


export default SearchPage;
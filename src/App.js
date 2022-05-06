import logo from './logo.svg';
import './App.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default class App extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {
      starWarsHeroData: localStorage.getItem("heroes") ? JSON.parse(localStorage.getItem("heroes")) : [],
      favorites: localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : []
    };
  }

  async getStarWarsHeroData () {
    return await fetch('https://swapi.dev/api/people/?format=json')
    .then((response) => response.json())
    .then(response => {
        // console.log(response);
        this.setState({ starWarsHeroData: response });
        localStorage.setItem('heroes', JSON.stringify(response))
    });
  }

  componentDidMount() {
    if (!this.state.starWarsHeroData.length) {
      // make fetch request
      return this.getStarWarsHeroData();
      // this.state.starWarsHeroData = this.getStarWarsHeroData();
    } else {
      return this.state.starwarsHeroData;
    }
  }

  componentDidUpdate() {
    if (this.state.starWarsHeroData.length) {
      this.setState({starWarsHeroData: this.state.starWarsHeroData});
    }
  }

  updateFavorite = name => {
    const data = this.state.starWarsHeroData.results.find(item => item.name === name);
    let update = true;

    for (let key in Object.keys(this.state.favorites)) {
      if (this.state.favorites[key] == data.name) {
        update = false;

        this.setState({
          favorites: this.state.favorites.filter(fav => fav != data.name)
        });

        localStorage.setItem('favorites', JSON.stringify([...this.state.favorites]));
        return;
      }
    }

    if (update) {
      this.setState({
        favorites: [...this.state.favorites, data.name]
      });
    }
    
    localStorage.setItem('favorites', JSON.stringify([...this.state.favorites, data.name]));
  };

  render() {
    return (
      <>
        <div className="App container-fluid">
          <section className="App-header row">
            <img src={logo} className="App-logo" alt="logo" />
            

          </section>
          <section className="App-body container">
            <div className="row">
              {
              this.state.starWarsHeroData.results &&
              
              this.state.starWarsHeroData.results.map((item, key) =>
              
                <div className="col-12 col-md-4">
                  <div className={key % 2 ? 'card my-3 text-start p-3 even' : 'card my-3 text-start p-3 odd' }>
                    <button className={this.state.favorites.includes(item.name) ? 'btn btn-outline-dark hero-favorite':'btn btn-outline-dark hero-favorite opacity-5'} onClick={() => this.updateFavorite(item.name)}>
                      <FontAwesomeIcon icon={faStar}/>
                    </button>
                    <h3 className="fw-bolder">{item.name}</h3>
                    <p className="mb-0"><span className="fw-bold">Height: </span>{item.height}</p>
                    <p className="mb-0"><span className="fw-bold">Birth Date: </span>{item.birth_year}</p>
                  </div>
                </div>
              )
              }
            </div>
          </section>
        </div>
      </>
    );
  }
}

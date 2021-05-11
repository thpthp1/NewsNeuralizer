import React from 'react';
import './Article.css'

//One article for the news feed
function Article(props){
  return(
      <div className="article card h-100 shadow bg-white rounded">
        <div className="card-body d-flex flex-column">
          <div className="head-row-container">
            <div className="head-row">
              <img class="card-img-top" src={props.image} alt="Card image cap" ></img>
            </div>
            <div className="head-row">
              <h2 className="card-title">{props.title}</h2>
            </div>
          </div>
          <div className="probability-container" style={{background: props.prediction === '\"True\"' ? 'green' : 'red'}}>
            <div data-testid="predictionAndProbability" className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</div>
          </div>

          <p data-testid="body" className="card-text">{props.body}</p>
          <a data-testid="url" href={props.url} target="_blank" rel="noreferrer noopener" className="btn btn-md btn-outline-primary mt-auto">Visit Source</a>
        </div>
      </div>
    )
}

export default Article;

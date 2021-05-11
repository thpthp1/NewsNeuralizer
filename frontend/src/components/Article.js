import React from 'react';

//One article for the news feed
function Article(props){
    return(
      <div className="article card h-100 shadow bg-white rounded">
        <div className="card-body d-flex flex-column">
          <img class="card-img-top" src={props.image} alt="Card image cap" ></img>
          <h2 data-testid="title" className="card-title">{props.title}</h2>
          <p data-testid="predictionAndProbability" className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</p>
          <p data-testid="body"  className="card-text">{props.body}</p>
          <a data-testid="url" href={props.url} target="_blank" rel="noreferrer noopener" className="btn btn-md btn-outline-primary mt-auto">Visit Source</a>
        </div>
      </div>
    )
}

export default Article;

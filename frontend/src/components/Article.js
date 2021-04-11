import React from 'react';

//One article for the news feed
function Article(props){
    return(
      <div className="article card h-100 shadow bg-white rounded">
        <div className="card-body d-flex flex-column">
          <h2 className="card-title">{props.title}</h2>
          <p className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</p>
          <p className="card-text">{props.body}</p>
          <a href={props.url} target="_blank" rel="noreferrer noopener" className="btn btn-md btn-outline-primary mt-auto">Visit Source</a>
        </div>
      </div>
    )
}

export default Article;

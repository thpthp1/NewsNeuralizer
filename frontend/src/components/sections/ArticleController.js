import React, { useEffect, useState } from 'react';
import axios from "axios";
import Article from "../Article";  
import './ArticleController.css'

//One article for the news feed
// function Verdict(props){
//     return(
//       <div className="article card h-100 shadow bg-white rounded">
//         <div className="card-body d-flex flex-column">
//           <h2 className="card-title">{props.title}</h2>
//           <p className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</p>
//           <p className="card-text">{props.body}</p>
//         </div>
//       </div>
//     )
//   }

function ArticleController(props){
    const [count, setCount] = useState();
    const [feed, setFeed] = useState();
    const [trueFeed, setTrueFeed] = useState([]);
    const [falseFeed, setFalseFeed] = useState([]);
  
    const [rendered, setRendered] = useState(false);
  
    useEffect(() => {
      //http://localhost:8000/api/news-feed
      axios.get("http://localhost:8000/api/news-feed")
        .then(response => response.data)
        .then((data) => {
          setCount(data.count)
          setFeed(data.feed); //Only important one
        })
        .catch((err) => alert(err.message));
    }, []);
  
    const displayFeed = () => {
      if(feed === undefined){
        return <Article title="Loading Title" prediction="Loading Prediction" probability="Loading Probability" body="Loading Body"url="https://google.com"/>;
      }else{
        initializeTrueFalseFeed();
        const arrText = Object.values(feed);
  
        return (
          <ul>
            {arrText.map((article, index) => (
              <div>
                <p>{index}</p>
                <Article title={article.url} prediction={JSON.stringify(article.prediction)} probability={article.proba} body={article.text} url={article.url} />
              </div>
            ))}
          </ul>
        )
      }
    };
  
    const initializeTrueFalseFeed = () => {
      if(rendered === false){
        setRendered(true);
  
        var tFeed = feed.filter((article) => {
          return article.prediction === true;
        });
        console.log("True feed length is " + tFeed.length);
        setTrueFeed(tFeed);
  
        var fFeed = feed.filter((article) => {
          return article.prediction === false;
        })
        console.log("False feed length is " + fFeed.length);
        setFalseFeed(fFeed);
  
      }else{
        //true and false feeds have been initialized, so no need to do anything
      }
    };
    
    
    const displayDualFeed = () => {
      //Show loading screen if still fetching data
      if(feed === undefined){
        return(
          <div key="103" className="row">
            <div className="col-md-6">
              <Article title="Loading True Feed" prediction="Loading Prediction" probability="and Probability" body="Loading Body"url="https://google.com"/>;          </div>
            <div key="104" className="col-md-6">
              <Article title="Loading False Feed" prediction="Loading Prediction" probability="and Probability" body="Loading Body"url="https://google.com"/>;          </div>
          </div>
        );
      }
  
      //set the true or false feed
      initializeTrueFalseFeed();
      
      var trueAmount = trueFeed.length;
      var falseAmount = falseFeed.length;
  
      var smallerAmount = trueAmount < falseAmount ? trueAmount : falseAmount;
      var largerAmount = trueAmount > falseAmount ? trueAmount : falseAmount;
      
      var rows = [];
  
      //add the rows with both articles
      var i;
      for(i = 0; i < smallerAmount; i++){
        rows.push(
          <div key={i} className="row">
            <div className="col-sm-6">
              <Article title={trueFeed[i].url} prediction={JSON.stringify(trueFeed[i].prediction)} probability={trueFeed[i].proba} body={trueFeed[i].text} url={trueFeed[i].url} />
            </div>
            <div className="col-sm-6">
              <Article title={falseFeed[i].url} prediction={JSON.stringify(falseFeed[i].prediction)} probability={falseFeed[i].proba} body={falseFeed[i].text} url={falseFeed[i].url} />
            </div>
          </div>
        );
      }
      
      //add the remaining only true or false articles
      while(i < largerAmount){
        //only true left
        if(trueAmount > falseAmount){
          rows.push(
            <div key={i} className="row">
              <div className="col-sm-6">
                <Article key={i} title={trueFeed[i].url} prediction={JSON.stringify(trueFeed[i].prediction)} probability={trueFeed[i].proba} body={trueFeed[i].text} url={trueFeed[i].url} />
              </div>
              <div className="col-sm-6">
              </div>
            </div>
          );
        }else{
          //only false left
          rows.push(
            <div key={i} className="row">
              <div className="col-sm-6">
              </div>
              <div className="col-sm-6">
                <Article title={falseFeed[i].url} prediction={JSON.stringify(falseFeed[i].prediction)} probability={falseFeed[i].proba} body={falseFeed[i].text} url={falseFeed[i].url} />
              </div>
            </div>
          );
        }
        i++;
      }
  
      return (
        <div>
          {rows}
        </div>
      );
  
    }
    
    return(
      <div className=".article-controller-container" style={{ backgroundColor: '#111'}}>
        <div className="container-fluid" style={{ paddingBottom: '20px' }}>
          <div className="row">
            <div className="col-md-6">
              <h1>True Articles</h1>
            </div>
            <div className="col-md-6">
              <h1>False Articles</h1>
            </div>
          </div>
          {displayDualFeed()}
        </div>
      </div>
    )
  }

  export default ArticleController;
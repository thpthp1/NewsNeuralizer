import React, { useEffect, useState } from 'react';
import axios from "axios";
import Article from "../Article";
import './ArticleController.css'

//Controller to display articles 
function ArticleController(props){
    const [count, setCount] = useState();
    const [feed, setFeed] = useState();
    const [trueFeed, setTrueFeed] = useState([]);
    const [falseFeed, setFalseFeed] = useState([]);

    const [rendered, setRendered] = useState(false);

    useEffect(() => {
      axios.get("http://localhost:8000/api/news-feed")
        .then(response => response.data)
        .then((data) => {
          setCount(data.count)
          setFeed(data.feed);
        })
        .catch((err) => alert(err.message));
    }, []);

    //This displays one feed for extra functionality but is not used right now
    const displayFeed = () => {
      if(feed === undefined){
        return <Article title="Loading Title" prediction="Loading Prediction" probability="Loading Probability" body="Loading Body" url=""/>;
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
          return article.prediction === 'True';
        });
        console.log("True feed length is " + tFeed.length);
        setTrueFeed(tFeed);

        var fFeed = feed.filter((article) => {
          return article.prediction === 'Fake';
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
          <div data-testid="feedLoading" key={i} className="row">
            <div className="col-sm-6">
              <div class="load-spinner"></div>
            </div>
            <div className="col-sm-6">
              <div class="load-spinner"></div>
            </div>
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
              <Article title={trueFeed[i].title} prediction={JSON.stringify(trueFeed[i].prediction)} image={trueFeed[i].image} probability={trueFeed[i].proba} body={trueFeed[i].text} url={trueFeed[i].url} />
            </div>
            <div className="col-sm-6">
              <Article title={falseFeed[i].title} prediction={JSON.stringify(falseFeed[i].prediction)} image={falseFeed[i].image} probability={falseFeed[i].proba} body={falseFeed[i].text} url={falseFeed[i].url} />
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
                <Article key={i} title={trueFeed[i].title} prediction={JSON.stringify(trueFeed[i].prediction)} image={trueFeed[i].image} probability={trueFeed[i].proba} body={trueFeed[i].text} url={trueFeed[i].url} />
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
                <Article title={falseFeed[i].title} prediction={JSON.stringify(falseFeed[i].prediction)} image={falseFeed[i].image} probability={falseFeed[i].proba} body={falseFeed[i].text} url={falseFeed[i].url} />
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
      <div data-testid="feedLoaded" className=".article-controller-container" style={{ backgroundColor: '#111'}}>
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

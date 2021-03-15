import React, { useEffect, useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";

//Old controller prototype
class ArticleController1 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      feed: [],
      trueFeed: [],
      falseFeed: [],
    }
  }

  componentDidMount(){
    this.initializeFeed();
  }

  initializeFeed = () => {
    /*
    axios.get("http://localhost:8000/")
      .then((res) => this.setState({ feed: res.data.feed}))
      .catch((err) => alert(err.message));
      */
  }

  renderList = () => {
    if(!this.state.feed){
      //feed is being fetched and should show loading
      return <Article title="Loading Title" prediction = "Loading Prediction" probability="Loading Probability" body="Loading Body"url="https://google.com" /> ;
    }
    else{
      //Feed has been fetched
      return (
        <p>Hi</p>
      )
    }
  }


  render() {
    return (
      <div>
        <h1>Prototype Article List</h1>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

//The form components for manual user input
function ManualForm(props) {
  const [form, setForm] = useState({
    url: '',
    title: '',
    body: '',
    category: ''
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <div className="p-3 h-100 rounded" style={{ backgroundColor: 'white' }}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-10 col-md-8 col-lg-6">
          <h1>Manual Input Form</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="url" className="mt-3">URL:</label>
              <input type="text" name="url" onChange={handleChange} className="form-control" placeholder="example.com"></input>
            </div>

            <div className="form-group">
              <label for="title" className="">Title:</label>
              <input type="text" name="title" onChange={handleChange} className="form-control" placeholder="Title"></input>
            </div>

            <div className="form-group">
              <label for="body" className="">Article Body:</label>
              <textarea type="text" name="body" onChange={handleChange} className="form-control" placeholder="Insert Article Body Paragraphs" rows="5"></textarea>
            </div>

            <div className="form-group">
              <label for="category" className="">Category:</label>
              <input type="text" name="category" onChange={handleChange} className="form-control" placeholder="optional"></input>
            </div>

            <button type="submit" className="btn btn-primary col-md-12 mb-3">Submit Form</button>
          </form>
        </div>
      </div>
    </div>
  )
}

//One article for the news feed
function Article(props){
  return(
    <div className="article card h-100 shadow bg-white rounded">
      <div className="card-body d-flex flex-column">
        <h2 className="card-title">{props.title}</h2>
        <p className="probability">{props.prediction} {props.probability}</p>
        <p className="card-text">{props.body}</p>
        <a href={props.url} target="_blank" rel="noreferrer noopener" className="btn btn-md btn-outline-primary mt-auto">Visit Source</a>
      </div>
    </div>
  )
}

//Controller for article
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
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <h1>True Articles</h1>
          </div>
          <div className="col-md-6">
            <h1>False Articles</h1>
          </div>
        </div>
        <div key="100" className="row">
          <div className="col-sm-6">
            <Article title="cnn.com" prediction="true" probability="0.123456" body="WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" url="https://google.com" />
          </div>
          <div key="101" className="col-sm-6">
            <Article title="foxnews.com" prediction="False" probability="0.123456" body="WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" url="https://google.com" />
          </div>
        </div>
        {displayDualFeed()}
      </div>
    </div>
  )
}
//      <Article title="cnn.com" prediction="true" probability="0.123456" body="WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" url="https://google.com" />

//      <Article title="foxnews.com" prediction="False" probability="0.123456" body="WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" url="https://google.com" />
ReactDOM.render(
  <React.StrictMode>
    <ArticleController />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

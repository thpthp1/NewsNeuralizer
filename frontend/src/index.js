import React, { useEffect, useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import ArticleForm from './components/sections/ArticleForm';

//The form components for manual user input
function ManualForm(props) {
  const [header, setHeader] = useState(props.header);
  const [processed, setProcessed] = useState(false);
  const [form, setForm] = useState({
    url: props.url,
    title: props.title,
    body: props.body,
    category: ''
  });
  const [probability, setProbability] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //alert(JSON.stringify(form, null, 2));

    const mForm = {
      title: form.title,
      selftext: form.body,
      optionals: { 
        categories: form.category
      }
    };

    axios.post('http://localhost:8000/api/predict', {title: form.title, selftext: form.title})
      .then(response => {
        alert(JSON.stringify(response.data));
        setPrediction(response.data.prediction);
        setProbability(response.data.proba);
        setProcessed(true);
      });
  };

  const displayResult = () => {
    if(processed){
      return(
        <Verdict title={form.title} body={form.body} prediction={prediction} probability={probability}/>
      )
    }else{
      return(
        <h1></h1>
      )
    }
  }


  return (
    <div className="p-3 h-100 rounded" style={{ backgroundColor: '#111' }}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-10 col-md-8 col-lg-6">
          <h1  style={{ color: 'white' }}>{header}</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="title" className="" style={{ color: 'white' }}>Title:</label>
              <input type="text" name="title" onChange={handleChange} className="form-control" placeholder="Title" value={form.title}></input>
            </div>

            <div className="form-group">
              <label for="body" className="" style={{ color: 'white' }}>Article Body:</label>
              <textarea type="text" name="body" onChange={handleChange} className="form-control" placeholder="Article Body Paragraphs" rows="5" value={form.body}></textarea>
            </div>

            <button type="submit" className="btn btn-secondary btn-lg col-md-12 mb-3">Neuralize</button>
          </form>
          {displayResult()}
        </div>
      </div>
      
    </div>
  )
}

/*
ManualForm.defaultProps = {
  url: '',
  title: '',
  body: ''
}
*/

//The form components for scraped user input
function InputtedForm(props) {
  const [header, setHeader] = useState(props.header);
  const [processed, setProcessed] = useState(false);
  const [form, setForm] = useState({
    url: props.url,
    title: props.title,
    body: props.body,
    category: ''
  });
  const [probability, setProbability] = useState('');
  const [prediction, setPrediction] = useState();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //alert(JSON.stringify(form, null, 2));

    const mForm = {
      title: form.title,
      selftext: form.body,
      optionals: { 
        categories: form.category
      }
    };

    axios.post('http://localhost:8000/api/predict', {title: form.title, selftext: form.title})
      .then(response => {
        //alert(JSON.stringify(response.data));
        setPrediction(response.data.prediction);
        //alert(response.data.prediction);
        if(response.data.prediction === true){
          setPrediction('True');
        }else{
          setPrediction('False');
        }
        setProbability(response.data.proba);
        setProcessed(true);
      });
  };

  const displayResult = () => {
    if(processed){
      return(
        <Verdict title={form.title} body={form.body} prediction={prediction} probability={probability}/>
      )
    }else{
      return(
        <h1></h1>
      )
    }
  }


  return (
    <div className="p-3 h-100 rounded" style={{ backgroundColor: '#111' }}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-10 col-md-8 col-lg-6">
          <h1  style={{ color: 'white' }}>{header}</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="title" className="" style={{ color: 'white' }}>Title:</label>
              <input type="text" name="title" onChange={handleChange} className="form-control" placeholder="Title" value={form.title}></input>
            </div>

            <div className="form-group">
              <label for="body" className="" style={{ color: 'white' }}>Article Body:</label>
              <textarea type="text" name="body" onChange={handleChange} className="form-control" placeholder="Article Body Paragraphs" rows="5" value={form.body}></textarea>
            </div>

            <button type="submit" className="btn btn-secondary btn-lg col-md-12 mb-3">Neuralize</button>
          </form>
          {displayResult()}
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
        <p className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</p>
        <p className="card-text">{props.body}</p>
        <a href={props.url} target="_blank" rel="noreferrer noopener" className="btn btn-md btn-outline-primary mt-auto">Visit Source</a>
      </div>
    </div>
  )
}

//One article for the news feed
function Verdict(props){
  return(
    <div className="article card h-100 shadow bg-white rounded">
      <div className="card-body d-flex flex-column">
        <h2 className="card-title">{props.title}</h2>
        <p className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</p>
        <p className="card-text">{props.body}</p>
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
        {displayDualFeed()}
      </div>
    </div>
  )
}


function UrlForm(props){
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [gathered, setGathered] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUrl((prev) => ({
      //...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //alert(JSON.stringify(form, null, 2));

    //https://cnn.com
    const mForm = {
      link: url.url
    };

    //axios.post("http://localhost:8000/api/link-info", {link:"https://www.cnn.com/2021/04/09/politics/marines-coronavirus-vaccines/index.html"}).then((response) => {console.log(response.data)});
    //axios.post("http://localhost:8000/api/link-info", {link:url.url}).then((response) => {console.log(response.data)});
    //alert('Json being sent ' + JSON.stringify(mForm));
    axios.post('http://localhost:8000/api/link-info', {link:url.url})
      .then(response => {
        if(response.data.title != null){
          setTitle(response.data.title);
          console.log(response.data.title)
        }else{

        }

        if(response.data.body != null){
          setBody(response.data.body);
          console.log('Body is ' + body)
        }else{

        }

        setGathered(true);
      })
  };
  

  const displayManualForm = () => {
    if(gathered){
      return(
        <div>
          <InputtedForm header="Here's what we gathered" title={title} body={body}/>
        </div>
      )
    }else{
      return(
        <div>
          <ManualForm header="Manual Input Form" />
        </div>       
      )
    }
  }


  return(
    <div>
      <div className="p-3 h-100 rounded" style={{ backgroundColor: '#111' }}>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <h1  style={{ color: 'white' }}>Let us do the work.</h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label for="url" className="mt-3" style={{ color: 'white' }}>URL:</label>
                <input type="text" name="url" onChange={handleChange} className="form-control" placeholder="example.com"></input>
              </div>
              <button type="submit" data-toggle="modal" data-target="#exampleModal" className="btn btn-secondary btn-lg col-md-12 mb-3">Autofill</button>
            </form>
          </div>
        </div>
      </div>
      {displayManualForm()}
    </div>
  )

}

export default UrlForm

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

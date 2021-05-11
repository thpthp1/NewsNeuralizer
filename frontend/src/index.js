import React, { useEffect, useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import ArticleForm from './components/sections/ArticleForm';

const backendUrl = "http://localhost:8000";

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
  const [submitted, setSubmitted] = useState(false);

  const [showForm, setShowForm] = useState({
    url: props.url,
    title: props.title,
    body: props.body,
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

    setSubmitted(true);

    axios.post(backendUrl+'/api/predict', {title: form.title, selftext: form.body})
      .then(response => {
        setPrediction(response.data.prediction);
        setProbability(response.data.proba);

        setShowForm({
          url: form.url,
          title: form.title,
          body: form.body
        });

        setProcessed(true);
      });
  };

  //Displays processed results, otherwise shows nothing
  const displayResult = () => {
    if(processed){
      return(
        <Verdict data-testid="verdict" title={showForm.title} body={showForm.body} prediction={prediction} probability={probability}/>
      )
    } else if (submitted && showForm.title) {
        return(
          <div className="load-spinner" />
        )
    } else {
        return (<div />);
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
              <input data-testid="titleInput" type="text" name="title" onChange={handleChange} className="form-control" placeholder="Title" value={form.title}></input>
            </div>

            <div className="form-group">
              <label for="body" className="" style={{ color: 'white' }}>Article Body:</label>
              <textarea data-testid="bodyTextArea" type="text" name="body" onChange={handleChange} className="form-control" placeholder="Article Body Paragraphs" rows="5" value={form.body}></textarea>
            </div>

            <button data-testid="subButMan" type="submit" className="btn btn-secondary btn-lg col-md-12 mb-3">Neuralize</button>
          </form>
          {displayResult()}
        </div>
      </div>
      
    </div>
  )
}

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

  const [showForm, setShowForm] = useState({
    url: props.url,
    title: props.title,
    body: props.body,
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

    axios.post(backendUrl+'/api/predict', {title: form.title, selftext: form.body})
      .then(response => {
        setPrediction(response.data.prediction);
        setProbability(response.data.proba);

        setShowForm({
          url: form.url,
          title: form.title,
          body: form.body
        });

        setProcessed(true);
      });
  };

  //Displays processed results, otherwise shows nothing
  const displayResult = () => {
    if(processed){
      return(
        <Verdict data-testid="verdict" title={showForm.title} body={showForm.body} prediction={prediction} probability={probability}/>
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
              <input data-testid="titleInput" type="text" name="title" onChange={handleChange} className="form-control" placeholder="Title" value={form.title}></input>
            </div>

            <div className="form-group">
              <label for="body" className="" style={{ color: 'white' }}>Article Body:</label>
              <textarea data-testid="bodyTextArea" type="text" name="body" onChange={handleChange} className="form-control" placeholder="Article Body Paragraphs" rows="5" value={form.body}></textarea>
            </div>

            <button data-testid="subButInp" type="submit" className="btn btn-secondary btn-lg col-md-12 mb-3">Neuralize</button>
          </form>
          {displayResult()}
        </div>
      </div>
      
    </div>
  )
}

//One processed article from the user
function Verdict(props){
  return(
    <div className="article card h-100 shadow bg-white rounded">
      <div className="card-body d-flex flex-column">
        <h2 data-testid="title" className="card-title">{props.title}</h2>
        <div className="probability-container" style={{background: props.prediction === 'True' ? 'green' : 'red'}}>
          <p data-testid="predictionAndProbability" className="probability">{props.prediction} {isNaN(props.probability) ? props.probability : parseFloat(props.probability * 100).toFixed(0) + '%'}</p>
        </div>
        <p data-testid="body" className="card-text">{props.body}</p>
      </div>
    </div>
  )
}

//Url input form with manual/inputted form attached
function UrlForm(props){
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [gathered, setGathered] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUrl((prev) => ({
      [name]: value
    }));
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setGathered(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetForm();

    axios.post(backendUrl+'/api/link-info', {link:url.url})
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
  
  //Displays manual form until the user decides to use the url. Scraper results are then shown in the form
  const displayManualForm = () => {
    if(gathered){
      return(
        <div>
          <InputtedForm header="Here's what we gathered." title={title} body={body}/>
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
                <input data-testid="urlInput" type="text" name="url" onChange={handleChange} className="form-control" placeholder="example.com"></input>
              </div>
              <button data-testid="subButUrl" type="submit" data-toggle="modal" data-target="#exampleModal" className="btn btn-secondary btn-lg col-md-12 mb-3">Autofill</button>
            </form>
          </div>
        </div>
      </div>
      {displayManualForm()}
    </div>
  )

}

export default UrlForm;
export {InputtedForm, ManualForm, Verdict, backendUrl};


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

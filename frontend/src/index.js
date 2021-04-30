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
    //alert(JSON.stringify(form, null, 2));

    /*
    const mForm = {
      title: form.title,
      selftext: form.body,
      optionals: { 
        categories: form.category
      }
    };
    */

    axios.post('http://localhost:8000/api/predict', {title: form.title, selftext: form.body})
      .then(response => {
        //alert(JSON.stringify(response.data));
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

  const displayResult = () => {
    if(processed){
      return(
        <Verdict title={showForm.title} body={showForm.body} prediction={prediction} probability={probability}/>
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
    //alert(JSON.stringify(form, null, 2));

    axios.post('http://localhost:8000/api/predict', {title: form.title, selftext: form.body})
      .then(response => {
        //alert(JSON.stringify(response.data));
        setPrediction(response.data.prediction);
        //alert(response.data.prediction);
        setProbability(response.data.proba);

        setShowForm({
          url: form.url,
          title: form.title,
          body: form.body
        });

        setProcessed(true);
      });
  };

  const displayResult = () => {
    if(processed){
      return(
        <Verdict title={showForm.title} body={showForm.body} prediction={prediction} probability={probability}/>
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

  const resetForm = () => {
    setUrl('');
    setTitle('');
    //setBody('');
    setGathered(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //alert(JSON.stringify(form, null, 2));

    /*
    const mForm = {
      link: url.url
    };
    */

    resetForm();

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

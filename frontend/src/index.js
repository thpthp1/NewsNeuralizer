import React, { useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//default class component
class MyClass extends React.Component {
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}

//Test function component
function FunComponent(props) {
  const [userInput, setUserInput] = useState('');
  const [textArea, setTextArea] = useState('');
  const [sub, setSub] = useState('');
  const [myArray, setMyArray] = useState([]);

  const handleSubmit = (e) => {
    setSub(userInput);
    e.preventDefault();
  }

  const handleUserInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
  }

  const handletextAreaChange = (e) => {
    const input = e.target.value;
    setTextArea(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={userInput} onChange={handleUserInputChange}></input>
      <textarea type="text" value={textArea} onChange={handletextAreaChange}></textarea>
      <p>{userInput}</p>
      <button type="submit" >Click me!</button>
      <p style={{ color: 'red' }}>{sub}</p>
    </form>
  );
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
    <div className="article">
        <h1>{props.title}</h1>
        <p className="probability">{props.probability}</p>

        <p>{props.body}</p>

        <form action={props.url}>
          <button type="submit">Read More</button>
        </form>
    </div>
  )
}

function ArticleController(props){
  return(
    <Article title="Hi, I'm the title" probability=".9" body="I'm a body text weeeeeeeeee" url="https://google.com"/>
  )
}

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

import './App.css';
import Welcome from './components/sections/Welcome';
import ArticleForm from './components/sections/ArticleForm';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
       <>
        <Welcome />
        <ArticleForm />
       </>
  );
}

export default App;

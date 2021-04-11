import './App.css';
import Welcome from './components/sections/Welcome';
import ArticleForm from './components/sections/ArticleForm';
import ManualForm from './index';
import ArticleController from './components/sections/ArticleController';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
       <>
        <Welcome />
        <ManualForm />
        <ArticleController />
       </>
  );
}

export default App;

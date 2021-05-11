import './App.css';
import Welcome from './components/sections/Welcome';
import ArticleForm from './components/sections/ArticleForm';
import ManualForm from './index';
import ArticleController from './components/sections/ArticleController';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
       <>
        <Welcome data-testid="welcome"/>
        <ManualForm data-testid="manualForm"/>
        <ArticleController data-testid="articleController"/>
       </>
  );
}

export default App;

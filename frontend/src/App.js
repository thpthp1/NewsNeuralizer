import './App.css';
import Welcome from './components/sections/Welcome';
import ArticleForm from './components/sections/ArticleForm';
import ManualForm from './index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
       <>
        <Welcome />
        <ManualForm />
       </>
  );
}

export default App;

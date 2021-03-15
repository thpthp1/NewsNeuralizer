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
    /* // <Router>
       <Switch>
         <Route path='/' exact component={Welcome} />
         <Route path='/' exact component={ArticleInput} />
       </Switch>
     </Router> */
  );
}

export default App;

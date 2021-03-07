import './App.css';
import Welcome from './components/pages/Welcome';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Welcome} />
      </Switch>
    </Router>
  );
}

export default App;

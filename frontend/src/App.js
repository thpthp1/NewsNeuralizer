import './App.css';
import Welcome from './components/sections/Welcome';
import ManualForm from './index';
import ArticleController from './components/sections/ArticleController';

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

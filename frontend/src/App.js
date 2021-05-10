import './App.css';
import Welcome from './components/sections/Welcome';
import ManualForm from './index';
import ArticleController from './components/sections/ArticleController';

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

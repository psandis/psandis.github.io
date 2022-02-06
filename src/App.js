// App.jsx - file
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import './App.css';
import Home from './Pages/Home';
import Projects from './Pages/Projects';
import About from './Pages/About';
import Navigation from './Navigation/Navigation';
import Contact from './Pages/Contact';
import Footer from './Pages/Footer';

function App() {
  return (    
    <Router>
    <Navigation links={{}} />       
    <Switch>
        {/* Set up the Router */}
        <Route path="/" exact component={Home} />
        <Route exact path="/projects" component={Projects} />        
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />  
        <Route path="/MyGithub"
            component={() => {
              window.location.replace('https://github.com/psandis');
              return null;
            }}
          />   
    </Switch>
    <Footer />
    </Router>
  );
}<Route
            path="/privacy-policy"
            component={() => {
              window.location.replace('https://example.com/1234');
              return null;
            }}
          />
 
export default App;
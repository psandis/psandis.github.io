import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../Thumbnail.js'; // Import the Thumbnail component
 
function Projects(props) {
  return (
    // Render a Thumbnail component
    <div className='content'>
      <h1>Projects</h1>
      <p>To be updated soon 🛠️... </p>
      <p>Have a look at my psandis <Link to="/MyGithub">Github</Link> page for current projects.</p>
      {/*<Thumbnail
        link=""
        image=""
        title=""
        category=""
      />*/}
      
    </div>
  )
}


 
export default Projects;
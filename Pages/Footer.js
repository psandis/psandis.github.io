import React from 'react';

const currentDate = new Date();

function Footer(props) {
  return (
    <div className='footer'>      
    <p>psandis &copy; {currentDate.getFullYear()}, running on React. 
    </p>
    </div>
  )
}
 
export default Footer;


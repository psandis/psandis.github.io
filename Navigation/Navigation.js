import React from "react";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import {FaGithub, FaBars, FaGitSquare} from "react-icons/fa";

import Home from '../Pages/Home.js'; 
import Projects from '../Pages/Projects.js'; 

//import logo from '../Images/my-site.png';

const Navigation = (props) => {
  return (
    <>
      <Nav>
      {/* Set up the Links */}
      <NavMenu>
      <NavLink to="/" className="item">
      {/*
      <img src={logo} style={{height: '50px', width: '50px'}} alt="Logo" /> 
      */}
      <Circle></Circle>      
      </NavLink>
      <NavLink to="/projects" className="item">
        Projects
      </NavLink>      
      <NavLink to="/contact" className="item">
        Contact        
      </NavLink>
      </NavMenu>
        
      </Nav>   
     </> 
    )
}

export default Navigation;

export const Nav = styled.nav`
  background: #0a459a;  
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vm - 1000px) / 2);
  z-index: 10;
`

export const NavLink = styled(Link)`
  color: #ffffff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #15cdfc;
  }  
`

export const Bars = styled(FaGithub)`
  display: none;
  color: #0a459a;
  
  @media screen and (max-width: 768px){
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100px, 75%);
    font-size: 1.8rem;
    cursor:pointer;
  }
`

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  background: #0a459a; 
  @media screen and (max-width: 768px){
    display:none;
  }
`

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;  

  @media screen and (max-width: 768px){
    display: none;
  }
`

export const NavBtnLink = styled(Link)`
  border-radius: 4px;  
  padding: 10px 22px;
  color: #ccc;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover{
  transition: all 0.2s ease-in-out;
  
  }
`

export const Circle = styled(FaGithub)`
z-index: 6;
margin-top: 0.2vmin;
margin-left: 0.2vmin;
height:5vmin;
width:5vmin;
border-radius:50%;
background: #0a459a; 
`


export const Circle2 = styled(FaBars)`
background: #0a459a; 
z-index: 7;
margin-left:18vmin;
margin-top: 3vmin;
height:5vmin;
width:5vmin;
border-radius:100%;
border:solid 4.5vmin rgb(255,255,55,.7);
`

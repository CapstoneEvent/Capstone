import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../imgs/logo-bookmark-white.png";
import { FaReact, FaGithub, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-bookmark-blue py-8 px-12">
      <div className="container flex flex-col md:flex-row items-center">
        <div className="flex flex-1 flex-wrap items-center justify-center md:justify-start gap-12">
          <Link to="/" className="text-2xl font-bold text-white">
            Event Buddy
          </Link>
          <ul className="flex text-white uppercase gap-12 text-xs">
            <li className="cursor-pointer">Features</li>
            <li className="cursor-pointer">Pricing</li>
            <li className="cursor-pointer">Contact</li>
          </ul>
        </div>
        <div className="flex gap-10 mt-12 md:mt-0">
          <FaGithub size={50} color="white" />
          <FaInstagram size={50} color="white" />
          <FaTwitter size={50} color="white" />
          <FaPinterest size={50} color="white" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

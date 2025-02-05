import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2D2F31] text-white py-8 mt-7">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Social Media Icons */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-md transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} Your Online Course. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import "./header.scss";

import logo from "./../../assets/logo.png";

const headerNav = [
  {
    display: "Home",
    path: "/",
  },
  {
    display: "Movies",
    path: "/movie",
  },
  {
    display: "TV Series",
    path: "/tv",
  },
  {
    display: "Watchlist",
    path: "/watchlist",
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const active = headerNav.findIndex((e) => e.path === pathname);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/login");
  };

  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };

    window.addEventListener("scroll", shrinkHeader);

    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, []);

  return (
    <div ref={headerRef} className="header">
      <div className="header__wrap container">
        <div className="logo">
          <img src={logo} alt="logo" />
          <Link to="/">Movie Central </Link>
        </div>

        <ul className="header__nav">
          {headerNav.map((e, i) => (
            <li key={i} className={`${i === active ? "active" : ""}`}>
              <Link to={e.path}>{e.display}</Link>
            </li>
          ))}
          
          {user && (
            <li className="user-menu">
              <button 
                className="user-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <button 
                    onClick={logout} 
                    className="logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;

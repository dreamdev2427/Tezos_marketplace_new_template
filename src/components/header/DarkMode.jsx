import React from "react";
import { Link } from "react-router-dom";
import imgsun from "../../assets/images/icon/sun.png";

const DarkMode = () => {
  let clickedClass = "clicked";
  const body = document.body;
  const lightTheme = "light";
  const darkTheme = "is_dark";
  let theme;

  if (localStorage) {
    theme = localStorage.getItem("theme");
  }
  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(darkTheme);
  }

  const switchTheme = (e) => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      e.target.classList.remove(clickedClass);
      localStorage.setItem("theme", "light");
      theme = lightTheme;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      e.target.classList.add(clickedClass);
      localStorage.setItem("theme", "is_dark");
      theme = darkTheme;
    }
  };
  return (
    <div className="mode_switcher">
      <h6>
        Dark mode <strong>Available</strong>
      </h6>
      <Link to="#" onClick={(e) => switchTheme(e)}>
        <img
          src={
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEhSURBVHgBtZWNEYIwDIUfngMwgiO4gWygG+gGuoFuwAiMwAiMwAh1BDeIjfc4a4XScMd3l+MoyUsa+gMYEBGnhrUQYonZYGV+Evjibt46b7sJ/yftD43x1qoGpqCDsNc7ZEJxx9gu17FBJt63zi6MSTRgz/fS24OtG+i9nYOYvRZkmfXYjMaYr3gmgQuEDjobjh+jbyWs+KBLSoCtG5LcYYV9Vo4Jnypn5biwp8H4B6SLKGO/WG92J6f6WxTFC0uR77KsEj4n+vRYkOBu+MlnWIkE9HkKxqvwG5Yia2w0ijbCo4Jjuif6QLhjC4eNp0dFLZnnkKNIjfyimqwZyXflmKYeFdamHPXCaafEJXEnM4kWeMVShh9giVn9Tt7CxhNG3rhxSa0K5UYkAAAAAElFTkSuQmCC"
          }
          alt=""
        />
      </Link>
    </div>
  );
};

export default DarkMode;

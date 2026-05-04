import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Routes from "./routes/Routes";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />

        <Route path="/register" component={Register} />

        <Route
          path="/"
          render={() =>
            isAuth ? (
              <div>
                <Header />
                <Routes />
                <Footer />
              </div>
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

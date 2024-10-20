import NotFound from "./components/NotFound";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import Homepage from "./components/Homepage";
import BlogAtt from "./components/exp/BlogAtt";
import Auth from "./components/Auth";
import BlogDetails from "./components/BlogDetails";
import Create from "./components/Create";
import LandingPage from "./components/LandingPage";
import Figma from "./Figma";

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar></NavBar>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            
            <Route exact path="/figma">
              <Figma />
            </Route>
            <Route exact path="/blogs">
              <Homepage />
            </Route>
            <Route exact path="/create">
              <Create />
            </Route>
            <Route exact path="/blogs/:id">
              <BlogDetails />
              
            </Route>
            <Route exact path="/signup">
              <Auth />
            </Route>

            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;

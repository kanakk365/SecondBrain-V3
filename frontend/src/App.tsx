
import "./App.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import SharePage from "./pages/SharePage";

function App() {
  
  const user = useSelector((state:RootState)=>state.auth.user)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login  />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home/>} />
            <Route path="/share/brain/:hash" element={<SharePage/>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

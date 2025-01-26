import "./App.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import { useSelector } from "react-redux";
// import { RootState } from "./store/store";
import SharePage from "./pages/SharePage";
import LandingV2 from "./pages/LandingV2";
import MainLayout from "./MainLayout";
import { BackgroundLines } from "./components/ui/background-lines";

function App() {
  
  // const user = useSelector((state:RootState)=>state.auth.user)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingV2 />} />
            <Route path="/login" element={<BackgroundLines><Login/></BackgroundLines>  } />
            <Route path="/signup" element={<BackgroundLines><Signup/></BackgroundLines>} />
            <Route path="/home" element={<MainLayout> <Home/></MainLayout>} />
            <Route path="/share/brain/:hash" element={<SharePage/>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

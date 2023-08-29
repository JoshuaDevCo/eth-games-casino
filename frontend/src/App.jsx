import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import BottomBar from "./layout/BottomBar";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import Home from "./pages/home/Index";
import Rps from "./pages/rps/Index";
import Rouelette from "./pages/roulette/Index";
import CoinFlip from "./pages/coin-flip/Index";
import Dice from "./pages/dice/Index";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { pathname } = useLocation();
  const [walletConnect, setWalletConnect] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="grid sm:pb-0 pb-[70px] grid-area grid-cols-[100px__1fr] grid-rows-[80px__1fr] sm:grid-rows-[40px__1fr] w-full">
      <Topbar walletConnect={walletConnect} setWalletConnect={setWalletConnect} />
      <Sidebar />
      <BottomBar />
      <div className="main wrapper pb-10 pt-5 sm:py-10">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Rps />} path="/rps" />
          <Route element={<Rouelette />} path="/roulette" />
          <Route element={<CoinFlip />} path="/coin" />
          <Route element={<Dice />} path="/dice" />
        </Routes>

        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;

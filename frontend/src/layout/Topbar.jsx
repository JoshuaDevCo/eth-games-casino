import { useState } from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  return (
    <>
      {toggleSidebar && (
        <div
          onClick={() => setToggleSidebar(false)}
          className="fixed top-0 left-0 w-full z-[90] h-full bg-black bg-opacity-50 sm:hidden block"
        ></div>
      )}
      {/* mobile sidebar ================= */}
      <div
        className={`fixed top-0 ${
          toggleSidebar ? "left-0" : "-left-full"
        } bg-[#1b2535] w-[80%] max-w-[500px] sm:hidden flex justify-start items-start flex-col p-6 z-[100] transition-all duration-700 h-full overflow-y-auto`}
      >
        <div className="w-full justify-between items-center flex">
          <Link to="/" onClick={() => setToggleSidebar(false)}>
            <img src="/logo.png" className="w-[80px] object-contain" alt="" />
          </Link>
          <button
            onClick={() => setToggleSidebar(false)}
            className="sm:hidden grid place-items-center w-[35px] h-[35px] rounded-md bg-[#283449]"
          >
            <img src="/cross.svg" className="w-3 object-contain" alt="" />
          </button>
        </div>
        <div className=" flex mt-8 justify-center flex-col items-center w-full gap-3">
          <button className="flex justify-center items-center gap-[10px] text-white bg-[#036837] border border-solid border-[#036837] uppercase h-10 px-5 w-full font-bold text-xs rounded-md">
            <img src="/trophy.svg" className="w-5 object-contain" alt="" />{" "}
            Contest
          </button>
          <button className="flex justify-center items-center gap-[10px] text-[#c37001] bg-[#ffd000] border border-solid border-[#ffd000] uppercase h-10 px-5 w-full font-bold text-xs rounded-md">
            <img src="/stake.svg" className="w-5 object-contain" alt="" /> Stake
          </button>
          <button className="flex justify-center items-center gap-[10px] text-white bg-accent border border-solid border-accent uppercase h-10 px-5 w-full font-bold text-xs rounded-md">
            <img src="/rocket.svg" className="w-5 object-contain" alt="" /> Earn
          </button>
        </div>
        <div className="flex w-full flex-col border-t gap-5 border-solid border-black mt-[120px] py-5 justify-start items-start">
          <div className="flex justify-start items-center gap-3">
            <p className="text-primary text-sm font-bold">Built on:</p>
            <img
              src="/winr-logo.png"
              className="w-[60px] object-contain"
              alt=""
            />
          </div>
          <div className="flex justify-start items-start flex-wrap gap-5">
            <div className="flex justify-start items-start flex-col gap-[10px]">
              <h4 className="text-white font-bold text-base mb-2">Support</h4>
              <a href="#" className="text-primary text-sm font-bold ">
                Docs
              </a>
              <a href="#" className="text-primary text-sm font-bold ">
                Guides
              </a>
            </div>
            <div className="flex justify-start items-start flex-col gap-[10px]">
              <h4 className="text-white font-bold text-base mb-2">Navigate</h4>
              <a href="#" className="text-primary text-sm font-bold ">
                Statistics
              </a>
              <a href="#" className="text-primary text-sm font-bold ">
                Dune
              </a>
            </div>
            <div className="flex justify-start items-start flex-col gap-[10px]">
              <h4 className="text-white font-bold text-base mb-2">Social</h4>
              <div className="flex justify-start items-center gap-4">
                <a href="#" target="blank">
                  <img
                    src="/twitter.svg"
                    className="w-6 object-contain"
                    alt=""
                  />
                </a>
                <a href="#" target="blank">
                  <img
                    src="/telegram.svg"
                    className="w-6 object-contain"
                    alt=""
                  />
                </a>
                <a href="#" target="blank">
                  <img
                    src="/discord.svg"
                    className="w-6 object-contain"
                    alt=""
                  />
                </a>
                <a href="#" target="blank">
                  <img
                    src="/mirror.svg"
                    className="w-6 object-contain"
                    alt=""
                  />
                </a>
                <a href="#" target="blank">
                  <img
                    src="/github.svg"
                    className="w-6 object-contain"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* //desktop menu ----------- */}
      <div className="topbar sticky top-0 z-10 bg-dark wrapper">
        <div className="contain h-full justify-between items-center gap-4">
          <Link to="/" className="sm:hidden block">
            <img src="/logo.png" className="w-[100px] object-contain " alt="" />
          </Link>
          <div className="hidden sm:flex justify-start items-center gap-10">
            <p className="text-primary font-bold uppercase text-xs">
              Volume <span className="text-white">61,013,168</span>
            </p>
            <p className="text-primary font-bold uppercase text-xs">
              Bets <span className="text-white">61,013,168</span>
            </p>
          </div>
          <div className="flex justify-start items-center gap-4">
            <img
              src="/music.svg"
              className="w-6 sm:w-4 object-contain"
              alt=""
            />
            <img
              src="/wallet-gray.svg"
              className="sm:hidden block w-[28px] object-contain"
              alt=""
            />
            <button className="hidden sm:flex text-white font-bold text-xs justify-center items-center gap-2">
              <img
                src="/wallet.svg"
                className="w-[17px] object-contain"
                alt=""
              />
              Connect Wallet
            </button>
            <button
              onClick={() => setToggleSidebar(true)}
              className="sm:hidden grid place-items-center w-[38px] h-[38px] rounded-md bg-[#283449]"
            >
              <img src="/bars.svg" className="w-4 object-contain" alt="" />
            </button>
            <img
              src="/msg.svg"
              className="ml-4 sm:block hidden w-5 object-contain"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;

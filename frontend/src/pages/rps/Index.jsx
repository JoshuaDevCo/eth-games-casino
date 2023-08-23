import { useState } from "react";

const Rps = () => {
  const [selectedChoice, setSelectedChoice] = useState("paper");
  return (
    <div className="contain justify-start items-center flex-col gap-5">
      <div className="w-full flex-col gap-10 px-3 sm:px-10 flex justify-center items-center pt-10 pb-[90px] rounded-2xl sm:rounded-[45px]  bg-dark">
        <div className="grid  grid-cols-3 grid-rows-2 gap-x-4 sm:gap-x-8 gap-y-0 sm:gap-y-[30px] w-full max-w-[320px] sm:max-w-[480px]">
          <div className="grid place-items-center bg-accent border-b-8 border-solid aspect-square border-[#c37001] rounded-lg">
            <img
              src={`/${selectedChoice}.svg`}
              className="w-[25px] sm:w-[50px] object-contain"
              alt=""
            />
          </div>
          <img src="/vs.png" className="w-full object-contain" alt="" />
          <div className="grid place-items-center rounded-lg bg-[#283346] w-full aspect-square">
            <img
              src="/question-mark.png"
              className="w-[14px] sm:w-[28px] object-contain"
              alt=""
            />
          </div>
          {["rock", "scissors", "paper"].map((elem, idx) => {
            return (
              <div
                key={idx + elem}
                className="flex w-full justify-start items-center flex-col gap-4"
              >
                <button
                  onClick={() => setSelectedChoice(elem)}
                  className={`grid relative place-items-center w-full ${
                    selectedChoice === elem
                      ? "bg-accent border-b-8 border-solid border-[#c37001]"
                      : "bg-[#283346]"
                  }  aspect-square  rounded-lg`}
                >
                  <div
                    className={`absolute top-[10px] right-[10px] rounded-full sm:w-5 w-3 h-3 sm:h-5 ${
                      selectedChoice === elem
                        ? "bg-accent border-[3px] sm:border-[6px] border-solid border-white"
                        : "bg-[#283346] border-[#68758c] border-2 border-solid "
                    }`}
                  ></div>
                  <img
                    src={`/${elem}.svg`}
                    className="w-[25px] sm:w-[50px] object-contain"
                    alt=""
                  />
                </button>
                <div className="flex justify-center items-center gap-2">
                  <p className="text-primary text-sm font-bold">-0</p>
                  <img src="/eth.svg" className="w-5 object-contain" alt="" />
                </div>
              </div>
            );
          })}
        </div>
        <button className="flex sm:max-w-[480px] justify-center items-center gap-[10px] text-white bg-accent border border-solid border-accent uppercase h-10 px-5 w-full font-medium text-xs rounded-md">
          Bet
        </button>
      </div>
    </div>
  );
};

export default Rps;

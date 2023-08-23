import { useState } from "react";

const Dice = () => {
  const [selectedDice, setSelectedDice] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  return (
    <div className="contain justify-start items-center flex-col gap-5">
      <div className="w-full flex-col gap-10 px-3 sm:px-10 flex justify-center items-center pt-10 pb-[40px] rounded-2xl sm:rounded-[45px] relative min-h-[500px] isolate  bg-dark overflow-hidden">
        <div className="w-full max-w-[1000px] aspect-square -z-10 absolute top-[40%] pointer-events-none -translate-y-1/2 left-1/2 -translate-x-1/2">
          <img
            src="/dice-bg.svg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="flex justify-start items-center flex-col gap-6 w-full max-w-[272px]">
          <div className="w-full grid grid-cols-3 grid-rows-2 gap-4">
            {/* dice 1 ------- */}
            <div
              onClick={() =>
                setSelectedDice((prev) => {
                  let copy = [...prev];
                  copy[0] = !prev[0];
                  return copy;
                })
              }
              className={`${
                selectedDice[0]
                  ? "bg-[#c37001] bg-diceSelected"
                  : "hover:bg-[#394861] hover:bg-diceHover bg-diceNotSelected bg-[#192131]"
              } grid  gap-2 place-items-center w-full aspect-square  rounded-2xl p-3 transition-all duration-300  bg-cover bg-center border-solid border-4 border-[#192131] `}
            >
              <div className="bg-white w-[10px] aspect-square rounded-full"></div>
            </div>
            {/* dice 1 ends ------- */}
            {/* dice 2 ------- */}
            <div
              onClick={() =>
                setSelectedDice((prev) => {
                  let copy = [...prev];
                  copy[1] = !prev[1];
                  return copy;
                })
              }
              className={`${
                selectedDice[1]
                  ? "bg-[#c37001] bg-diceSelected"
                  : "hover:bg-[#394861] hover:bg-diceHover bg-diceNotSelected bg-[#192131]"
              } grid grid-cols-2 gap-2 place-items-center w-full aspect-square  rounded-2xl p-3 transition-all duration-300  bg-cover bg-center border-solid border-4 border-[#192131] `}
            >
              <div className="bg-white w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white col-start-2 col-span-1 row-start-2 w-[10px] aspect-square rounded-full"></div>
            </div>
            {/* dice 2 ends ------- */}
            {/* dice 3 ------- */}
            <div
              onClick={() =>
                setSelectedDice((prev) => {
                  let copy = [...prev];
                  copy[2] = !prev[2];
                  return copy;
                })
              }
              className={`${
                selectedDice[2]
                  ? "bg-[#c37001] bg-diceSelected"
                  : "hover:bg-[#394861] hover:bg-diceHover bg-diceNotSelected bg-[#192131]"
              } grid grid-cols-3 gap-2 place-items-center w-full aspect-square  rounded-2xl p-3 transition-all duration-300  bg-cover bg-center border-solid border-4 border-[#192131] `}
            >
              <div className="bg-white w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white col-start-2 col-span-1 row-start-2 w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white col-start-3 col-span-1 row-start-3 w-[10px] aspect-square rounded-full"></div>
            </div>
            {/* dice 3 ends ------- */}
            {/* dice 4 ------- */}
            <div
              onClick={() =>
                setSelectedDice((prev) => {
                  let copy = [...prev];
                  copy[3] = !prev[3];
                  return copy;
                })
              }
              className={`${
                selectedDice[3]
                  ? "bg-[#c37001] bg-diceSelected"
                  : "hover:bg-[#394861] hover:bg-diceHover bg-diceNotSelected bg-[#192131]"
              } grid grid-cols-2 gap-2 place-items-center w-full aspect-square  rounded-2xl p-3 transition-all duration-300  bg-cover bg-center border-solid border-4 border-[#192131] `}
            >
              <div className="bg-white w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
            </div>
            {/* dice 4 ends ------- */}
            {/* dice 5 ------- */}
            <div
              onClick={() =>
                setSelectedDice((prev) => {
                  let copy = [...prev];
                  copy[4] = !prev[4];
                  return copy;
                })
              }
              className={`${
                selectedDice[4]
                  ? "bg-[#c37001] bg-diceSelected"
                  : "hover:bg-[#394861] hover:bg-diceHover bg-diceNotSelected bg-[#192131]"
              } grid grid-cols-3 gap-2 place-items-center w-full aspect-square  rounded-2xl p-3 transition-all duration-300  bg-cover bg-center border-solid border-4 border-[#192131] `}
            >
              <div className="bg-white w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white col-start-3 col-span-1  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  col-start-1 col-span-1 row-start-3 w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  col-start-2 col-span-1 row-start-2 w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full col-start-3 col-span-1 row-start-3"></div>
            </div>
            {/* dice 5 ends ------- */}
            {/* dice 6 ------- */}
            <div
              onClick={() =>
                setSelectedDice((prev) => {
                  let copy = [...prev];
                  copy[5] = !prev[5];
                  return copy;
                })
              }
              className={`${
                selectedDice[5]
                  ? "bg-[#c37001] bg-diceSelected"
                  : "hover:bg-[#394861] hover:bg-diceHover bg-diceNotSelected bg-[#192131]"
              } grid grid-cols-2 gap-2 place-items-center w-full aspect-square  rounded-2xl p-3 transition-all duration-300  bg-cover bg-center border-solid border-4 border-[#192131] `}
            >
              <div className="bg-white w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
              <div className="bg-white  w-[10px] aspect-square rounded-full"></div>
            </div>
            {/* dice 6 ends ------- */}
          </div>
          <div className="w-full flex justify-center items-center max-w-[272px] gap-5">
            <div className="flex w-full justify-start items-start flex-col gap-2">
              <p className="text-sm font-bold text-primary">Multiplier</p>
              <p className="bg-primary text-white rounded-xl h-10 w-full px-[15px] py-2 flex justify-start items-center text-base">
                x1.96
              </p>
            </div>
            <div className="flex w-full justify-start items-start flex-col gap-2">
              <p className="text-sm font-bold text-primary">Win Chance</p>
              <p className="bg-primary text-white rounded-xl h-10 w-full px-[15px] py-2 flex justify-start items-center text-base">
                50%
              </p>
            </div>
          </div>
          <button className="flex  mt-2 justify-center items-center gap-[10px] text-white bg-accent border border-solid border-accent uppercase h-10 px-5 w-full font-medium text-xs rounded-md">
            Bet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dice;

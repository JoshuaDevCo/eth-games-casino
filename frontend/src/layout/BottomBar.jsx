import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const BottomBar = () => {
  const [gamesBar, setGamesBar] = useState(false);
  return (
    <>
      {gamesBar && (
        <div
          onClick={() => setGamesBar(false)}
          className="bg-black opacity-50 md:hidden block fixed top-0 left-0 z-40 w-full h-full"
        ></div>
      )}
      <div
        className={` fixed transition-all duration-700 w-full left-0 bg-dark p-6 flex justify-start items-start md:hidden flex-col z-50 rounded-tr-[20px] rounded-tl-[20px] ${
          gamesBar ? "bottom-0" : "-bottom-full"
        }`}
      >
        <div className="flex justify-between items-center w-full gap-2">
          <p className="text-white font-bold">Games</p>
          <button
            onClick={() => setGamesBar(false)}
            className=" grid place-items-center w-[35px] h-[35px] rounded-md bg-[#283449]"
          >
            <img src="/cross.svg" className="w-3 object-contain" alt="" />
          </button>
        </div>
        <div className="grid w-full grid-cols-4 mt-5 gap-3">
          <GamesItem
            ico="/sidebar/roulette.svg"
            name="Roulette"
            link="/roulette"
            onClick={() => setGamesBar(false)}
          />
          <GamesItem
            ico="/sidebar/dice.svg"
            name="Dice"
            link="/dice"
            onClick={() => setGamesBar(false)}
          />
          <GamesItem
            ico="/sidebar/coin-flip.svg"
            name="Coin Flip"
            link="/coin"
            onClick={() => setGamesBar(false)}
          />
          <GamesItem
            ico="/sidebar/rock-paper.svg"
            name="RPS"
            link="/rps"
            onClick={() => setGamesBar(false)}
          />
        </div>
      </div>
      <div className="fixed bottom-0 z-10 left-0 w-full py-1 min-h-[75px] bg-dark md:hidden flex justify-between px-3 items-center">
        <BottomBarLink
          onClick={() => setGamesBar((prev) => !prev)}
          ico="/bottombar/games.svg"
          name="Games"
        />
        <BottomBarLink ico="/bottombar/earn.svg" name="Earn" />
        <BottomBarLink ico="/bottombar/stake.svg" name="Stake" />
        <BottomBarLink ico="/bottombar/referral.svg" name="Referral" />
        <BottomBarLink ico="/bottombar/analytics.svg" name="Analytics" />
        <BottomBarLink ico="/bottombar/contest.svg" name="Contest" />
      </div>
    </>
  );
};

export default BottomBar;

const BottomBarLink = ({ ico, name, link, onClick = () => "" }) => {
  return (
    <div
      onClick={onClick}
      className="w-full relative flex justify-start group cursor-pointer items-center flex-col gap-2"
    >
      <div className="relative isolate w-full grid place-items-center">
        <img src={ico} className="h-[30px]  object-contain" alt="" />
      </div>
      <p className="text-text group-hover:text-white transition-all font-bold text-xs">
        {name}
      </p>
    </div>
  );
};
const GamesItem = ({ ico, name, link, onClick = () => "" }) => {
  return (
    <NavLink
      end
      onClick={onClick}
      to={link}
      className={({ isActive }) =>
        `w-full relative flex aspect-square rounded-lg justify-center ${
          isActive ? "bg-accent text-white" : "bg-[#111a28] text-primary"
        } group cursor-pointer  items-center flex-col gap-2`
      }
    >
      {({ isActive }) => (
        <>
          <img
            src={ico}
            className={`${
              isActive ? "brightness-0 invert" : ""
            } sm:h-10 h-[30px] object-contain`}
            alt=""
          />

          <p className="text-inherit transition-all font-bold sm:text-lg text-xs">
            {name}
          </p>
        </>
      )}
    </NavLink>
  );
};

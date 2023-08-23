import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "usehooks-ts";

const Sidebar = () => {
  const gamesBarRef = useRef(null);
  const [gamesBar, setGamesBar] = useState(false);
  useOnClickOutside(gamesBarRef, () => setGamesBar(false));
  return (
    <>
      <div
        ref={gamesBarRef}
        className={`w-[170px] md:flex justify-start items-start hidden flex-col  h-[calc(100%_-_40px)] top-10 ${
          gamesBar ? "left-[100px] " : "-left-full "
        } bg-dark fixed border-r-2 pl-[10px] border-solid  overflow-y-auto z-10 border-primary  transition-all duration-500`}
      >
        <GamesLink
          setGamesBar={setGamesBar}
          ico="/sidebar/rock-paper.svg"
          name="RPS"
          link="/rps"
        />
        <GamesLink
          ico="/sidebar/dice.svg"
          setGamesBar={setGamesBar}
          name="Dice"
          link="/dice"
        />
        <GamesLink
          ico="/sidebar/coin-flip.svg"
          setGamesBar={setGamesBar}
          name="Coin Flip"
          link="/coin"
        />
        <GamesLink
          ico="/sidebar/roulette.svg"
          setGamesBar={setGamesBar}
          name="Roulette"
          link="/roulette"
        />
      </div>
      <div className="py-[30px] md:flex hidden sidebar overflow-y-auto overflow-x-hidden sticky top-0 h-screen w-full bg-dark  z-50 justify-between items-center flex-col gap-5">
        <Link to="/">
          <img
            src="/logo.png"
            className="w-[80px] min-h-[60px] object-contain"
            alt=""
          />
        </Link>
        <div className="  flex gap-5 justify-center items-center flex-col w-full">
          <SidebarItem
            ico="/sidebar/games.svg"
            activeIco="/sidebar/games-active.svg"
            name="Games"
            onClick={() => setGamesBar((prev) => !prev)}
          />
          <SidebarItem
            ico="/sidebar/earn.svg"
            activeIco="/sidebar/earn-active.svg"
            name="Earn"
          />
          <SidebarItem
            ico="/sidebar/stake.svg"
            activeIco="/sidebar/stake-active.svg"
            name="Stake"
            activeClasses="w-[112px] left-1/2 top-1"
          />
          <SidebarItem
            ico="/sidebar/referral.svg"
            activeIco="/sidebar/referral-active.svg"
            name="Referral"
            activeClasses="w-[112px] left-1/2 top-1"
          />
          <SidebarItem
            ico="/sidebar/analytics.svg"
            activeIco="/sidebar/analytics-active.svg"
            name="Analytics"
          />
          <SidebarItem
            ico="/sidebar/contest.svg"
            activeIco="/sidebar/contest-active.svg"
            name="Contest"
            activeClasses="w-[80px] left-1/2 top-0"
          />
        </div>
        <div className="opacity-0"></div>
      </div>
    </>
  );
};

export default Sidebar;

const SidebarItem = ({
  ico,
  activeIco,
  name,
  onClick = () => "",
  link,
  activeClasses = "w-[104px] left-[52%] top-0.5",
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full relative flex justify-start group cursor-pointer items-center flex-col gap-2"
    >
      <div className="bg-accent w-0.5 h-0 group-hover:h-full absolute right-0 top-[60%] -translate-y-1/2 transition-all duration-300 shadow-sidebarItem"></div>
      <div className="relative isolate w-full grid place-items-center">
        <img src={ico} className="w-[80px] object-contain" alt="" />
        <img
          src={activeIco}
          className={`${activeClasses} absolute z-10 group-hover:opacity-100 transition-all duration-300 opacity-0 -translate-x-1/2  `}
          alt=""
        />
      </div>
      <p className="text-text group-hover:text-white transition-all font-bold text-xs -mt-5">
        {name}
      </p>
    </div>
  );
};
const GamesLink = ({ ico, name, link, setGamesBar }) => {
  return (
    <Link
      onClick={() => setGamesBar(false)}
      to={link}
      className="w-full relative py-5 flex justify-start group cursor-pointer items-center  gap-2"
    >
      <div className="bg-accent w-0.5 h-0 group-hover:h-full absolute right-0 top-[60%] -translate-y-1/2 transition-all duration-300 shadow-sidebarItem"></div>

      <img
        src={ico}
        className="w-[30px] group-hover:brightness-200 object-contain"
        alt=""
      />

      <p className="text-text group-hover:text-white transition-all font-bold text-sm">
        {name}
      </p>
    </Link>
  );
};

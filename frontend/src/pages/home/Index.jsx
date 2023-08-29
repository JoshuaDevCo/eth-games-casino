import NftCard from "../../components/NftCard";

const Home = () => {
  return (
    <div className="contain justify-start items-start flex-col gap-6">
      {/* <div className="hidden sm:flex justify-between items-center w-full gap-5">
        <img src="/logo.png" className="object-contain w-[133px]" alt="" />
        <div className="flex justify-center items-center gap-5">
          <button className="flex justify-center items-center gap-[10px] text-white bg-[#036837] border border-solid border-[#036837] uppercase h-10 px-5 font-medium text-xs rounded-md">
            <img src="/trophy.svg" className="w-5 object-contain" alt="" />{" "}
            Contest
          </button>
          <button className="flex justify-center items-center gap-[10px] text-[#c37001] bg-[#ffd000] border border-solid border-[#ffd000] uppercase h-10 px-5 font-medium text-xs rounded-md">
            <img src="/stake.svg" className="w-5 object-contain" alt="" /> Stake
          </button>
          <button className="flex justify-center items-center gap-[10px] text-white bg-accent border border-solid border-accent uppercase h-10 px-5 font-medium text-xs rounded-md">
            <img src="/rocket.svg" className="w-5 object-contain" alt="" /> Earn
          </button>
        </div>
      </div> */}
      <div className="grid grid-cols-1 place-items-center lg:grid-cols-3 gap-4 lg:gap-8 w-full">
        <TopCard />
        <TopCard />
        <TopCard />
      </div>
      <div className="grid grid-cols-3 sm:flex justify-start items-start flex-wrap w-full gap-[10px] sm:gap-[30px]">
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
        <NftCard img="/sample.svg" name="Roulette" />
      </div>
    </div>
  );
};

export default Home;

const TopCard = ({}) => {
  return (
    <div className="flex justify-end  items-center py-[15px] pl-[115px] pr-[22px] w-full bg-card bg-no-repeat bg-center max-w-[365px] bg-cover overflow-hidden relative rounded-[10px] bg-dark isolate">
      <div className="bg-[#0b1423] left-[7.5px] w-[21px] h-[3px] top-1/2 -translate-y-1/2 absolute -z-10"></div>
      <div className="bg-[#0b1423] -left-[7.5px] w-[15px] h-[15px] rounded-full top-1/2 -translate-y-1/2 absolute -z-10"></div>
      <div className="absolute left-0 top-1/2 -translate-y-[40%] grid place-items-center z-10">
        <div className="bg-accent absolute right-[13px] top-5 -translate-x-1/2 -translate-y-1/2 blur-[21px] opacity-70 -z-10 w-[50px] h-[50px] rounded-full"></div>
        <img src="/wlp.svg" className="w-[106px] object-contain" alt="" />
      </div>
      <div className="flex justify-start w-full max-w-[228px] items-start flex-col gap-1.5">
        <h4 className="mb-1 text-white text-base font-bold uppercase">WLP</h4>
        <p className="text-primary font-bold text-[15px] w-full flex justify-between items-center gap-1">
          Size{" "}
          <span className="text-white">
            102,222 <span className="text-primary">$</span>
          </span>
        </p>
        <p className="text-primary font-bold text-[15px] w-full flex justify-between items-center gap-1">
          APR{" "}
          <span className="text-white">
            102,222 <span className="text-primary">%</span>
          </span>
        </p>
        <p className="text-primary font-bold text-[15px] w-full flex justify-between items-center gap-1">
          Bribe{" "}
          <span className="text-white">
            102,222 <span className="text-primary">x</span>
          </span>
        </p>
      </div>
    </div>
  );
};

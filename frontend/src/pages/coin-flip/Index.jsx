const CoinFlip = () => {
  return (
    <div className="contain justify-start items-center flex-col gap-5">
      <div className="w-full flex-col gap-10 px-3 sm:px-10 flex justify-center items-center pt-10 pb-[40px] rounded-2xl sm:rounded-[45px] relative min-h-[500px] isolate  bg-dark overflow-hidden">
        <div className="w-full max-w-[850px] aspect-square -z-10 absolute top-[25%] pointer-events-none -translate-y-1/2 left-1/2 -translate-x-1/2">
          <img
            src="/coin-bg.svg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="flex relative -top-4 justify-start items-center flex-col gap-6">
          <img
            src="/coin.png"
            className="w-[185px] object-contain aspect-square"
            alt=""
          />
          <div className="flex w-full justify-center items-center flex-col gap-3">
            <div className="flex justify-center items-center w-full max-w-[215px] h-10 gap-2 border-2 border-solid border-primary brightness-75 rounded overflow-hidden p-[3px]">
              <button className="flex justify-center items-center w-full gap-2 text-sm font-bold bg-[#3f4d66] text-white h-full ">
                <img src="/tails.svg" className="w-5 object-contain" alt="" />
                Tails
              </button>
              <button className="flex justify-center items-center w-full gap-2 text-sm font-bold text-white h-full ">
                <img
                  src="/heads.svg"
                  className="w-5 grayscale object-contain"
                  alt=""
                />
                Heads
              </button>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="flex justify-center items-center gap-2">
                <p className="text-primary text-sm font-bold">-10000</p>
                <img src="/eth.svg" className="w-5 object-contain" alt="" />
              </div>{" "}
              <div className="flex justify-center items-center gap-2">
                <p className="text-primary text-sm font-bold">-10000</p>
                <img src="/eth.svg" className="w-5 object-contain" alt="" />
              </div>
            </div>
            <button className="flex max-w-[215px] mt-2 justify-center items-center gap-[10px] text-white bg-accent border border-solid border-accent uppercase h-10 px-5 w-full font-medium text-xs rounded-md">
              Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;

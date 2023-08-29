const Footer = () => {
  return (
    <footer className="w-full justify-start items-center flex-col sm:flex hidden">
      <div className="contain border-t-2 border-solid border-dark mt-[75px] py-[60px] justify-between items-start">
        <div className="flex justify-start items-start flex-col gap-5">
          <img src="/logo.png" className="w-[133px]" alt="" />
          <div className="flex justify-start items-center gap-3">
            <p className="text-primary text-base font-bold">Built on:</p>
            <img
              src="/winr-logo.svg"
              className="w-[60px] object-contain"
              alt=""
            />
          </div>
        </div>
        <div className="flex justify-start items-start flex-col gap-[10px]">
          <h4 className="text-white font-bold text-base mb-5">Support</h4>
          <a href="#" className="text-primary text-[15px] font-bold ">
            Docs
          </a>
          <a href="#" className="text-primary text-[15px] font-bold ">
            Guides
          </a>
        </div>
        <div className="flex justify-start items-start flex-col gap-[10px]">
          <h4 className="text-white font-bold text-base mb-5">Navigate</h4>
          <a href="#" className="text-primary text-[15px] font-bold ">
            Statistics
          </a>
          <a href="#" className="text-primary text-[15px] font-bold ">
            Dune
          </a>
        </div>
        <div className="flex justify-start items-start flex-col gap-[10px]">
          <h4 className="text-white font-bold text-base mb-5">Social</h4>
          <div className="flex justify-start items-center gap-4">
            <a href="#" target="blank">
              <img src="/twitter.svg" className="w-6 object-contain" alt="" />
            </a>
            <a href="#" target="blank">
              <img src="/telegram.svg" className="w-6 object-contain" alt="" />
            </a>
            <a href="#" target="blank">
              <img src="/discord.svg" className="w-6 object-contain" alt="" />
            </a>
            <a href="#" target="blank">
              <img src="/mirror.svg" className="w-6 object-contain" alt="" />
            </a>
            <a href="#" target="blank">
              <img src="/github.svg" className="w-6 object-contain" alt="" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

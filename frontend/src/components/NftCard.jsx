const NftCard = ({ img, name }) => {
  return (
    <div className="bg-dark rounded-[10px] overflow-hidden w-full max-w-[208px] flex justify-start items-start flex-col">
      <div className="w-full max-h-[105px] sm:max-h-none sm:h-[140px]">
        <img src={img} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="py-[6px] sm:px-[25px] px-[10px] sm:py-5 w-full flex justify-start items-center text-white font-medium text-xs sm:text-xl">
        {name}
      </div>
    </div>
  );
};

export default NftCard;

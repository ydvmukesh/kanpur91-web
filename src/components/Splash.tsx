import { IMG, ImgIcon } from "@/lib/img";

export function Splash() {
  return (
    <div
      className="absolute inset-0 z-[100] flex h-full flex-col"
      style={{
        background: "linear-gradient(180deg, #ff8e7e 0%, #ffb8a4 48%, #ffd8c8 100%)",
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <ImgIcon src={IMG.ball8} alt="" className="h-[4.5rem] w-[4.5rem] object-contain" />
        <p className="mt-5 text-center text-sm font-medium text-white">Withdraw fast, safe and stable</p>
      </div>
      <div className="flex justify-center pb-16">
        <ImgIcon src={IMG.redBrand} alt="91 Club" className="h-14 w-auto object-contain" />
      </div>
    </div>
  );
}

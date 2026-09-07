import { IMG, ImgIcon } from "@/lib/img";

export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <ImgIcon
      src={IMG.brand}
      alt="91 Club"
      className={`w-auto object-contain invert ${className}`}
    />
  );
}

export function HomeLogo({ className = "h-11" }: { className?: string }) {
  return (
    <ImgIcon src={IMG.redBrand} alt="91 Club" className={`w-auto object-contain ${className}`} />
  );
}

export function LogoWhite({ className = "h-10" }: { className?: string }) {
  return (
    <ImgIcon src={IMG.brand} alt="91 Club" className={`w-auto object-contain ${className}`} />
  );
}

export function LoginBrand() {
  return <ImgIcon src={IMG.brand} alt="91 Club" className="h-11 w-auto object-contain" />;
}

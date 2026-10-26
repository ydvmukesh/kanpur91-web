import { cn } from "@/lib/cn";

export const htmlListClass =
  "[&_li]:relative [&_li]:text-13 [&_li]:leading-[1.55] [&_ul]:mb-3 [&_ul]:pl-4 [&_li]:text-[#6E7C91] [&_li]:before:absolute [&_li]:before:top-[7px] [&_li]:before:-left-4 [&_li]:before:h-[6px] [&_li]:before:w-[6px] [&_li]:before:rotate-45 [&_li]:before:bg-[#F95959] [&_li]:before:content-[''] [&_p]:relative [&_p]:mt-1.5 [&_p]:pl-4 [&_p]:text-13 [&_p]:leading-[1.55] [&_p]:text-[#6E7C91] [&_p]:before:absolute [&_p]:before:top-[7px] [&_p]:before:left-0 [&_p]:before:h-[6px] [&_p]:before:w-[6px] [&_p]:before:rotate-45 [&_p]:before:bg-[#F95959] [&_p]:before:content-[''] [&_p:first-child]:mt-0 [&_p:empty]:hidden [&_p:empty]:m-0 [&_p:empty]:p-0 [&_p:empty]:before:content-none [&_ul]:m-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul~p]:mt-0 [&_ul~p]:pl-0 [&_ul~p]:before:content-none [&_ul+p]:mt-3.5 [&_ul+p:empty]:mt-0 [&:not(:has(ul))_p:nth-last-child(-n+2)]:pl-0 [&:not(:has(ul))_p:nth-last-child(-n+2)]:before:content-none [&:not(:has(ul))_p:nth-last-child(2)]:mt-3.5 [&:not(:has(ul))_p:empty]:m-0";

export function HtmlContent({ html, className }: { html: string; className?: string }) {
  return <div className={cn(htmlListClass, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

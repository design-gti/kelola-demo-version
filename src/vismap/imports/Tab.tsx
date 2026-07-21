function Button() {
  return (
    <div className="bg-[#d6e6ff] box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0" data-name="button">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">All</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#dee2e6] box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0" data-name="button">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[14px] text-nowrap whitespace-pre">Need Develop</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#dee2e6] box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0" data-name="button">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[14px] text-nowrap whitespace-pre">Need Successors Default</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#dee2e6] box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0" data-name="button">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[14px] text-nowrap whitespace-pre">Flight Risk</p>
    </div>
  );
}

export default function Tab() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative size-full" data-name="Tab">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

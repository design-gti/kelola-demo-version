interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 transition-colors ${
        isActive ? 'bg-[#016699]' : 'bg-transparent hover:bg-[#016699]/10'
      }`}
      data-name="button"
    >
      <p className={`font-['Open_Sans',_sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${
        isActive ? 'text-white' : 'text-[#016699]'
      }`}>
        {label}
      </p>
    </button>
  );
}

interface TabFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabFilter({ activeTab, onTabChange }: TabFilterProps) {
  const tabs = [
    { id: 'all', label: 'Default' },
    { id: 'need-successors-copy', label: 'Succession Risk' },
    { id: 'need-develop', label: 'Need Develop' },
    // { id: 'need-successors', label: 'Need Successors Default' }, // Hidden - uncomment to show
  ];

  return (
    <div className="content-stretch flex gap-[12px] items-center relative" data-name="Tab">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}

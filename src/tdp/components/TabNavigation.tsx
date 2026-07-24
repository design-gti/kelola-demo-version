// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { NavLink } from 'react-router';
import { Table2, Users } from 'lucide-react';

export default function TabNavigation() {
  return (
    <div className="flex gap-0 items-center border-b border-gray-200">
      <NavLink
        to="/comparison"
        className={({ isActive }) =>
          isActive
            ? 'flex items-center gap-[11.989px] px-[24px] h-[48px] border-b-2 border-[#016699] -mb-[1px]'
            : 'flex items-center gap-[11.989px] px-[24px] h-[48px] border-b-2 border-transparent hover:border-gray-300 -mb-[1px] transition-colors'
        }
      >
        {({ isActive }) => (
          <>
            <Users className={`w-5 h-5 ${isActive ? 'text-[#016699]' : 'text-[#6b7280]'}`} />
            <span className={`text-[16px] font-medium leading-[24px] ${isActive ? 'text-[#016699]' : 'text-[#6b7280]'}`}>Compare</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? 'flex items-center gap-[11.989px] px-[24px] h-[48px] border-b-2 border-[#016699] -mb-[1px]'
            : 'flex items-center gap-[11.989px] px-[24px] h-[48px] border-b-2 border-transparent hover:border-gray-300 -mb-[1px] transition-colors'
        }
      >
        {({ isActive }) => (
          <>
            <Table2 className={`w-5 h-5 ${isActive ? 'text-[#016699]' : 'text-[#6b7280]'}`} />
            <span className={`text-[16px] font-medium leading-[24px] ${isActive ? 'text-[#016699]' : 'text-[#6b7280]'}`}>Table</span>
          </>
        )}
      </NavLink>
    </div>
  );
}

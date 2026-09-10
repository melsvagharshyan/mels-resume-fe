'use client';

import Button from '@/components/ui/Button';
import { tabTitles, tabs } from '../utils/constants';
import type { ApplyTab } from '../utils/types';

type RoleTabsProps = {
  selectedTab: ApplyTab;
  onSelect: (tab: ApplyTab) => void;
};

export default function RoleTabs({ selectedTab, onSelect }: RoleTabsProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-[var(--muted)]">Role</p>
      <div className="grid grid-cols-3 gap-1.5">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab;

          return (
            <Button
              key={tab}
              variant={isActive ? 'primary' : 'secondary'}
              onClick={() => onSelect(tab)}
              className="rounded-xl px-1.5 py-2 text-xs"
            >
              {tabTitles[tab].replace('Sr. ', '')}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

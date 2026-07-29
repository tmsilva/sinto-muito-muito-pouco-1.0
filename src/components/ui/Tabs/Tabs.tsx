import React from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChangeTab: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChangeTab,
  className = ''
}) => {
  return (
    <div className={`tabs-wrapper ${className}`}>
      <div role="tablist" className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
            className={`tabs-trigger ${activeTab === tab.id ? 'tabs-trigger-active' : ''}`}
            onClick={() => onChangeTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.map((tab) => {
          if (activeTab !== tab.id) return null;
          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className="animate-fade-in"
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Tabs;

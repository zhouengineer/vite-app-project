import React from 'react';
import './index.less';

interface IProps<T> {
  tabs: T;
  activeTab: ValueOf<T>;
  onTabChange: (item: ValueOf<T>) => void;
}
export default class CZTabs<T> extends React.PureComponent<IProps<T>> {
  render() {
    const { tabs, activeTab, onTabChange } = this.props;
    return (
      <div className="cz-tabs">
        {Object.keys(tabs).map((key) => {
          return (
            <div onClick={() => onTabChange(tabs[key as KeyOf<typeof tabs>])} className="cz-tab-item" key={key}>
              <div className={`cz-tab-pane ${tabs[key as KeyOf<typeof tabs>] === activeTab ? 'cz-tab-active' : ''}`}>
                {key}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

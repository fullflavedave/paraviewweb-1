import React from 'react';
import ElementRender from '.';
import style from 'PVWStyle/ReactWidgets/MultiBlockSelectorWidgets.mcss';

const collapseIcons = [
  style.collapsedIcon,
  style.openedIcon,
];

const selectedIcons = [
  style.unselectedIcon,
  style.selectedChildrenIcon,
  style.selectedIcon,
];

export default function renderElement(props) {
  const { name, children, flatindex } = props.item;
  const { opened, selected, onToggleOpen, onToggleSelection, depth } = props;
  return (
    <div>
      <section className={style.line}>
        <div className={style.left}>
          <i
            className={collapseIcons[opened ? 1 : 0]}
            onClick={onToggleOpen}
            data-flatindex={flatindex}
          />
          { name }
        </div>
        <div className={style.right}>
          <i
            className={selectedIcons[selected]}
            onClick={onToggleSelection}
            data-flatindex={flatindex}
          />
        </div>
      </section>
      {}
    </div>);
}

import React from 'react';

type Props = { onSwitch?: (front: boolean) => void };

const PageSwitcher: React.FC<Props> = ({ onSwitch }) => {
  const [front, setFront] = React.useState(true);
  return (
    <button onClick={() => { setFront(!front); onSwitch?.(!front); }}>
      {front ? 'Front' : 'Back'}
    </button>
  );
};

export default PageSwitcher;

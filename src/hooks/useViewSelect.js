import { useEffect, useState } from 'react';

const useViewSelect = (selectedItems) => {
  const [activeView, setActiveView] = useState('Places');
  useEffect(() => {
    setActiveView('Places');
  }, [selectedItems.site]);
  useEffect(() => {
    setActiveView('Society');
  }, [selectedItems.entity]);
  useEffect(() => {
    setActiveView('People');
  }, [selectedItems.historicalFigure]);
  return [activeView, setActiveView];
};
export default useViewSelect;

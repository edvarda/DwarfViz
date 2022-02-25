import TreeMap from './TreeMap.js';
const Plot = ({ data }) => {
  return (
    <TreeMap
      writtenContents={data.writtenContents}
      poeticForms={data.poeticForms}
      musicalForms={data.musicalForms}
      danceForms={data.danceForms}
      width={600}
      height={400}
    />
  );
};

export default Plot;

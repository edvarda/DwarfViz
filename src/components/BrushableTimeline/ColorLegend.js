const ColorLegend = ({innerHeight, yOffset, xRectOffset}) => {
     return <g>
    <rect
      x={xRectOffset}
      y={innerHeight + yOffset}
      width={50}
      height={20}
      fill={'blue'}
    ></rect>
    <text y={innerHeight + yOffset} dy='.71em' style={{ textAnchor: 'middle' }}>
        More
    </text>
    <rect
      x={xRectOffset}
      y={innerHeight + yOffset + 20}
      width={50}
      height={20}
      fill={'red'}
    ></rect>
    <text y={innerHeight + yOffset + 20}  dy='.71em' style={{ textAnchor: 'middle'}}>
        Less
    </text>
    </g>
};
export default ColorLegend
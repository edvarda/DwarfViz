export const Marks = ({ binnedData, xScale, yScale, tooltipFormat, innerHeight, colorScale }) =>
  binnedData.map((d) => (
    <rect
      className='mark'
      x={xScale(d.x0)}
      y={yScale(d.y)}
      width={xScale(d.x1) - xScale(d.x0)}
      height={innerHeight - yScale(d.y)}
      fill={colorScale(d.y)}
      key={d.x0}
    >
      <title>{tooltipFormat(d.y)}</title>
    </rect>
  ));

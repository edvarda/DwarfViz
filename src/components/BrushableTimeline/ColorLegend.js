import styles from './Timeline.scss'
const ColorLegend = ({innerHeight, yOffset, xRectOffset, timeLineColor1, timeLineColor2}) => {
    const colorRectHeight = 20;
     return <g>
    <rect
      x={xRectOffset}
      y={innerHeight + yOffset}
      width={50}
      height={colorRectHeight}
      fill={timeLineColor2}
    ></rect>
    <text  className={styles.textLabel} y={innerHeight + yOffset} dy='.71em' style={{ textAnchor: 'middle' }}>
        More
    </text>
    <rect
      x={xRectOffset}
      y={innerHeight + yOffset + colorRectHeight}
      width={50}
      height={colorRectHeight}
      fill={timeLineColor1}
    ></rect>
    <text  className={styles.textLabel} y={ innerHeight + yOffset + 20}  dy='.71em' style={{ textAnchor: 'middle'}}>
        Less
    </text>
    </g>
};
export default ColorLegend
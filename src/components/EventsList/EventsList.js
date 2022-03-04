import {
  brushX,
  select,
  scaleLinear,
  max,
  sum,
  timeFormat,
  extent,
  bin,
  interpolateRgb,
  nice,
} from 'd3';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useWorldData } from '../../hooks/useWorldData';
import { useTable } from 'react-table'

const d3 = { max };

const margin = {
  top: 10,
  right: 0,
  bottom: 0,
  left: 65,
};

const EventsList = ({ width, height, yearRange }) => {
  const {
    state: { worldsInfo, historicalEvents },
  } = useWorldData();

  const data = yearRange
    ? historicalEvents
        .filter((d) => {
          const date = d['year'];
          return date > yearRange[0] && date < yearRange[1];
        })
        .slice(0, 100)
    : historicalEvents.slice(0,100);
  
    const columns = useMemo(
      () => [
        {
          Header: 'Event ID',
          accessor: 'id', // accessor is the "key" in the data
        },
        {
          Header: 'Event Type',
          accessor: 'type',
        },
      ],
      []
    )
  const tableInstance = useTable({columns, data})
  const {

    getTableProps,
 
    getTableBodyProps,
 
    headerGroups,
 
    rows,
 
    prepareRow,
 
  } = tableInstance


   return (
   // apply the table props
   <table {...getTableProps()}>
     <thead>
       {// Loop over the header rows
       headerGroups.map(headerGroup => (
         // Apply the header row props
         <tr {...headerGroup.getHeaderGroupProps()}>
           {// Loop over the headers in each row
           headerGroup.headers.map(column => (
             // Apply the header cell props
             <th {...column.getHeaderProps()}>
               {// Render the header
               column.render('Header')}
             </th>
           ))}
         </tr>
       ))}
     </thead>
     {/* Apply the table body props */}
     <tbody {...getTableBodyProps()}>
       {// Loop over the table rows
       rows.map(row => {
         // Prepare the row for display
         prepareRow(row)
         return (
           // Apply the row props
           <tr {...row.getRowProps()}>
             {// Loop over the rows cells
             row.cells.map(cell => {
               // Apply the cell props
               return (
                 <td {...cell.getCellProps()}>
                   {// Render the cell contents
                   cell.render('Cell')}
                 </td>
               )
             })}
           </tr>
         )
       })}
     </tbody>
   </table>
 )
};

export default EventsList;

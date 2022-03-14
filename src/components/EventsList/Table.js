import React, { useState, useEffect } from 'react';

import useTable from './UseTable.js';
import styles from './Table.module.scss';
import TableFooter from './TableFooter/index.js';
import ReactTooltip from 'react-tooltip';
import Narrate from '../../narrativization';

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>ID</th>
            <th className={styles.tableHeader}>Year</th>
            <th className={styles.tableHeader}>Type</th>
            <th className={styles.tableHeader}>What happened?</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el) => (
            <tr className={styles.tableRowItems} key={el.id}>
              <td className={styles.tableCell}>{el.id}</td>
              <td className={styles.tableCell}>{el.year}</td>
              <td className={styles.tableCell}>{el.type}</td>
              <td className={styles.tableCell}>
                <Narrate historicalEvent={el} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;

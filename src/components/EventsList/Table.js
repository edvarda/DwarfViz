import React, { useState } from 'react';

import useTable from './UseTable.js';
import styles from './Table.module.scss';
import { Row, Col } from 'react-bootstrap';
import TableFooter from './TableFooter/index.js';
import { useDwarfViz } from '../../hooks/useDwarfViz.js';
import narrate from '../../lib/narrativization.js';

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  const dwarfViz = useDwarfViz();
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
              <td className={styles.tableCell}>{narrate(el, dwarfViz)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;

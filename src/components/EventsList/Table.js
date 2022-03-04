import React, { useState } from "react";

import useTable from "./UseTable.js";
import styles from "./Table.module.css";
import TableFooter from './TableFooter/index.js';

const Table = ({ data, rowsPerPage }) => {
    const [page, setPage] = useState(1);
    const { slice, range } = useTable(data, page, rowsPerPage);
    return (
      <>
        <table className={styles.table}>
          <thead className={styles.tableRowHeader}>
            <tr>
              <th className={styles.tableHeader}>ID</th>
              <th className={styles.tableHeader}>Year</th>
              <th className={styles.tableHeader}>Type</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((el) => (
              <tr className={styles.tableRowItems} key={el.id}>
                <td className={styles.tableCell}>{el.id}</td>
                <td className={styles.tableCell}>{el.year}</td>
                <td className={styles.tableCell}>{el.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
      </>
    );
  };
  
  export default Table;
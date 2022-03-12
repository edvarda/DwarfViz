const ItemDetails = ({ itemDetailsDefinition, item }) => {
  const { header, rows } = itemDetailsDefinition;
  const nonEmptyRows = rows.filter((row) => !!row.accessor(item));
  return (
    <div className='detailsView'>
      <h2>{header}</h2>
      <ul>
        {nonEmptyRows.map((row) => {
          return (
            <li>
              <div className='propName'>{row.displayName}:</div>
              <div className='value'>{row.accessor(item)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemDetails;

const ItemDetails = ({ itemDetailsDefinition, item }) => {
  const { header, rows } = itemDetailsDefinition;
  const nonEmptyRows = rows.filter((row) => !!row.accessor(item));

  return nonEmptyRows.length > 0 ? (
    <div className='view-element'>
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
    </div>
  ) : null;
};

export default ItemDetails;

const ItemLink = ({ children, type, handleClick, id }) => (
  <span className={`itemLink ${type}`} onClick={() => handleClick(id)}>
    {children}
  </span>
);

export default ItemLink;

const ItemLink = ({ children, view, id }) => (
  <span className={`itemLink ${view.itemType}-link`} onClick={() => view.selectItem(id)}>
    {children}
  </span>
);

export default ItemLink;

import { renderToString } from 'react-dom/server';

const Tooltip = ({ view, children }) => (
  <div>
    <p>
      <strong>Type:</strong> {view.itemType}
    </p>
    <p>
      <strong>Name:</strong>
      {children}
    </p>
  </div>
);

const ItemLink = ({ children, view, id }) => (
  <span
    className={`itemLink ${view.itemType}-link`}
    onClick={() => view.selectItem(id)}
    data-tip={renderToString(<Tooltip view={view} children={children} />)}
  >
    {children}
  </span>
);

export default ItemLink;

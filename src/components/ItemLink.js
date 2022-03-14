import _ from 'lodash';
import useTooltip from '../hooks/useTooltip';
import { useDwarfViz } from '../hooks/useDwarfViz';

const ItemLink = ({ dataObject, tooltipFunction, className, selectItem, children }) => (
  <span
    className={`itemLink ${className}`}
    onClick={() => selectItem(dataObject.id)}
    data-tip={tooltipFunction(dataObject)}
  >
    {children}
  </span>
);

const EntityLink = ({ id }) => {
  const { selectEntity, find } = useDwarfViz();
  const { entityTooltip } = useTooltip();
  const entity = find.entity(id);
  return (
    <ItemLink
      dataObject={entity}
      tooltipFunction={entityTooltip}
      className={'entity-link'}
      selectItem={selectEntity}
    >
      {_.startCase(entity.name)}
    </ItemLink>
  );
};

const SiteLink = ({ id }) => {
  const { selectSite, find } = useDwarfViz();
  const { siteTooltip } = useTooltip();
  const site = find.site(id);
  return (
    <ItemLink
      dataObject={site}
      tooltipFunction={siteTooltip}
      className={'site-link'}
      selectItem={selectSite}
    >
      {_.startCase(site.name)}
    </ItemLink>
  );
};

const HfLink = ({ id }) => {
  const { selectHF, find } = useDwarfViz();
  const { hfTooltip } = useTooltip();
  const hf = find.hf(id);
  return (
    <ItemLink
      dataObject={hf}
      tooltipFunction={hfTooltip}
      className={'hf-link'}
      selectItem={selectHF}
    >
      {_.startCase(hf.name)}
    </ItemLink>
  );
};

export { HfLink, SiteLink, EntityLink };

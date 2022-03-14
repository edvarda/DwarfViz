import _ from 'lodash';
import useTooltip from '../hooks/useTooltip';
import { useDwarfViz } from '../hooks/useDwarfViz';

const ItemLink = ({ dataObject, tooltipFunction, className, selectItem }) =>
  dataObject ? (
    <span
      className={`itemLink ${className}`}
      onClick={() => selectItem(dataObject.id)}
      data-tip={tooltipFunction(dataObject)}
    >
      {_.startCase(dataObject.name)}
    </span>
  ) : (
    <span className={`itemLink ${className}`}>Unknown</span>
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
    />
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
    />
  );
};

const HfLink = ({ id }) => {
  const { selectHF, find } = useDwarfViz();
  const { hfTooltip } = useTooltip();
  let hf = find.hf(id);
  if (hf === undefined){
    hf = { name: "Unknown"}
  }
  return (
    <ItemLink
      dataObject={hf}
      tooltipFunction={hfTooltip}
      className={'hf-link'}
      selectItem={selectHF}
    />
  );
};

export { HfLink, SiteLink, EntityLink };

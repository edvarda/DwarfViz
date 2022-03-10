import { useContext } from 'react';
import { renderToString } from 'react-dom/server';
import _ from 'lodash';

import { WorldDataContext } from './useDwarfViz';

const regionTilesToSquareKm = (regiontiles) => regiontiles * 3.4;

const Tooltip = ({ definition, data }) => {
  const { header, rows } = definition;
  const tooltipRows = rows.filter((row) => !!row.accessor(data));
  return (
    <table>
      <th className='header'>{header}</th>
      {tooltipRows.map((row) => {
        return (
          <tr>
            <td className='propName'>{row.displayName}:</td>
            <td className='value'>{row.accessor(data)}</td>
          </tr>
        );
      })}
    </table>
  );
};

const useTooltip = () => {
  const { state } = useContext(WorldDataContext);
  const { data } = state;

  const getTooltipGenerator = (definition) => (data) =>
    renderToString(<Tooltip definition={definition} data={data} />);

  const regionTooltipDefinition = {
    header: 'Region',
    rows: [
      { displayName: 'Name', accessor: (region) => _.startCase(region.name) },
      { displayName: 'Type', accessor: (region) => _.startCase(region.type) },
      {
        displayName: 'Size',
        accessor: (region) => `~${regionTilesToSquareKm(region.coords.length).toFixed(2)} km²`,
      },
      { displayName: 'Evilness', accessor: (region) => _.capitalize(region.evilness) },
      { displayName: 'Hovered biome', accessor: (region) => _.capitalize(region.biomeString) },
    ],
  };
  const siteTooltipDefinition = {
    header: 'Site',
    rows: [
      { displayName: 'Name', accessor: (site) => _.startCase(site.name) },
      { displayName: 'Type', accessor: (site) => _.startCase(site.type) },
      { displayName: 'Region', accessor: (site) => `[${site.coord.x},${site.coord.y}]` },
      { displayName: 'Civilization', accessor: (site) => site.civ_id },
      { displayName: 'Current owner', accessor: (site) => site.cur_owner_id },
    ],
  };
  const hfTooltipDefinition = {
    header: 'Historical Figure',
    rows: [
      { displayName: 'Name', accessor: (hf) => _.startCase(hf.name) },
      // TODO add diety status
      { displayName: 'Race', accessor: (hf) => _.startCase(hf.race) },
      {
        displayName: 'Gender',
        accessor: (hf) => (hf.caste && hf.caste !== 'deafult' ? _.startCase(hf.caste) : null),
      },
      {
        displayName: 'Born',
        accessor: (hf) => (hf.birth_year > 0 ? `year ${hf.birth_year}` : null),
      },
      {
        displayName: 'Died',
        accessor: (hf) => (hf.death_year > 0 ? `year ${hf.death_year}` : null),
      },
      { displayName: 'Profession', accessor: (hf) => _.startCase(hf.associated_type) },
      { displayName: 'Life goal', accessor: (hf) => _.capitalize(hf.goal) },
    ],
  };
  const entityTooltipDefinition = {
    header: 'Entity',
    rows: [
      { displayName: 'Name', accessor: (entity) => _.startCase(entity.name) },
      { displayName: 'Type', accessor: (entity) => _.startCase(entity.type) },
      { displayName: 'Profession', accessor: (entity) => _.startCase(entity.profession) },
      {
        displayName: 'Race',
        accessor: (entity) => (entity.race ? _.startCase(entity.race) : null),
      },
      {
        displayName: 'Governed by',
        accessor: (entity) => {
          const parentEntityLink = entity.entity_link.find((link) => link.type === 'PARENT');
          const parentEntity = parentEntityLink
            ? data.entities.find((x) => x.id === parentEntityLink.target)
            : null;
          if (parentEntity) return _.startCase(parentEntity.name);
        },
      },
      {
        displayName: 'Governs',
        accessor: (entity) => {
          const numberOfChildEntities = entity.entity_link.filter((link) => link.type === 'CHILD');
          if (numberOfChildEntities.length > 0) return `${numberOfChildEntities.length} entities`;
        },
      },
    ],
  };

  const hfTooltip = (data) => {
    return getTooltipGenerator(hfTooltipDefinition)(data);
  };
  const siteTooltip = (data) => getTooltipGenerator(siteTooltipDefinition)(data);
  const entityTooltip = (data) => getTooltipGenerator(entityTooltipDefinition)(data);
  const regionTooltip = (data) => getTooltipGenerator(regionTooltipDefinition)(data);

  return { hfTooltip, siteTooltip, entityTooltip, regionTooltip };
};

export default useTooltip;

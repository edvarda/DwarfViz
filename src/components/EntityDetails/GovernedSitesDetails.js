import { useDwarfViz } from '../../hooks/useDwarfViz';
import { SiteLink } from '../ItemLink.js';
import ItemDetails from '../ItemDetails.js';

const GovernedSitesDetails = ({entity}) => {
    const { data } = useDwarfViz();
    const governedSites = data.sites.filter((s) => s.civ_id == entity.id);
    return (
        <div className='detailsView'>
            <h3>Governed Sites</h3>
            <ul>
                {governedSites.map((site) => <li className='siteList'><SiteLink id={site.id} /></li>)}
            </ul>
        </div>
    );
    const entityGovernedSitesDefinition = {
        header: 'Governed Sites',
        rows: governedSites.map((site) => {
            console.log(site)
            return {
                displayName: '',
                accessor: () => (<SiteLink id={site.id} />),
            };
        }),
    };
};

export { GovernedSitesDetails };
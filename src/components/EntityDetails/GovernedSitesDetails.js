import { useDwarfViz } from '../../hooks/useDwarfViz';
import { SiteLink } from '../ItemLink.js';
import ItemDetails from '../ItemDetails.js';

const GovernedSitesDetails = ({entity}) => {
    const { data } = useDwarfViz();
    const governedSites = data.sites.filter((s) => s.civ_id == entity.id);
    if (governedSites.length == 0) {
        return null;
    }
    return (
        <div className='detailsView'>
            <h3>Governed Sites</h3>
            <ul>
                {governedSites.map((site) => <li className='govSiteList'><SiteLink id={site.id} /></li>)}
            </ul>
        </div>
    );
};

export { GovernedSitesDetails };
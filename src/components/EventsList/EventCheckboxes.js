import { useState } from "react";
import Checkbox from "./Checkbox";
import styles from './Table.module.scss';

const EventCheckboxes = ( {setTypes, types, narrativizedTypes} ) => {
    
    
    const handleOnChange = (e) => {
        if (e.target.checked) {
          setTypes([...types, e.target.value]);
        } else {
          setTypes(types.filter(id => id !== e.target.value));
        }
    };
    
    return (
    <div className="eventsCheckboxes">
        <h3>Select Events to filter on</h3>
        {narrativizedTypes.map((value, index) => {
            return (
                <div className={styles.eventFilterCheckboxes} key={index}>
                    <Checkbox
                        id={`custom-checkbox-${index}`}
                        label={value}
                        onCheckboxChange={handleOnChange}
                    />
                </div>
            );
        })}
    </div>
    );
}
export default EventCheckboxes;
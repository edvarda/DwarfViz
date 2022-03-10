import { useState } from "react";
import Checkbox from "./Checkbox";

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
                <div className="eventFilterCheckboxes" key={index}>
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
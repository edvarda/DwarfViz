import { useState, useRef, useMemo, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useDwarfViz } from '../../hooks/useDwarfViz';
import EventCheckboxes from './EventCheckboxes';

import Table from './Table.js';
import styles from './Table.module.scss';

const EventsList = ({ yearRange, historicalEvents }) => {
  const maxSlice = 576;
  const {
    data: { worldsInfo },
  } = useDwarfViz();

  const availableTypes = [...new Set(historicalEvents.map((item) => item.type))];
  // hardcode the implemented narrativized types, couldn't find an easy way to do it in another way
  const narrativizedTypes = [
    'change_hf_job',
    'change_hf_state',
    'hf_died',
    'hf_relationship',
    'creature_devoured',
    'add_hf_entity_link',
    'hf_simple_battle_event',
  ];

  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);

  useEffect(() => {
    if (types.length === 0) {
      setFilteredTypes(historicalEvents);
    } else {
      setFilteredTypes(
        historicalEvents.filter((event) =>
          types.some((type) => [event.type].flat().includes(type)),
        ),
      );
    }
  }, [types, historicalEvents]);

  const filteredEvents = yearRange
    ? filteredTypes
        .filter((d) => {
          const date = d['year'];
          return date > yearRange[0] && date < yearRange[1];
        })
        .slice(0, maxSlice)
    : filteredTypes.slice(0, maxSlice);

  return (
    <Container fluid>
      <Row>
        <Col className={'col-sm-10'}>
          <Table data={filteredEvents} rowsPerPage={12} />
        </Col>
        <Col className={'col-sm-2'}>
          <EventCheckboxes
            setTypes={setTypes}
            types={types}
            narrativizedTypes={narrativizedTypes}
          ></EventCheckboxes>
        </Col>
      </Row>
    </Container>
  );
};

export default EventsList;

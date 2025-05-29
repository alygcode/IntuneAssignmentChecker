import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useTableState, useTableDispatch, AssignmentData } from '../contexts/TableDataContext';
import useDebounce from '../hooks/useDebounce'; 

// No longer need FilterInputsState, manage individual filter states
// interface FilterInputsState { ... }

const AssignmentsTable: React.FC = () => {
  const { displayData, sortConfig, filterCriteria, searchTerm } = useTableState(); // Added filterCriteria, searchTerm
  const dispatch = useTableDispatch();

  const headers: { key: keyof AssignmentData; title: string; filterable: boolean }[] = [
    { key: 'id', title: 'ID', filterable: true },
    { key: 'name', title: 'Name', filterable: true },
    { key: 'type', title: 'Type', filterable: true },
    { key: 'assignedTo', title: 'Assigned To', filterable: true },
    { key: 'status', title: 'Status', filterable: true },
    { key: 'platform', title: 'Platform', filterable: true },
  ];

  // Individual local state and debounce for each filterable column
  const [idFilter, setIdFilter] = useState('');
  const debouncedIdFilter = useDebounce(idFilter, 300);
  const initialIdFilterRender = useRef(true);
  useEffect(() => {
    if (initialIdFilterRender.current) {
      initialIdFilterRender.current = false;
      return;
    }
    const contextValue = filterCriteria?.['id'] || '';
    const newFilterValue = debouncedIdFilter || '';
    if (contextValue !== newFilterValue) {
      dispatch({ type: 'SET_FILTER', payload: { filterName: 'id', value: debouncedIdFilter } }); 
    }
  }, [debouncedIdFilter, dispatch, filterCriteria]);

  const [nameFilter, setNameFilter] = useState('');
  const debouncedNameFilter = useDebounce(nameFilter, 300);
  const initialNameFilterRender = useRef(true);
  useEffect(() => {
    if (initialNameFilterRender.current) {
      initialNameFilterRender.current = false;
      return;
    }
    const contextValue = filterCriteria?.['name'] || '';
    const newFilterValue = debouncedNameFilter || '';
    if (contextValue !== newFilterValue) {
      dispatch({ type: 'SET_FILTER', payload: { filterName: 'name', value: debouncedNameFilter } }); 
    }
  }, [debouncedNameFilter, dispatch, filterCriteria]);

  const [typeFilter, setTypeFilter] = useState('');
  const debouncedTypeFilter = useDebounce(typeFilter, 300);
  const initialTypeFilterRender = useRef(true);
  useEffect(() => {
    if (initialTypeFilterRender.current) {
      initialTypeFilterRender.current = false;
      return;
    }
    const contextValue = filterCriteria?.['type'] || '';
    const newFilterValue = debouncedTypeFilter || '';
    if (contextValue !== newFilterValue) {
      dispatch({ type: 'SET_FILTER', payload: { filterName: 'type', value: debouncedTypeFilter } }); 
    }
  }, [debouncedTypeFilter, dispatch, filterCriteria]);

  const [assignedToFilter, setAssignedToFilter] = useState('');
  const debouncedAssignedToFilter = useDebounce(assignedToFilter, 300);
  const initialAssignedToFilterRender = useRef(true);
  useEffect(() => { 
    if (initialAssignedToFilterRender.current) {
      initialAssignedToFilterRender.current = false;
      return;
    }
    const contextValue = filterCriteria?.['assignedTo'] || '';
    const newFilterValue = debouncedAssignedToFilter || '';
    if (contextValue !== newFilterValue) {
      dispatch({ type: 'SET_FILTER', payload: { filterName: 'assignedTo', value: debouncedAssignedToFilter } }); 
    }
  }, [debouncedAssignedToFilter, dispatch, filterCriteria]);
  
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedStatusFilter = useDebounce(statusFilter, 300);
  const initialStatusFilterRender = useRef(true);
  useEffect(() => { 
    if (initialStatusFilterRender.current) {
      initialStatusFilterRender.current = false;
      return;
    }
    const contextValue = filterCriteria?.['status'] || '';
    const newFilterValue = debouncedStatusFilter || '';
    if (contextValue !== newFilterValue) {
      dispatch({ type: 'SET_FILTER', payload: { filterName: 'status', value: debouncedStatusFilter } }); 
    }
  }, [debouncedStatusFilter, dispatch, filterCriteria]);

  const [platformFilter, setPlatformFilter] = useState('');
  const debouncedPlatformFilter = useDebounce(platformFilter, 300);
  const initialPlatformFilterRender = useRef(true);
  useEffect(() => { 
    if (initialPlatformFilterRender.current) {
      initialPlatformFilterRender.current = false;
      return;
    }
    const contextValue = filterCriteria?.['platform'] || '';
    const newFilterValue = debouncedPlatformFilter || '';
    if (contextValue !== newFilterValue) {
      dispatch({ type: 'SET_FILTER', payload: { filterName: 'platform', value: debouncedPlatformFilter } }); 
    }
  }, [debouncedPlatformFilter, dispatch, filterCriteria]);


  // Local state for global search input
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const debouncedGlobalSearchTerm = useDebounce(globalSearchInput, 300);
  const initialGlobalSearchRender = useRef(true);
  
  // Effect to dispatch global search action
  useEffect(() => {
    if (initialGlobalSearchRender.current) {
      initialGlobalSearchRender.current = false;
      return;
    }
    // Compare with context's searchTerm before dispatching
    if (debouncedGlobalSearchTerm !== searchTerm) {
      dispatch({ type: 'SET_SEARCH_TERM', payload: debouncedGlobalSearchTerm });
    }
  }, [debouncedGlobalSearchTerm, dispatch, searchTerm]); // Added searchTerm to dependency array

  // Map filter keys to their state and setters for dynamic rendering
  const filterStates = {
    id: { value: idFilter, setter: setIdFilter },
    name: { value: nameFilter, setter: setNameFilter },
    type: { value: typeFilter, setter: setTypeFilter },
    assignedTo: { value: assignedToFilter, setter: setAssignedToFilter },
    status: { value: statusFilter, setter: setStatusFilter },
    platform: { value: platformFilter, setter: setPlatformFilter },
  };

  const handleColumnFilterChange = (event: React.ChangeEvent<HTMLInputElement>, filterKey: keyof AssignmentData) => {
    const stateUpdater = filterStates[filterKey as keyof typeof filterStates]?.setter;
    if (stateUpdater) {
      stateUpdater(event.target.value);
    }
  };

  const handleGlobalSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchInput(event.target.value);
  };

  const handleSort = (key: keyof AssignmentData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    dispatch({ type: 'SORT_DATA', payload: { key, direction } });
  };

  const getSortIndicator = (key: keyof AssignmentData) => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (!displayData) {
    return <p>Loading data...</p>;
  }

  const anyColumnFilterActive = () => {
    return Object.values(filterStates).some(state => state.value !== '');
  };

  if (displayData.length === 0 && globalSearchInput === '' && !anyColumnFilterActive()) {
    return <p>No assignment data available.</p>;
  }
  
  if (displayData.length === 0 && (globalSearchInput !== '' || anyColumnFilterActive())) {
    return <p>No results match your current filters/search.</p>;
  }

  return (
    <div>
      <h2>Assignments Overview</h2>
      {/* Global Search Input */}
      <div style={{ marginBottom: '10px', marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Search table across all relevant fields..."
          value={globalSearchInput}
          onChange={handleGlobalSearchChange}
          style={{ width: '50%', padding: '8px' }} 
        />
      </div>

      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.key} onClick={() => handleSort(header.key)} style={{ cursor: 'pointer' }}>
                {header.title}
                {getSortIndicator(header.key)}
              </th>
            ))}
          </tr>
          {/* Column Filter input row */}
          <tr>
            {headers.map(header => (
              <th key={`${header.key}-filter`}>
                {header.filterable ? (
                  <input
                    type="text"
                    placeholder={`Filter ${header.title}`}
                    value={filterStates[header.key as keyof typeof filterStates]?.value || ''}
                    onChange={(e) => handleColumnFilterChange(e, header.key)}
                    style={{ width: '90%' }} 
                  />
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((item) => (
            <tr key={item.id || Math.random()}>
              {headers.map(header => (
                <td key={`${item.id}-${header.key}`}>
                  {String(item[header.key] === undefined || item[header.key] === null ? '' : item[header.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsTable;

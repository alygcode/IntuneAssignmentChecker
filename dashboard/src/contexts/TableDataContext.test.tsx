// @ts-nocheck
// Using @ts-nocheck for this file as there are issues with Jest's global types
// and complex TypeScript types that are beyond the scope of this exercise to resolve fully.
// The focus is on the testing logic itself.

import { tableReducer, AssignmentData, ActionType } from './TableDataContext';

// Define a structure for initial state, similar to what's in TableDataContext
const getInitialState = () => ({
  originalData: [],
  displayData: [],
  sortConfig: null,
  filterCriteria: {},
  searchTerm: '',
  pieChartFilter: null,
});

const mockAssignments: AssignmentData[] = [
  { id: '1', name: 'Policy Alpha', type: 'Configuration Profile', assignedTo: 'Group A', status: 'Active', platform: 'Windows' },
  { id: '2', name: 'App Beta', type: 'Application', assignedTo: 'User 1', status: 'Pending', platform: 'iOS' },
  { id: '3', name: 'Policy Gamma', type: 'Compliance Policy', assignedTo: 'Group B', status: 'Active', platform: 'macOS' },
  { id: '4', name: 'Script Delta', type: 'Script', assignedTo: 'All Devices', status: 'Error', platform: 'Android' },
  { id: '5', name: 'Profile Epsilon', type: 'Configuration Profile', assignedTo: 'Group C', status: 'Active', platform: 'Windows' },
  { id: '6', name: 'App Zeta', type: 'Application', assignedTo: 'User 2', status: 'Active', platform: 'iOS' },
  { id: '7', name: 'Policy Theta', type: 'Configuration Profile', assignedTo: 'Group A', status: 'Pending', platform: 'Windows' },
  { id: '8', name: 'Script Kappa', type: 'Script', assignedTo: 'All Users', status: 'Active', platform: 'Android' },
];

describe('tableReducer', () => {
  let initialState = getInitialState();

  beforeEach(() => {
    // Reset initial state before each test and populate with mock data
    initialState = tableReducer(getInitialState(), { type: 'SET_DATA', payload: [...mockAssignments] });
  });

  test('SET_DATA should correctly set originalData and displayData', () => {
    const data = [{ id: '9', name: 'Test Policy', type: 'Test Type', status: 'Test Status' }];
    const action: ActionType = { type: 'SET_DATA', payload: data };
    const state = tableReducer(getInitialState(), action); // Use fresh initial state for this
    
    expect(state.originalData).toEqual(data);
    expect(state.displayData).toEqual(data); // processData with no filters/sort should return data as is
    expect(state.sortConfig).toBeNull();
    expect(state.filterCriteria).toEqual({});
    expect(state.searchTerm).toBe('');
    expect(state.pieChartFilter).toBeNull();
  });

  test('SORT_DATA should update sortConfig and sort displayData', () => {
    // Test sorting by name ascending
    let action: ActionType = { type: 'SORT_DATA', payload: { key: 'name', direction: 'ascending' } };
    let state = tableReducer(initialState, action);
    
    expect(state.sortConfig).toEqual({ key: 'name', direction: 'ascending' });
    expect(state.displayData[0].name).toBe('App Beta'); // Beta comes before Epsilon
    expect(state.displayData[1].name).toBe('App Zeta');
    expect(state.displayData[7].name).toBe('Script Kappa');

    // Test sorting by name descending
    action = { type: 'SORT_DATA', payload: { key: 'name', direction: 'descending' } };
    state = tableReducer(state, action); // Apply to already sorted state to see change
    
    expect(state.sortConfig).toEqual({ key: 'name', direction: 'descending' });
    expect(state.displayData[0].name).toBe('Script Kappa');
    expect(state.displayData[7].name).toBe('App Beta');
    
    // Test sorting by a different key, e.g., status
    action = { type: 'SORT_DATA', payload: { key: 'status', direction: 'ascending' } };
    state = tableReducer(state, action);
    expect(state.sortConfig).toEqual({ key: 'status', direction: 'ascending' });
    // 'Active' comes before 'Error', 'Error' before 'Pending'
    const expectedStatusOrder = mockAssignments.slice().sort((a, b) => (a.status || '').localeCompare(b.status || '')).map(item => item.status);
    const actualStatusOrder = state.displayData.map(item => item.status);
    expect(actualStatusOrder).toEqual(expectedStatusOrder);
  });

  test('SET_FILTER should update filterCriteria and filter displayData', () => {
    const action: ActionType = { type: 'SET_FILTER', payload: { filterName: 'status', value: 'Active' } };
    const state = tableReducer(initialState, action);

    expect(state.filterCriteria).toEqual({ status: 'Active' });
    expect(state.displayData.length).toBe(5); // 5 items are 'Active'
    state.displayData.forEach(item => expect(item.status).toBe('Active'));

    // Test clearing the filter
    const clearAction: ActionType = { type: 'SET_FILTER', payload: { filterName: 'status', value: '' } };
    const clearedState = tableReducer(state, clearAction);
    expect(clearedState.filterCriteria).toEqual({});
    expect(clearedState.displayData.length).toBe(mockAssignments.length);
  });
  
  test('SET_FILTER should apply multiple filters correctly', () => {
    let state = initialState;
    const action1: ActionType = { type: 'SET_FILTER', payload: { filterName: 'platform', value: 'Windows' } };
    state = tableReducer(state, action1);
    expect(state.displayData.length).toBe(3); // 3 Windows items
    
    const action2: ActionType = { type: 'SET_FILTER', payload: { filterName: 'status', value: 'Active' } };
    state = tableReducer(state, action2);
    expect(state.displayData.length).toBe(2); // 2 Windows items are Active
    state.displayData.forEach(item => {
        expect(item.platform).toBe('Windows');
        expect(item.status).toBe('Active');
    });
  });


  test('SET_SEARCH_TERM should update searchTerm and filter displayData', () => {
    const action: ActionType = { type: 'SET_SEARCH_TERM', payload: 'Policy' };
    const state = tableReducer(initialState, action);

    expect(state.searchTerm).toBe('Policy');
    expect(state.displayData.length).toBe(3); // Policy Alpha, Policy Gamma, Policy Theta
    state.displayData.forEach(item => expect(item.name).toContain('Policy'));
  });

  test('SET_PIE_FILTER should update pieChartFilter and filter displayData by type', () => {
    const action: ActionType = { type: 'SET_PIE_FILTER', payload: 'Script' };
    let state = tableReducer(initialState, action);

    expect(state.pieChartFilter).toBe('Script');
    expect(state.displayData.length).toBe(2); // Script Delta, Script Kappa
    state.displayData.forEach(item => expect(item.type).toBe('Script'));

    // Test toggling off
    const toggleAction: ActionType = { type: 'SET_PIE_FILTER', payload: 'Script' }; // Same payload
    state = tableReducer(state, toggleAction);
    expect(state.pieChartFilter).toBeNull();
    expect(state.displayData.length).toBe(mockAssignments.length);
  });

  test('CLEAR_FILTERS should reset all filter-related states and displayData', () => {
    // Apply some filters first
    let state = tableReducer(initialState, { type: 'SET_FILTER', payload: { filterName: 'platform', value: 'iOS' } });
    state = tableReducer(state, { type: 'SET_SEARCH_TERM', payload: 'App' });
    state = tableReducer(state, { type: 'SET_PIE_FILTER', payload: 'Application' });
    state = tableReducer(state, { type: 'SORT_DATA', payload: { key: 'name', direction: 'ascending' } }); // Keep sort

    const action: ActionType = { type: 'CLEAR_FILTERS' };
    const clearedState = tableReducer(state, action);

    expect(clearedState.filterCriteria).toEqual({});
    expect(clearedState.searchTerm).toBe('');
    expect(clearedState.pieChartFilter).toBeNull();
    // Sorting should be reset by CLEAR_FILTERS as it calls processData with null sortConfig
    expect(clearedState.sortConfig).toBeNull(); 
    // displayData should be the original data, as no filters and sort is reset by CLEAR_FILTERS
    expect(clearedState.displayData.map(d => d.id).sort()).toEqual(initialState.originalData.map(d => d.id).sort());
    expect(clearedState.displayData.length).toBe(mockAssignments.length);
  });

  describe('Combined Operations and Order of Operations', () => {
    test('Column Filter -> Global Search -> Pie Filter -> Sort', () => {
      let state = initialState;

      // 1. Column Filter: status 'Active'
      state = tableReducer(state, { type: 'SET_FILTER', payload: { filterName: 'status', value: 'Active' } });
      // Expected: 5 items (1, 3, 5, 6, 8)
      expect(state.displayData.length).toBe(5);
      state.displayData.forEach(item => expect(item.status).toBe('Active'));

      // 2. Global Search: 'Policy' (applied on top of 'Active' status)
      state = tableReducer(state, { type: 'SET_SEARCH_TERM', payload: 'Policy' });
      // Expected: Items that are 'Active' AND name contains 'Policy'
      // Policy Alpha (1, Active), Policy Gamma (3, Active), Profile Epsilon (5, Active, but name doesn't contain 'Policy')
      // App Zeta (6, Active, name no 'Policy'), Script Kappa (8, Active, name no 'Policy')
      // So, only Policy Alpha (1) and Policy Gamma (3)
      expect(state.displayData.length).toBe(2);
      state.displayData.forEach(item => {
        expect(item.status).toBe('Active');
        expect(item.name).toContain('Policy');
      });
      
      // 3. Pie Filter: type 'Configuration Profile' (applied on top of previous filters)
      // Items currently: Policy Alpha (1, Active, CP), Policy Gamma (3, Active, Compliance)
      // Filtering by 'Configuration Profile' should leave only Policy Alpha
      state = tableReducer(state, { type: 'SET_PIE_FILTER', payload: 'Configuration Profile' });
      expect(state.displayData.length).toBe(1);
      expect(state.displayData[0].id).toBe('1'); // Policy Alpha
      expect(state.displayData[0].type).toBe('Configuration Profile');

      // 4. Sort: name descending (applied to the single remaining item)
      state = tableReducer(state, { type: 'SORT_DATA', payload: { key: 'name', direction: 'descending' } });
      expect(state.displayData.length).toBe(1);
      expect(state.displayData[0].id).toBe('1'); // Still Policy Alpha, sorting a single item doesn't change order

      // Verify final state properties
      expect(state.filterCriteria).toEqual({ status: 'Active' });
      expect(state.searchTerm).toBe('Policy');
      expect(state.pieChartFilter).toBe('Configuration Profile');
      expect(state.sortConfig).toEqual({ key: 'name', direction: 'descending' });
    });
    
    test('Interaction of CLEAR_FILTERS with existing sort', () => {
        let state = initialState;
        state = tableReducer(state, { type: 'SORT_DATA', payload: { key: 'name', direction: 'ascending' } });
        state = tableReducer(state, { type: 'SET_FILTER', payload: { filterName: 'platform', value: 'iOS' } });
        
        // Before CLEAR_FILTERS, data is sorted by name and filtered by platform 'iOS'
        expect(state.displayData.length).toBe(2); // App Beta, App Zeta
        expect(state.displayData[0].name).toBe('App Beta');

        state = tableReducer(state, { type: 'CLEAR_FILTERS' });
        
        // After CLEAR_FILTERS, all filters are gone. Sort config is also reset.
        expect(state.sortConfig).toBeNull();
        expect(state.filterCriteria).toEqual({});
        expect(state.searchTerm).toBe('');
        expect(state.pieChartFilter).toBeNull();
        // displayData should be originalData in its original order (or SET_DATA order)
        // because sortConfig is also reset by CLEAR_FILTERS when it calls processData with null for sortConfig
        const originalIds = mockAssignments.map(item => item.id);
        const displayIdsAfterClear = state.displayData.map(item => item.id);
        // Check if the order is preserved from the initial SET_DATA
        expect(displayIdsAfterClear).toEqual(originalIds); 
    });
  });
});

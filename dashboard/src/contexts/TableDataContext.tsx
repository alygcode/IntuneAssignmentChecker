import React, { createContext, useReducer, Dispatch, ReactNode, useContext } from 'react';

// Refined based on dashboard/src/types/models.ts
// This will likely need further refinement as we connect to actual data.
// 'name' could be the policy name, 'targetName' could be the group/user/device name.
export interface AssignmentData {
  id: string; // Assignment ID
  // Fields from original models.ts or resolved data
  policyId?: string; // Kept optional as mock data might not have it
  policyName?: string; 
  targetType?: 'user' | 'group' | 'device' | 'all';
  targetId?: string;
  targetName?: string; 
  intent?: 'required' | 'available' | 'uninstall';
  createdAt?: Date | string;

  // Fields for general display, matching mock data structure
  name?: string; // e.g., 'Policy Alpha', 'App Beta'
  type?: string; // e.g., 'Configuration Profile', 'Application'
  assignedTo?: string; // e.g., 'Group A', 'User 1'
  status?: string; // e.g., 'Active', 'Pending'
  platform?: string; // e.g., 'Windows', 'iOS'
}

interface TableState {
  originalData: AssignmentData[];
  displayData: AssignmentData[];
  sortConfig: { key: keyof AssignmentData; direction: 'ascending' | 'descending' } | null;
  filterCriteria: Record<string, any>; // e.g., { type: 'Application', platform: 'Windows' }
  searchTerm: string;
  pieChartFilter: string | null; // e.g., filter by a specific 'intent' or 'targetType' from pie click
}

export type ActionType =
  | { type: 'SET_DATA'; payload: AssignmentData[] }
  | { type: 'SORT_DATA'; payload: { key: keyof AssignmentData; direction: 'ascending' | 'descending' } }
  | { type: 'SET_FILTER'; payload: { filterName: keyof AssignmentData | string; value: any } } // Allow string for custom filters
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_PIE_FILTER'; payload: string | null } // string could represent a segment of the pie chart, e.g., a specific 'type'
  | { type: 'CLEAR_FILTERS' };

// Removed duplicate non-exported initialState
// const initialState: TableState = {
// originalData: [],
// displayData: [],
// sortConfig: null,
// filterCriteria: {},
// searchTerm: '',
// pieChartFilter: null,
// };

export const TableStateContext = createContext<TableState | undefined>(undefined); // Exported
export const TableDispatchContext = createContext<Dispatch<ActionType> | undefined>(undefined); // Exported

// Export initialState for testing purposes - This is the single source of truth for initial state.
export const initialState: TableState = {
  originalData: [],
  displayData: [],
  sortConfig: null,
  filterCriteria: {},
  searchTerm: '',
  pieChartFilter: null,
};

function processData(
  originalData: AssignmentData[],
  sortConfig: { key: keyof AssignmentData; direction: 'ascending' | 'descending' } | null,
  filterCriteria: Record<string, any>,
  searchTerm: string,
  pieChartFilter: string | null // Example: filter by 'intent' or 'targetType'
): AssignmentData[] {
  let processedData = [...originalData];

  // 1. Apply column filters from filterCriteria (as per prompt's desired order)
  Object.entries(filterCriteria).forEach(([key, value]) => {
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      const filterString = String(value).toLowerCase();
      processedData = processedData.filter(item => {
        const itemValue = item[key as keyof AssignmentData];
        // Ensure consistent text filtering for all types by converting itemValue to string
        return itemValue != null && String(itemValue).toLowerCase().includes(filterString);
      });
    }
  });

  // 2. Apply Search Term (global search, applied to already column-filtered data)
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    processedData = processedData.filter(item => {
      // Make search more generic based on new fields
      const searchableFields: (keyof AssignmentData)[] = ['id', 'name', 'type', 'assignedTo', 'status', 'platform', 'policyName', 'targetName', 'targetType', 'intent'];
      return searchableFields.some(key => {
        const value = item[key];
        return value != null && String(value).toLowerCase().includes(lowerSearchTerm); // Ensure value is not null before toString
      });
    });
  }
  
  // 3. Apply Pie Chart Filter (applied after column and global search filters)
  if (pieChartFilter) { // pieChartFilter is the string value from the state, e.g., "Configuration Profile"
    processedData = processedData.filter(item => {
      // Assuming pie chart is aggregated by 'type' and pieChartFilter holds the selected 'type'
      return item.type === pieChartFilter;
    });
  }

  // 4. Apply Sorting
  if (sortConfig) {
    processedData.sort((a, b) => {
      const aValue = a[sortConfig.key] as any; // Use 'as any' for broader comparison, or refine type checks
      const bValue = b[sortConfig.key] as any;

      if (aValue === undefined || aValue === null) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (bValue === undefined || bValue === null) return sortConfig.direction === 'ascending' ? 1 : -1;
      
      // Basic string/number comparison, can be expanded
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  return processedData;
}

// Export tableReducer for testing purposes
export function tableReducer(state: TableState = initialState, action: ActionType): TableState {
  let newDisplayData;
  switch (action.type) {
    case 'SET_DATA':
      // When new data is set, reset all filters, sorting, etc.
      return {
        ...initialState, 
        originalData: action.payload,
        // Process with the truly initial (empty) filter/sort states from the exported initialState object
        displayData: processData(action.payload, initialState.sortConfig, initialState.filterCriteria, initialState.searchTerm, initialState.pieChartFilter),
      };
    case 'SORT_DATA':
      newDisplayData = processData(state.originalData, action.payload, state.filterCriteria, state.searchTerm, state.pieChartFilter);
      return {
        ...state,
        sortConfig: action.payload,
        displayData: newDisplayData,
      };
    case 'SET_FILTER':
      const newFilterCriteria = {
        ...state.filterCriteria,
        [action.payload.filterName]: action.payload.value,
      };
      if (action.payload.value === '' || action.payload.value === null || action.payload.value === undefined) {
        delete newFilterCriteria[action.payload.filterName];
      }
      newDisplayData = processData(state.originalData, state.sortConfig, newFilterCriteria, state.searchTerm, state.pieChartFilter);
      return {
        ...state,
        filterCriteria: newFilterCriteria,
        displayData: newDisplayData,
      };
    case 'SET_SEARCH_TERM':
      newDisplayData = processData(state.originalData, state.sortConfig, state.filterCriteria, action.payload, state.pieChartFilter);
      return {
        ...state,
        searchTerm: action.payload,
        displayData: newDisplayData,
      };
    case 'SET_PIE_FILTER':
      const newPieFilter = action.payload === state.pieChartFilter ? null : action.payload;
      newDisplayData = processData(state.originalData, state.sortConfig, state.filterCriteria, state.searchTerm, newPieFilter);
      return {
        ...state,
        pieChartFilter: newPieFilter,
        displayData: newDisplayData,
      };
    case 'CLEAR_FILTERS':
      // When clearing filters, we should use the current originalData, but reset all filter/sort parameters
      newDisplayData = processData(state.originalData, initialState.sortConfig, initialState.filterCriteria, initialState.searchTerm, initialState.pieChartFilter);
      return {
        ...state, // Keep originalData as is
        displayData: newDisplayData,
        sortConfig: initialState.sortConfig,
        filterCriteria: initialState.filterCriteria,
        searchTerm: initialState.searchTerm,
        pieChartFilter: initialState.pieChartFilter,
      };
    default:
      // const _exhaustiveCheck: never = action; // For exhaustive check
      return state;
  }
}

interface TableDataProviderProps {
  children: ReactNode;
}

export function TableDataProvider({ children }: TableDataProviderProps) {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  return (
    <TableStateContext.Provider value={state}>
      <TableDispatchContext.Provider value={dispatch}>
        {children}
      </TableDispatchContext.Provider>
    </TableStateContext.Provider>
  );
}

export function useTableState() {
  const context = useContext(TableStateContext);
  if (context === undefined) {
    throw new Error('useTableState must be used within a TableDataProvider');
  }
  return context;
}

export function useTableDispatch() {
  const context = useContext(TableDispatchContext);
  if (context === undefined) {
    throw new Error('useTableDispatch must be used within a TableDataProvider');
  }
  return context;
}

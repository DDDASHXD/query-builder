// ?sort[0]=eventStart&sort[1]=title&filters[eventStart][$gte]=${new Date().setHours(0, 0, 0, 0) / 1000}&filters[deadline][$gte]=${new Date().setHours(0, 0, 0, 0) / 1000}&pagination[limit]=100

/**
 * Represents sorting configuration for a query
 */
interface Sort {
  field: string;
  order: "asc" | "desc";
}

/**
 * Available comparison operators for filtering
 */
type ComparisonOperator =
  | "$eq"
  | "$gt"
  | "$gte"
  | "$in"
  | "$lt"
  | "$lte"
  | "$null"
  | "$like";

/**
 * Available logical operators for combining filters
 */
type LogicalOperator = "$and" | "$or" | "$not";

/**
 * Represents a single filter condition
 */
interface Filter {
  field: string;
  operator?: ComparisonOperator;
  value: string | number | boolean | null | Array<string | number>;
  relation?: string;
}

/**
 * Represents a logical combination of filters
 */
interface LogicalFilter {
  operator: LogicalOperator;
  filters: Filter[];
}

/**
 * Pagination settings
 */
interface Pagination {
  limit: number;
  offset?: number;
}

/**
 * Main configuration interface for the query builder
 */
export interface QueryBuilderSettings {
  sort?: Sort[];
  filters?: (Filter | LogicalFilter)[];
  pagination?: Pagination;
  populate?: string[] | string;
}

/**
 * Converts a field path to a nested filter string
 * @param field - The field path (e.g. "center.id")
 * @returns The nested filter string (e.g. "[center][id]")
 */
const getNestedFilterString = (field: string): string => {
  return field
    .split(".")
    .map((part) => `[${part}]`)
    .join("");
};

/**
 * Builds a URL query string from the provided settings
 * @param settings - Configuration object for building the query
 * @returns URL encoded query string
 * @example
 * ```tsx
 * const query = queryBuilder({
 *   sort: [{ field: 'eventStart', order: 'asc' }],
 *   filters: [
 *     { field: 'eventStart', operator: '$gte', value: Date.now() },
 *     { field: 'center.id', operator: '$eq', value: 123 }
 *   ],
 *   pagination: { limit: 10 },
 *   populate: ['department', 'projects']
 * });
 * ```
 */
export const queryBuilder = (settings: QueryBuilderSettings): string => {
  const query = new URLSearchParams();

  // Handle sorting
  if (settings.sort?.length) {
    settings.sort.forEach((sort, index) => {
      query.append(`sort[${index}]`, sort.field);
      if (sort.order === "desc") {
        query.append(`sort[${index}]`, `:${sort.order}`);
      }
    });
  }

  // Handle filtering
  if (settings.filters?.length) {
    settings.filters.forEach((filter) => {
      if (
        "operator" in filter &&
        (filter.operator === "$and" ||
          filter.operator === "$or" ||
          filter.operator === "$not")
      ) {
        // Handle logical operators
        filter.filters.forEach((subFilter, subIndex) => {
          const filterKey = `filters[${filter.operator}][${subIndex}]`;
          if (subFilter.relation) {
            query.append(
              `${filterKey}[${subFilter.relation}]${getNestedFilterString(
                subFilter.field
              )}`,
              String(subFilter.value)
            );
          } else {
            const operatorStr = subFilter.operator
              ? `[${subFilter.operator}]`
              : "";
            query.append(
              `${filterKey}${getNestedFilterString(
                subFilter.field
              )}${operatorStr}`,
              Array.isArray(subFilter.value)
                ? JSON.stringify(subFilter.value)
                : String(subFilter.value)
            );
          }
        });
      } else {
        // Handle regular filters
        const f = filter as Filter;
        if (f.relation) {
          query.append(
            `filters[${f.relation}]${getNestedFilterString(f.field)}`,
            Array.isArray(f.value) ? JSON.stringify(f.value) : String(f.value)
          );
        } else {
          const operatorStr = f.operator ? `[${f.operator}]` : "";
          query.append(
            `filters${getNestedFilterString(f.field)}${operatorStr}`,
            Array.isArray(f.value) ? JSON.stringify(f.value) : String(f.value)
          );
        }
      }
    });
  }

  // Handle pagination
  if (settings.pagination) {
    const { limit, offset } = settings.pagination;
    query.append("pagination[limit]", limit.toString());
    if (typeof offset === "number") {
      query.append("pagination[offset]", offset.toString());
    }
  }

  // Handle populate
  if (settings.populate) {
    const populateValue = Array.isArray(settings.populate)
      ? settings.populate.join(",")
      : settings.populate;
    query.append("populate", populateValue);
  }

  return query.toString();
};

export type {
  Sort,
  ComparisonOperator,
  LogicalOperator,
  Filter,
  LogicalFilter,
  Pagination
};

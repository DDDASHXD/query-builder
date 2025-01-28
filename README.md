# @DDDASHXD/query-builder

A flexible query builder for use with internal TC api, that generates URL query strings. This package helps you build complex query strings with support for sorting, filtering, and pagination.

## Installation

```bash
npm install @tc/query-builder
```

## Usage

```typescript
import { queryBuilder, type QueryBuilderSettings } from "@tc/query-builder";

// Example usage
const settings: QueryBuilderSettings = {
  // Sorting
  sort: [
    { field: "eventStart", order: "asc" },
    { field: "title", order: "desc" }
  ],

  // Filtering
  filters: [
    // Simple filter
    {
      field: "eventStart",
      operator: "$gte",
      value: new Date().setHours(0, 0, 0, 0) / 1000
    },

    // Logical operator filter
    {
      operator: "$and",
      filters: [
        { field: "status", value: "active" },
        { field: "category", value: "event" }
      ]
    }
  ],

  // Pagination
  pagination: {
    limit: 10,
    offset: 0
  }
};

const queryString = queryBuilder(settings);
// Result: sort[0]=eventStart&sort[1]=title:desc&filters[eventStart][$gte]=1643673600&filters[$and][0][status]=active&filters[$and][1][category]=event&pagination[limit]=10&pagination[offset]=0
```

## API Reference

### QueryBuilderSettings

Main configuration interface for the query builder:

```typescript
interface QueryBuilderSettings {
  sort?: Sort[];
  filters?: (Filter | LogicalFilter)[];
  pagination?: Pagination;
}
```

### Sort

```typescript
interface Sort {
  field: string;
  order: "asc" | "desc";
}
```

### Filter

```typescript
interface Filter {
  field: string;
  operator?: ComparisonOperator;
  value: string | number | boolean | null | Array<string | number>;
  relation?: string;
}
```

### ComparisonOperator

Available comparison operators:

- `$eq`: Equal
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$lt`: Less than
- `$lte`: Less than or equal
- `$in`: In array
- `$null`: Is null

### LogicalFilter

```typescript
interface LogicalFilter {
  operator: LogicalOperator; // "$and" | "$or" | "$not"
  filters: Filter[];
}
```

### Pagination

```typescript
interface Pagination {
  limit: number;
  offset?: number;
}
```

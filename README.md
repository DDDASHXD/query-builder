# @skxv/query-builder

A flexible query builder for use with internal TC api, that generates URL query strings. This package helps you build complex query strings with support for sorting, filtering, pagination, and nested field paths.

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

    // Nested field filter
    {
      field: "center.id",
      operator: "$eq",
      value: 123
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
// Result: sort[0]=eventStart&sort[1]=title:desc&filters[eventStart][$gte]=1643673600&filters[center][id][$eq]=123&filters[$and][0][status]=active&filters[$and][1][category]=event&pagination[limit]=10&pagination[offset]=0
```

## Features

### Nested Field Support

The query builder supports nested field paths using dot notation. This is particularly useful when filtering on nested object properties:

```typescript
// Example with nested fields
const settings: QueryBuilderSettings = {
  filters: [
    // Filter on nested property
    {
      field: "center.id",
      operator: "$eq",
      value: 123
    },
    // Multiple levels of nesting
    {
      field: "user.profile.email",
      operator: "$eq",
      value: "example@email.com"
    }
  ]
};

// Results in: filters[center][id][$eq]=123&filters[user][profile][email][$eq]=example@email.com
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
  field: string; // Can use dot notation for nested fields
  order: "asc" | "desc";
}
```

### Filter

```typescript
interface Filter {
  field: string; // Supports dot notation for nested fields (e.g., "center.id")
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
  filters: Filter[]; // Each filter can use nested fields
}
```

### Pagination

```typescript
interface Pagination {
  limit: number;
  offset?: number;
}
```

## Advanced Examples

### Complex Nested Filters with Logical Operators

```typescript
const settings: QueryBuilderSettings = {
  filters: [
    {
      operator: "$and",
      filters: [
        {
          field: "center.id",
          operator: "$eq",
          value: 123
        },
        {
          field: "center.status",
          operator: "$eq",
          value: "active"
        }
      ]
    }
  ]
};

// Results in: filters[$and][0][center][id][$eq]=123&filters[$and][1][center][status][$eq]=active
```

### Combining Multiple Features

```typescript
const settings: QueryBuilderSettings = {
  sort: [{ field: "center.name", order: "asc" }],
  filters: [
    {
      field: "center.id",
      operator: "$eq",
      value: 123
    },
    {
      operator: "$or",
      filters: [
        {
          field: "status",
          operator: "$eq",
          value: "active"
        },
        {
          field: "status",
          operator: "$eq",
          value: "pending"
        }
      ]
    }
  ],
  pagination: {
    limit: 20
  }
};

// Results in a query string with sorting, nested filters, logical operators, and pagination
```

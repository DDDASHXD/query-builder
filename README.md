# @skxv/query-builder

A flexible query builder for use with internal TC api, that generates URL query strings. This package helps you build complex query strings with support for sorting, filtering, pagination, populate, select, and SQL debugging.

## Installation

```bash
npm install @skxv/query-builder
```

## Quick Start

```typescript
import { queryBuilder } from "@skxv/query-builder/dist/src";

// Basic usage
const query = queryBuilder({
  // Sorting
  sort: [
    { field: "createdAt", order: "asc" },
    { field: "name", order: "desc" }
  ],

  // Filtering
  filters: [
    // Simple filter
    {
      field: "status",
      operator: "$eq",
      value: "active"
    },

    // Logical operator filter
    {
      operator: "$and",
      filters: [
        { field: "type", value: "user" },
        { field: "isVerified", value: true }
      ]
    }
  ],

  // Pagination
  pagination: {
    limit: 10,
    offset: 0
  },

  // Populate related fields
  populate: ["profile", "settings"],

  // Select specific fields
  select: ["id", "name", "email", "status"],

  // SQL Debugging
  showSql: true,
  logSql: true
});
```

## Features

### Sorting

Sort results by one or more fields:

```typescript
const query = queryBuilder({
  sort: [
    { field: "createdAt", order: "asc" },
    { field: "name", order: "desc" }
  ]
});
// Results in: sort[0]=createdAt&sort[1]=name:desc
```

### Filtering

Apply complex filters using comparison and logical operators:

```typescript
const query = queryBuilder({
  filters: [
    // Simple comparison
    {
      field: "status",
      operator: "$eq",
      value: "active"
    },
    // Logical combination
    {
      operator: "$and",
      filters: [
        { field: "type", value: "user" },
        { field: "isVerified", value: true }
      ]
    }
  ]
});
```

### Pagination

Control the number of results and pagination:

```typescript
const query = queryBuilder({
  pagination: {
    limit: 10,
    offset: 20
  }
});
// Results in: pagination[limit]=10&pagination[offset]=20
```

### Populate

Include related data in the response:

```typescript
const query = queryBuilder({
  // Array of strings
  populate: ["profile", "settings"],

  // Or comma-separated string
  populate: "profile,settings,preferences"
});
// Results in: populate=profile,settings
```

### Select

Choose specific fields to return in the response:

```typescript
const query = queryBuilder({
  select: ["id", "name", "email", "status", "createdAt"]
});
// Results in: select=id,name,email,status,createdAt
```

Note: The `id` field cannot be de-selected and will always be included in the response.

### SQL Debugging

Enable SQL query debugging for development:

```typescript
const query = queryBuilder({
  showSql: true, // Show SQL in output
  logSql: true // Log SQL to TYPO3 system log
});
// Results in: showsql=1&logsql=1
```

Note: SQL debugging only works when the request originates from a local (private) IP address.

## API Reference

### QueryBuilderSettings

Main configuration interface:

```typescript
interface QueryBuilderSettings {
  sort?: Sort[];
  filters?: (Filter | LogicalFilter)[];
  pagination?: Pagination;
  populate?: string[] | string;
  select?: string[];
  showSql?: boolean;
  logSql?: boolean;
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

Available operators:

- `$eq`: Equal
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$lt`: Less than
- `$lte`: Less than or equal
- `$in`: In array
- `$null`: Is null
- `$like`: Wildcard search

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

## Advanced Examples

### Complex Query with All Features

```typescript
const query = queryBuilder({
  sort: [{ field: "createdAt", order: "desc" }],
  filters: [
    {
      field: "status",
      value: "active"
    },
    {
      operator: "$and",
      filters: [
        {
          field: "type",
          operator: "$eq",
          value: "user"
        },
        {
          field: "isVerified",
          operator: "$eq",
          value: true
        }
      ]
    }
  ],
  pagination: {
    limit: 100
  },
  populate: ["profile", "settings", "preferences"],
  select: ["id", "name", "email", "status", "createdAt"],
  showSql: true
});
```

# Changelog

- _1.1.7 - 9. April 2024_
  > Added support for select, and sql debugging

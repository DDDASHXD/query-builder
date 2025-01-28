# @skxv/query-builder

A flexible query builder for use with internal TC api, that generates URL query strings. This package helps you build complex query strings with support for sorting, filtering, pagination, populate, and nested field paths.

## Installation

```bash
npm install @skxv/query-builder
```

## Usage

```typescript
import {
  queryBuilder,
  type QueryBuilderSettings
} from "@skxv/query-builder/dist/src";

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
  },

  // Populate related fields
  populate: ["department", "projects"]
};

const queryString = queryBuilder(settings);
// Result includes: populate=department,projects
```

## Features

### Populate Support

The query builder supports populating related fields. This is useful when you need to include related data in the response:

```typescript
// Example with populate
const settings: QueryBuilderSettings = {
  // You can use an array of strings
  populate: ["department", "projects"],

  // Or a comma-separated string
  populate: "department,projects,manager"
};

// Results in: populate=department,projects or populate=department,projects,manager
```

By default, relation fields are not fully included in the response to prevent performance issues. Using populate allows you to specify which relation fields should be included in the response, avoiding the need for multiple requests.

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
  populate?: string[] | string; // Array of fields to populate or comma-separated string
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

### Combining Multiple Features with Populate

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
  },
  populate: ["center", "status.category", "assignedUsers"]
};

// Results in a query string with sorting, nested filters, logical operators, pagination, and populated relations
```

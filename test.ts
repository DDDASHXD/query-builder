import { queryBuilder } from "./src/index.ts";

// Test basic query
const basicTest = queryBuilder({
  sort: [
    { field: "eventStart", order: "asc" },
    { field: "title", order: "desc" }
  ],
  filters: [
    {
      field: "eventStart",
      operator: "$gte",
      value: new Date().setHours(0, 0, 0, 0) / 1000
    }
  ],
  pagination: {
    limit: 10
  }
});

console.log("Basic Test:");
console.log(basicTest);
console.log("\n");

// Test nested fields
const nestedTest = queryBuilder({
  filters: [
    {
      field: "center.id",
      operator: "$eq",
      value: 123
    },
    {
      field: "user.profile.email",
      operator: "$eq",
      value: "test@example.com"
    }
  ]
});

console.log("Nested Fields Test:");
console.log(nestedTest);
console.log("\n");

// Test logical operators
const logicalTest = queryBuilder({
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
          field: "status",
          operator: "$eq",
          value: "active"
        }
      ]
    }
  ]
});

console.log("Logical Operators Test:");
console.log(logicalTest);

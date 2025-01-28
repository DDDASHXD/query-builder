import { queryBuilder } from "./src/index";

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
console.log("\n");

// Test populate with array
const populateArrayTest = queryBuilder({
  pagination: { limit: 10 },
  populate: ["department", "projects"]
});

console.log("Populate Array Test:");
console.log(populateArrayTest);
console.log("\n");

// Test populate with string
const populateStringTest = queryBuilder({
  pagination: { limit: 10 },
  populate: "department,projects,manager"
});

console.log("Populate String Test:");
console.log(populateStringTest);
console.log("\n");

// Test populate with comprehensive query
const comprehensiveTest = queryBuilder({
  sort: [{ field: "eventStart", order: "asc" }],
  filters: [
    {
      field: "eventStart",
      operator: "$gte",
      value: Date.now()
    },
    {
      operator: "$and",
      filters: [
        {
          field: "department.id",
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
  ],
  pagination: { limit: 10, offset: 0 },
  populate: ["department", "projects", "manager"]
});

console.log("Comprehensive Test with Populate:");
console.log(comprehensiveTest);
console.log("\n");

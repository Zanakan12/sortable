# Superhero Table Project

A vanilla JavaScript project to display and manipulate superhero data in a table format. This project focuses on implementing core functionality without using any external frameworks or libraries.

## Project Structure

```
├── index.html
├── styles.css
└── scripts.js
```

## Implementation Steps

### 1. Initial Setup

- Create the base HTML structure with a table element
- Add necessary input elements (search field, page size selector)
- Set up basic CSS styling
- Create JavaScript file with initial data fetching

### 2. Data Fetching and Processing

```javascript
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json())
  .then(loadData);
```

- Transform and clean the data as needed
- Store data in a suitable format for manipulation
- Handle any missing or malformed data

### 3. Table Creation

Required columns:

- Icon (images.xs)
- Name (name)
- Full Name (biography.fullName)
- Powerstats (powerstats)
- Race (appearance.race)
- Gender (appearance.gender)
- Height (appearance.height)
- Weight (appearance.weight)
- Place of Birth (biography.placeOfBirth)
- Alignment (biography.alignment)

### 4. Pagination Implementation

Features:

- Page size options: 10, 20, 50, 100, all results
- Default display: 20 results
- Navigation between pages
- Dynamic update of results per page

### 5. Sorting System

Requirements:

- Initial sort: name column in ascending order
- Click handling on all column headers
- Toggle between ascending/descending
- Numeric sorting for appropriate columns
- Handle missing values (always last)
- Special handling for weight/height strings

### 6. Search Functionality

Features:

- Real-time filtering
- Search by name
- Update results as user types
- Maintain pagination state with filtered results

### 7. Performance Optimization

Techniques:

- Implement debouncing for search
- Optimize sort algorithms
- Minimize DOM manipulations
- Cache frequently accessed elements
- Use efficient data structures

### 8. Bonus Features

Optional enhancements:

- Multi-field search capability
- Advanced search operators:
  - include/exclude
  - fuzzy search
  - equal/not equal
  - greater than/less than
- Hero detail view
- URL state management
- Enhanced UI/UX design

### Testing Checklist

#### Functional Requirements

- [ ] Table displays correct data columns
- [ ] Pagination works with all page sizes
- [ ] Sort functions correctly for all columns
- [ ] Search filters update in real-time
- [ ] Missing values appear last in sorting
- [ ] Weight/height sort numerically
- [ ] Default sort (name, ascending) on load

#### Performance Requirements

- [ ] Quick response to user interactions
- [ ] Smooth pagination transitions
- [ ] Efficient search filtering
- [ ] No unnecessary API calls

#### Bonus Requirements

- [ ] Multi-field search works correctly
- [ ] Search operators function as expected
- [ ] Detail view displays correctly
- [ ] URL updates with state changes
- [ ] Clean, responsive design

## Code Organization Tips

1. Use Classes

```javascript
class HeroTable {
  constructor() {
    this.data = [];
    this.currentPage = 1;
    this.pageSize = 20;
    this.sortColumn = "name";
    this.sortDirection = "asc";
  }
  // Methods for sorting, filtering, pagination
}
```

2. Separate Concerns

- Data manipulation functions
- DOM manipulation functions
- Event handlers
- Utility functions

3. Performance Considerations

- Cache DOM elements
- Use event delegation
- Implement debouncing for search
- Optimize sort/filter operations

## Good Practices

1. Code Style

- Use meaningful variable names
- Add comments for complex logic
- Follow consistent formatting

2. Error Handling

- Validate user inputs
- Handle API errors gracefully
- Provide feedback to users

3. Performance

- Minimize DOM updates
- Use efficient data structures
- Implement debouncing/throttling

4. Maintainability

- Write modular code
- Document complex functions
- Use consistent naming conventions

## Browser Support

- Ensure compatibility with modern browsers
- Test on different screen sizes
- Verify functionality across platforms

## Development Process

1. Start with basic functionality
2. Add features incrementally
3. Test thoroughly after each addition
4. Optimize performance
5. Add bonus features last

Remember: Focus on core functionality first and ensure it works perfectly before moving on to bonus features.

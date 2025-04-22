# Hero Table Project

## **Description**
This project is a JavaScript-based web application that dynamically displays a table of hero data retrieved from an external API. The table includes features such as pagination, column sorting, and filtering to enhance interactivity and user experience.

---

## **Features**
1. **Dynamic Data Retrieval**:
   - Fetches hero data from the [OpenDota API](https://api.opendota.com/api/heroStats).
   - Data includes hero names, primary attributes, attack types, and roles.

2. **Interactive Table**:
   - Displays data in a clear, structured table format.
   - Supports real-time sorting of columns in ascending or descending order.

3. **Pagination**:
   - Divides data into manageable pages.
   - Allows users to navigate through pages using dynamically generated buttons.

4. **Filtering (Optional)**:
   - Allows users to search for specific heroes by name or attribute.

---

## **How It Works**

### 1. **Initialization**
The application is launched with the `init()` method, which:
- Fetches data from the API using `fetchData()`.
- Sets up event listeners for user interactions (e.g., sorting, pagination).
- Renders the initial table view using `render()`.

### 2. **Data Retrieval**
Hero data is fetched asynchronously via the `fetchData()` method:
```javascript
async fetchData() {
  const response = await fetch("https://api.opendota.com/api/heroStats");
  this.data = await response.json();
  this.filteredData = [...this.data];
}
```
The data is stored in two properties:
- `data`: Original, unaltered dataset.
- `filteredData`: Modifiable dataset for sorting and filtering.

### 3. **Rendering the Table**
The `render()` method displays the table data dynamically:
- Determines the subset of data to display based on the current page and page size.
- Updates the DOM by creating table rows for each hero in the subset.
- Updates pagination controls.

### 4. **Sorting**
The `handleSort(column)` method enables sorting:
- Toggles between ascending (`asc`) and descending (`desc`) order.
- Sorts the `filteredData` array based on the selected column.
- Renders the updated table.

### 5. **Pagination**
Pagination is handled dynamically using `updatePaginationControls()`:
- Calculates the total number of pages.
- Creates buttons for each page, enabling navigation.
- Updates the `currentPage` property and re-renders the table on button click.

---

## **File Structure**
```
HeroTable/
├── index.html     # Contains the structure of the webpage.
├── styles.css     # Handles the styling of the table and controls.
└── script.js      # Contains the JavaScript logic for the project.
```

---

## **Usage Instructions**

### **Prerequisites**
- A modern web browser (e.g., Chrome, Firefox).
- Internet access (to fetch data from the API).

### **Steps to Run**
1. Clone or download the project repository.
2. Open the `index.html` file in your browser.
3. Interact with the table:
   - Use the pagination controls to navigate between pages.
   - Click on column headers to sort data.
   - (Optional) Use the search bar to filter results (if implemented).

---

## **Future Enhancements**
- **Search Bar**: Add a feature to filter heroes by name or attribute.
- **Responsive Design**: Improve layout for mobile devices.
- **Custom API Endpoint**: Allow users to input their own API URL.

---

## **Technologies Used**
- **HTML**: For the structure of the webpage.
- **CSS**: For styling the table and controls.
- **JavaScript**: For dynamic functionality and interactivity.
- **Fetch API**: For retrieving data from the external API.

---

## **Credits**
- Data provided by [OpenDota API](https://api.opendota.com/api/heroStats).

---
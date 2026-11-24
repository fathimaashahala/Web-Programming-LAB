
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

// Sample student data
const students = [
    { name: "Arun Kumar", course: "Computer Science" },
    { name: "Anjali", course: "Information Technology" },
    { name: "Rahul", course: "Mechanical Engineering" },
    { name: "Priya", course: "Computer Science" },
    { name: "Akhil", course: "Electronics" },
    { name: "Sneha", course: "Information Technology" },
    { name: "Vishnu", course: "Civil Engineering" },
    { name: "Meera", course: "Computer Science" }
];

// Live search function
async function searchStudents(query) {

    results.innerHTML = "";

    if (query === "") {
        results.innerHTML =
            "<p>Start typing to search...</p>";
        return;
    }

    // Simulate asynchronous API request
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    // Get API data
    const apiStudents = await response.json();

    // Search local and API data
    const localResults = students.filter(student =>
        student.name.toLowerCase().includes(query)
    );

    const apiResults = apiStudents.filter(student =>
        student.name.toLowerCase().includes(query)
    );

    const allResults = [
        ...localResults,
        ...apiResults.map(user => ({
            name: user.name,
            course: user.email
        }))
    ];

    // Display results
    if (allResults.length === 0) {
        results.innerHTML =
            '<div class="no-result">No results found!</div>';
        return;
    }

    allResults.forEach(student => {

        const item = document.createElement("div");
        item.className = "result-item";

        const name = document.createElement("h3");
        name.textContent = student.name;

        const detail = document.createElement("p");
        detail.textContent = student.course;

        item.append(name, detail);
        results.appendChild(item);
    });
}

// Search whenever user types
searchInput.addEventListener("input", function() {

    const query = this.value.trim().toLowerCase();

    searchStudents(query).catch(error => {
        results.innerHTML =
            '<div class="no-result">Unable to load results.</div>';
        console.error(error);
    });

});

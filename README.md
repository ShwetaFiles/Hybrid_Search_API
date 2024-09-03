Hybrid Search API Documentation
1. Introduction
The Hybrid Search API is built using Node.js with Express, PostgreSQL for database management, and Swagger UI for API testing and documentation The API allows for three types of searches: Keyword Search, Vector Search, and Hybrid Search. It is designed to efficiently handle large datasets and provide accurate, relevant results based on keyword and vector similarities.

2. Setup Instructions
2.1 Prerequisites
Before setting up the API, ensure that the following prerequisites are met:
Node.js (v14+): Ensure that Node.js and npm (Node Package Manager) are installed on your system.
PostgreSQL: Ensure PostgreSQL is installed and a database is set up.
Git: Ensure Git is installed to clone the repository.
The complete source code of the API is available in the GitHub repository. The code is written using Node.js and Express, with Sequelize as the ORM for PostgreSQL.
https://github.com/ShwetaFiles/Hybrid_Search_API

2.2 Database Schema
SQL Scripts: SQL scripts for creating the necessary database tables (MagazineInformations and MagazineContents) are provided.
2.3 Documentation
This document serves as the detailed guide for setting up, running, and using the API.
Setup Instructions:
Clone the Repository:
git clone https://github.com/yourusername/hybrid-search-api.git
cd hybrid-search-api
Install Dependencies:
npm install
Set Up PostgreSQL:
Ensure PostgreSQL is installed and running.
Create a new database named hybrid_search_db.
Update database credentials in the index.js file if necessary.
Run the Server:
node index.js
The server will be accessible at http://localhost:3000.
Usage Examples:
Keyword Search:

{"searchType": "keyword", "keyword": "technology"}'

Vector Search:
{"searchType": "vector", "vector": [0.55, 0.74, 0.11]}'

Hybrid Search:
{"searchType": "hybrid", 
"keyword": "technology", 
"vector": [0.55, 0.74, 0.11]
}'
Swagger UI:
Accessible at http://localhost:3000/api-docs for testing and exploring the API endpoints.
2.4 Performance Report
Considerations:
The API is designed to handle large datasets using optimized SQL queries and indexing strategies.
Sequelize's lazy loading and eager loading techniques are used to optimize database interactions.
Optimizations:
Indexes have been added to the fields commonly used in searches (title, author, vector_representation) to speed up query performance.
.


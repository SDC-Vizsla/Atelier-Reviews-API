# Atelier-Reviews-API
This is the repository for the Atelier-Reviews-API project, an API for managing and retrieving product reviews.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)

## Prerequisites
Before running the Atelier-Reviews-API, ensure you have the following installed:

- [Node.js](https://nodejs.org) (v12 or later)
- [PostgreSQL](https://www.postgresql.org)

## Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/SDC-Vizsla/Atelier-Reviews-API.git
   ```
2. Navigate to the project directory:

   ```bash
   cd Atelier-Reviews-API
   ```
3. Install the dependencies:
	```bash
	npm install
	```

## Configuration
The Atelier-Reviews-API requires a configuration file for connecting to the PostgreSQL database. Follow these steps to configure the application:

1.  Create a `.env` file in the root directory of the project.

2.  Set the following environment variables in the `.env` file:
	```bash
	USERNAME=<your_database_username>
	HOST=<your_database_host>
	DATABASE=<your_database_name>
	PASSWORD=<your_database_password>
	PORT=<your_database_port>
	APIPORT = <your_locahost_port>
	EXISTDB = <your_existing_database_name>
	SCHEMA = 'reviewschema'
	```
Replace `<your_database_username>`, `<your_database_host>`, `<your_database_name>`, `<your_database_password>`, and `<your_database_port>` with the appropriate values for your PostgreSQL database.

## Configuration
To start the Atelier-Reviews-API server, run the following command:
```bash
npm run start
```
The server will start running at `http://localhost:3000`.

## Endpoints
The Atelier-Reviews-API provides the following endpoints:

-   (GET)`/reviews`: Retrieves all reviews for a specific product.
-   (POST)`/reviews`: Creates a new review.
-   (GET)`/reviews/meta`: Retrieves review metadata for a specific product.
-   (PUT)`/reviews/:review_id/helpful`: Marks a review as helpful.
-   (PUT)`/reviews/:review_id/report`: Reports a review.


## Contributing
Contributions to the Atelier-Reviews-API are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/SDC-Vizsla/Atelier-Reviews-API/issues).

If you would like to contribute code, follow these steps:

1.  Fork the repository.

2.  Create a new branch for your feature/bug fix:

```bash
git checkout -b my-feature
```
3.  Make your changes and commit them:
```bash
git commit -m 'Add new feature'
```
4.  Push the branch to your forked repository:
```bash
git push origin my-feature
```
5.  Open a pull request on the main repository.

# SDC-Reviews-API

This is the repository for the SDC-Reviews-API project, an API for managing and retrieving product reviews.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before running the SDC-Reviews-API, ensure you have the following installed:

- [Node.js](https://nodejs.org) (v12 or later)
- [PostgreSQL](https://www.postgresql.org)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SDC-Vizsla/SDC-Reviews-API.git
   ```
2. Navigate to the project directory:

   ```bash
   cd SDC-Reviews-API
   ```
3. Install the dependencies:
	```bash
	npm install
	```
## Configuration
The SDC-Reviews-API requires a configuration file for connecting to the PostgreSQL database. Follow these steps to configure the application:

1.  Create a `.env` file in the root directory of the project.

2.  Set the following environment variables in the `.env` file:
	```bash
	USERNAME=<your_database_username>
	HOST=<your_database_host>
	DATABASE=<your_database_name>
	PASSWORD=<your_database_password>
	PORT=<your_database_port>
	```
Replace `<your_database_username>`, `<your_database_host>`, `<your_database_name>`, `<your_database_password>`, and `<your_database_port>` with the appropriate values for your PostgreSQL database.
## Configuration
To start the SDC-Reviews-API server, run the following command:
```bash
npm start
```
The server will start running at `http://localhost:3000`.
## Endpoints
The SDC-Reviews-API provides the following endpoints:

-   `/api/reviews`: Retrieves all reviews for a specific product.
-   `/api/reviews/:id`: Retrieves a specific review by ID.
-   `/api/reviews/:id/meta`: Retrieves review metadata for a specific product.
-   `/api/reviews/:id/helpful`: Marks a review as helpful.
-   `/api/reviews/:id/report`: Reports a review.
-   `/api/reviews`: Creates a new review.

For detailed information about each endpoint and their request/response formats, please refer to the [API documentation](https://chat.openai.com/c/docs/api.md).

## Contributing

Contributions to the SDC-Reviews-API are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/SDC-Vizsla/SDC-Reviews-API/issues).

If you would like to contribute code, follow these steps:

1.  Fork the repository.

2.  Create a new branch for your feature/bug fix:

```bash
git checkout -b my-feature
```
3.  Make your changes and commit them:
```bash
git commit -am 'Add new feature'
```
4.  Push the branch to your forked repository:
```bash
git push origin my-feature
```
5.  Open a pull request on the main repository.
## License
This project is licensed under the MIT License. See the [LICENSE](https://chat.openai.com/c/LICENSE) file for more details.
```css
Feel free to use this code as a complete README file for your SDC-Reviews-API repository.
```
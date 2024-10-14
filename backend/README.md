# How to Run the Backend

## Prerequisites

- Node.js (v14 or later) [installation steps](node-install.md)
- npm (v6 or later) (it'll be already installed with Node.js)
- MySQL (v8.2 or later) [installation steps](mysql-install.md)

## Setting Up `nodemon.json` Environment

1. **Create a MySQL Database**:
Create a MySQL database and note down the host, database name, port, username, and password.

2. **Run the database migration**:
Migrate the `database.sql` file.

3. **Create or Update `nodemon.json`**:
Ensure you have a `nodemon.json` file in the root directory of your project. This file should contain the necessary
environment variables for your application.

```json
{
	"watch": [
		"src"
	],
	"ext": "ts,json",
	"exec": "npx ts-node src/index.ts",
	"env": {
		"NODE_ENV": "nodemon",
		"PORT": 3000,
		"HOST": "",
		"DB_DATABASE": "",
		"DB_PORT": "",
		"DB_USER": "",
		"DB_PASSWORD": "",
		"PER_PAGE": 10,
		"SERVICE_REGION": "ap-northeast-1",
		"ACCESS_KEY": "",
		"SECRET_ACCESS_KEY": "",
		"PARENT_POOL_ID": "",
		"PARENT_CLIENT_ID": "",
		"ADMIN_POOL_ID": "",
		"ADMIN_CLIENT_ID": "",
        "SNS_ARN": "",
		"USE_MOCK_COGNITO": "true"
	}
}
```

4. **Environment "Variables"**:

- `PORT`: The port number on which the server will run.
- `HOST`: The host of the MySQL database.
- `DB_DATABASE`: The name of the MySQL database.
- `DB_PORT`: The port of the MySQL database.
- `DB_USER`: The username of the MySQL database.
- `DB_PASSWORD`: The password of the MySQL database.
- `PER_PAGE`: The number of items to display per page.
- `SERVICE_REGION`: The region of the AWS service.
- `ACCESS_KEY`: The access key of the AWS service.
- `SECRET_ACCESS_KEY`: The secret access key of the AWS service.
- `PARENT_POOL_ID`: The pool ID of the parent user.
- `PARENT_CLIENT_ID`: The client ID of the parent user.
- `ADMIN_POOL_ID`: The pool ID of the admin user.
- `ADMIN_CLIENT_ID`: The client ID of the admin user.
- `SNS_ARN`: The ARN of the SNS topic.
- `USE_MOCK_COGNITO`: Whatever hasn't aws services to use mock cognito. **true** or **false** in string.

5. **Install Dependencies**: Run the following command to install the required dependencies:

```shell
npm install
```

6. **Run the Server**:
Run the following command to start the server:

```shell
npm run 'admin dev'
```

7. **Login Credentials**:
Use the following credentials to log in:

  - **Email**: `admin@gmail.com`
  - **Password**: `password`

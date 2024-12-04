# How to Run the Backend

## Prerequisites

- Node.js (v14 or later) [installation steps](node-install.md)
- npm (v6 or later) (it'll be already installed with Node.js)
- MySQL (v8.2 or later) [installation steps](mysql-install.md)
- Learn how to set up push notifications [firebase and expo setup](push-notification.md)

## Setting Up `nodemon.json` Environment

1. **Create a MySQL Database**:
Create a MySQL database and note down the host, database name, port, username, and password.

2. **Run the database migration**:
Migrate the `database.sql` file. Open git bash or terminal and navigate to the backend directory. Run the following command:

    ```shell
    mysql -u root -p < backend/database.sql
    ```

3. **Install Dependencies**: Run the following command to install the required dependencies:

    ```shell
    npm install
    ```

4. **Write Environment Variables** in `nodemon.json`:

    ```
    "DB_USER": "root",
    "DB_PASSWORD": "root",
    ```

5. **Run the Server**:

    ```shell
    # for admin panel
    npm run 'admin dev'
    ```

    ```shell
    # for mobile app
    npm run 'mobile dev'
    ```

6. **Login Credentials**:
Use the following credentials to log in to admin panel:

  - **Email**: `admin@gmail.com`
  - **Password**: `password`

Use the following credentials to log in to the mobile app:

  - **Email**: `parent@gmail.com`
  - **Password**: `password`

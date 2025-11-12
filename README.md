# User Management App

A **User Management** application built with **Node.js**, **Express**, **MongoDB**, and **View\.ejs** for the frontend. This app allows users and admins to manage user data with features like authentication, email verification, and password reset.

## Features

* **Create User**: Admin or users can create new accounts.
* **Edit User**: Update user details.
* **Show All Users**: View a list of all users.
* **Delete User**: Remove a user from the Database.
* **Admin Login**: Secure login for administrators.
* **User Login**: User authentication.
* **Admin Dashboard**: Admin panel to manage users.
* **Verify Email**: Email verification for new accounts.
* **Reset Password**: Password reset functionality for users.

## Technologies Used

* **Backend:** Node.js, Express.js
* **Frontend:** View\.ejs
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT auth
* **Form Validation:** Custom or client-side validation

## Getting Started

### Prerequisites

* **Node.js** installed: `node -v`
* **MongoDB** installed locally or access to a cloud MongoDB instance
* **npm** installed: `npm -v`

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vyasan-6-6/USER_MANAGEMENT_SYSTEM.git
```

2. Navigate to the project folder:

```bash
cd UMS
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:
   Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your_jwt_secret
```

5. Start the backend server:

```bash
npm start
```

6. Open your browser at `http://localhost:8000` to access the app.


## API Endpoints

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | /user/register          | Create new user           |
| POST   | /userlogin              | User login                |
| POST   | /admin                  | Admin login               |
| GET    | /api/users              | Get all users             |
| GET    | /user?id                | Get a single user         |
| PUT    | /edit-user?id           | Update user details       |
| PUT    | /user-new?id            | Add new user              |
| DELETE | /user/delete-users?id   | Delete a user             |
| POST   | /verify-email           | Verify user email         |
| POST   | /reset-password         | Request password reset    |
| POST   | /reset-password?token   | Reset password with token |

## Usage

1. **Create User:** Admin or user can create a new account.
2. **Edit User:** Update user information via edit page.
3. **Show All Users:** Admin can view all registered users.
4. **Delete User:** Remove a user from the system.
5. **Search User:** Search using name, email, or other fields.
6. **Admin Login:** Admin login to access dashboard.
7. **User Login:** Users can log in to their account.
8. **Admin Dashboard:** Admin can manage users.
9. **Verify Email:** Users verify email after registration.
10. **Reset Password:** Users can reset their password.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

VYASAN – [ vyasanksparasakthy@gmail.com ]

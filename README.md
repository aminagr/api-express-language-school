# Language School Express.js API

## Description

This API is built with Node.js and Express.js to manage a language school. It enables the management of students, administrators, language levels, sessions, rooms, groups, and registrations. The functionality is secured with role-based access control middleware and user authentication (for admins and students).

## Key Features

- **Authentication and User Management**: User registration and login, role-based management (admin and student).
- **Administrator Management**: Add, update, delete administrators.
- **Student Management**: Add, update, delete, and retrieve students, manage students by group.
- **Level Management**: Add, update, delete language levels.
- **Session Management**: Create, update, delete, and retrieve learning sessions.
- **Group Management**: Add, update, delete, and retrieve student groups.
- **Registration Management**: Handle student registrations for different groups and sessions.
- **Statistics**: Retrieve various statistics about groups, students, sessions, and registrations.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **Supabase/PostgreSQL**: Database to store school-related data.
- **JWT**: JSON Web Token for user authentication.

## Contributing

If you'd like to contribute to this project, please submit a pull request with clear explanations of your changes. Feel free to open an issue to discuss improvements or bugs.

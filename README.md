# Booking - Event and Concert Management

## Project Description
The **Booking** project is a SaaS platform for managing tickets for concerts and events. This solution is designed for both small businesses (such as schools organizing events) and large-scale international tours.

### Key Features:
- API for full CRUD (Create, Read, Update, Delete) management of events.
- API for user management.
- API for authentication and authorization.
- API for handling ticket purchases with confirmation (simulated email or SMS notification).
- Secure system preventing ticket overselling.
- Microservices-based architecture with Swagger documentation.
- Logging and error handling for easier debugging.
- Enhanced security: no plaintext passwords, regular backups of sensitive data.
- Explanation of LoadBalancer configuration and usage.

---

## Installation and Execution

### 1. Clone the Repository
```sh
git clone https://github.com/MathisDulieu/Booking.git
```

### 2. Navigate to the Project Directory
```sh
cd Booking
```

### 3. Ensure Docker is Running
Make sure **Docker Desktop** is installed and running.
If not, install it here: [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/)

### 4. Start the Application
```sh
docker-compose up --build --force-recreate
```
Wait until all services are fully started.

### 5. Access the Services
- **Front-end**: [http://localhost](http://localhost)
- **Swagger API Gateway**: [http://localhost/api/swagger-ui/index.html#/](http://localhost/api/swagger-ui/index.html#/)

---

## Database Access
To directly access the MongoDB database, follow these steps:

1. Open a terminal.
2. Run the following command to enter the MongoDB container:
   ```sh
   docker exec -it mongodb bash
   ```
3. Access the MongoDB shell with authentication:
   ```sh
   mongosh --host localhost -u root -p rootpassword --authenticationDatabase admin
   ```
4. Select the **Booking** database:
   ```sh
   use Booking
   ```

---

## Stopping and Removing Containers
If you need to stop the containers, run:
```sh
docker-compose down
```
This will remove the existing containers without affecting the data volumes.

---

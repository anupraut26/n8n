# Electronic Store Microservices Project

This project is a fully functional E-commerce application based on microservices architecture. It leverages Java 17, Spring Boot 3.2, Spring Cloud, and React JS.

## 🏗 Architecture Overview

The system allows users to browse products, place orders, and receive email notifications. The backend is composed of loosely coupled services communicating via REST (synchronous) and Apache Kafka (asynchronous).

### Microservices

| Service Name | Port | Description | Database (MySQL) |
| :--- | :--- | :--- | :--- |
| **Discovery Server** | `8761` | Eureka Server for service registration and discovery. | N/A |
| **API Gateway** | `8080` | Entry point for all client requests. Routes to services. | N/A |
| **Product Service** | `8081` | REST API for managing product catalog (CRUD). | `product_db` |
| **Customer Service** | `8082` | Manages customer profiles and data. | `customer_db` |
| **Inventory Service** | `8083` | Tracks product stock levels. | `inventory_db` |
| **Order Service** | `8084` | Handles order creation. Produces Kafka events. | `order_db` |
| **Payment Service** | `8085` | Processes payments. Consumes Order events. | `payment_db` |
| **Email Service** | `8086` | Sends notifications. Consumes Payment events. | N/A |

### Frontend
*   **Application**: React JS with Vite
*   **UI Library**: Material UI (@mui/material)
*   **Port**: `5173` (Default Vite port)

### Infrastructure
*   **MySQL 8.0**: Primary data store for all services.
*   **Apache Kafka**: Event streaming platform for decoupled communication.
*   **Zookeeper**: Coordination service for Kafka.
*   **Docker Compose**: Orchestrates the infrastructure containers.

## ⚙️ Configuration & Requirements

### Prerequisites
*   **Java 17 JDK**
*   **Maven 3.8+**
*   **Docker Desktop** (or Docker Engine + Compose)
*   **Node.js 18+** & **npm**

### Environment Variables
Services are configured with default `localhost` settings in `application.yml`.
*   **Database Host**: `localhost` (Port 3306)
*   **Kafka Bootstrap**: `localhost:9092`
*   **Eureka**: `http://localhost:8761/eureka/`

## 🚀 Getting Started

### 1. Start Infrastructure
Run the following command in the project root to start MySQL, Kafka, and Zookeeper:
```bash
docker-compose up -d
```
*Wait for a few minutes for the containers to fully initialize.*

### 2. Build Backend
Build all Java modules:
```bash
mvn clean install -DskipTests
```

### 3. Run Services
Start the services in this specific order to ensure dependencies are met:

1.  **Discovery Server**:
    ```bash
    cd discovery-server && mvn spring-boot:run &
    ```
2.  **API Gateway**:
    ```bash
    cd api-gateway && mvn spring-boot:run &
    ```
3.  **Microservices** (Run each in a separate terminal or background):
    ```bash
    cd product-service && mvn spring-boot:run &
    cd customer-service && mvn spring-boot:run &
    cd inventory-service && mvn spring-boot:run &
    cd order-service && mvn spring-boot:run &
    cd payment-service && mvn spring-boot:run &
    cd email-service && mvn spring-boot:run &
    ```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

## 📡 API Usage

All API requests should be routed through the API Gateway (Port 8080).

**Example Endpoints:**
*   **Get All Products**: `GET http://localhost:8080/api/product`
*   **Create Order**: `POST http://localhost:8080/api/order`
*   **Get Inventory**: `GET http://localhost:8080/api/inventory/{skuCode}`

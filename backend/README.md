# Smart Agency Backend API

Backend API for Smart Agency built with NestJS, MongoDB, and TypeScript.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Projects Management**: CRUD operations with advanced filtering and pagination
- **Technologies**: Manage technologies used in projects
- **Leads/CRM**: Lead management with n8n webhook integration
- **Blog**: Blog posts management with SEO support
- **Hosting Packages**: Dynamic pricing packages management
- **Testimonials**: Client testimonials with project linking
- **Team Members**: Team management with department organization
- **File Uploads**: Cloudinary integration for image uploads
- **FAQs**: Dynamic FAQs for SEO and reducing support load
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js + JWT
- **File Storage**: Cloudinary
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for file uploads)

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

## Configuration

Edit `.env` file with your settings:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# n8n Webhook (Optional)
N8N_WEBHOOK_URL=https://...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Running the App

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs

## Default Admin User

On first run, a default admin user is created:
- **Email**: admin@smartagency.com
- **Password**: admin123

⚠️ **Change this password immediately after first login!**

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | Login | Public |
| POST | /api/auth/register | Register user | Admin |
| GET | /api/auth/profile | Get profile | JWT |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/projects | List projects | Public |
| GET | /api/projects/featured | Featured projects | Public |
| GET | /api/projects/slug/:slug | Get by slug | Public |
| POST | /api/projects | Create project | JWT |
| PATCH | /api/projects/:id | Update project | JWT |
| DELETE | /api/projects/:id | Delete project | JWT |

### Technologies
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/technologies | List technologies | Public |
| POST | /api/technologies | Create technology | JWT |
| PATCH | /api/technologies/:id | Update technology | JWT |
| DELETE | /api/technologies/:id | Delete technology | JWT |

### Leads
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/leads | Submit lead | Public |
| GET | /api/leads | List leads | JWT |
| GET | /api/leads/stats | Get statistics | JWT |
| PATCH | /api/leads/:id | Update lead | JWT |
| DELETE | /api/leads/:id | Delete lead | JWT |

### Blog
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog | List posts | Public |
| GET | /api/blog/slug/:slug | Get by slug | Public |
| GET | /api/blog/tags | Get all tags | Public |
| POST | /api/blog | Create post | JWT |
| PATCH | /api/blog/:id | Update post | JWT |
| DELETE | /api/blog/:id | Delete post | JWT |

### Uploads
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/uploads/image | Upload image | JWT |
| POST | /api/uploads/images | Upload multiple | JWT |
| DELETE | /api/uploads/:publicId | Delete file | JWT |

### FAQs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/faqs | List active FAQs with filters | Public |
| GET | /api/faqs/category/:category | FAQs by category | Public |
| GET | /api/faqs/admin | List FAQs (include inactive) | JWT |
| POST | /api/faqs | Create FAQ | JWT |
| PATCH | /api/faqs/:id | Update FAQ | JWT |
| DELETE | /api/faqs/:id | Delete FAQ | JWT |

### Hosting Packages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/hosting-packages | List active packages | Public |
| GET | /api/hosting-packages/category/:category | Get by category | Public |
| POST | /api/hosting-packages | Create package | JWT |
| PATCH | /api/hosting-packages/:id | Update package | JWT |
| DELETE | /api/hosting-packages/:id | Delete package | JWT |
| PATCH | /api/hosting-packages/sort/order | Update sort order | JWT |

### Testimonials
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/testimonials | List testimonials | Public |
| GET | /api/testimonials/featured | Featured testimonials | Public |
| GET | /api/testimonials/project/:projectId | Get by project | Public |
| GET | /api/testimonials/stats | Get statistics | JWT |
| POST | /api/testimonials | Create testimonial | JWT |
| PATCH | /api/testimonials/:id | Update testimonial | JWT |
| DELETE | /api/testimonials/:id | Delete testimonial | JWT |

### Team
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/team | List team members | Public |
| GET | /api/team/homepage | Get for homepage | Public |
| GET | /api/team/department/:department | Get by department | Public |
| GET | /api/team/stats | Get statistics | JWT |
| POST | /api/team | Add team member | JWT |
| PATCH | /api/team/:id | Update member | JWT |
| DELETE | /api/team/:id | Remove member | JWT |
| PATCH | /api/team/sort/order | Update sort order | JWT |

## Response Format

All API responses follow this format:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {...},
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── blog/              # Blog module
├── common/            # Shared utilities
├── database/          # Database seeder
├── hosting-packages/  # Hosting packages module
├── leads/             # Leads/CRM module
├── projects/          # Projects module
├── team/              # Team members module
├── technologies/      # Technologies module
├── testimonials/      # Testimonials module
├── faqs/              # Dynamic FAQs module
├── uploads/           # File uploads module
├── users/             # Users module
├── app.module.ts      # Root module
└── main.ts            # Entry point
```

## License

Private - Smart Agency

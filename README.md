# AMEU Smart School Management System

A comprehensive educational platform built with React, TypeScript, and Vite, featuring separate dashboards for students, lecturers, and administrators.

## 🚀 Features

### 👨‍🎓 Student Dashboard

- **Academic Overview** - GPA tracking, course progress, upcoming assignments
- **Course Management** - Enrollment, schedules, materials access
- **Communication** - Messages, notifications, announcements
- **Learning Tools** - Study plans, calendar integration, resource library

### 👨‍🏫 Lecturer Dashboard

- **Course Management** - Create/edit courses, manage enrollments
- **Assessment Tools** - Assignment creation, grading, quiz management
- **Student Tracking** - Attendance, performance analytics, progress reports
- **Communication** - Announcements, messaging, feedback systems

### 👨‍💼 Admin Dashboard

- **User Management** - Students, lecturers, staff administration
- **Academic Management** - Courses, faculties, departments, registrations
- **System Analytics** - Comprehensive reporting and statistics
- **Configuration** - System settings, academic calendar, policies

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Context + useState

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/ameu-smart-school-system.git
   cd ameu-smart-school-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## 🏗️ Project Structure

\`\`\`
src/
├── components/ # Reusable UI components
│ ├── ui/ # shadcn/ui components
│ └── modals/ # Modal components for CRUD operations
├── layouts/ # Layout components for different user roles
├── pages/ # Page components organized by user role
│ ├── admin/ # Admin dashboard pages
│ ├── lecturer/ # Lecturer dashboard pages
│ ├── student/ # Student dashboard pages
│ └── auth/ # Authentication pages
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and configurations
└── main.tsx # Application entry point
\`\`\`

## 🎯 Key Features

### CRUD Operations

- **Create**: Add new students, lecturers, courses with form validation
- **Read**: View and search through all records with filtering
- **Update**: Edit existing records with pre-filled forms
- **Delete**: Safe deletion with confirmation dialogs

### Form Validation

- Real-time validation with Zod schemas
- Field-specific error messages
- Required field enforcement
- Email format validation

### Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Consistent design system

### User Experience

- Toast notifications for all operations
- Loading states and smooth transitions
- Keyboard navigation support
- Accessible design patterns

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:
\`\`\`env
VITE_APP_TITLE=AMEU Smart School System
VITE_API_URL=http://localhost:3001/api
\`\`\`

### Customization

- **Colors**: Modify `tailwind.config.js` for theme customization
- **Components**: Extend shadcn/ui components in `src/components/ui/`
- **Layouts**: Customize layouts in `src/layouts/`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1400px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ameu.edu or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the icon library
- [Recharts](https://recharts.org/) for the charting library

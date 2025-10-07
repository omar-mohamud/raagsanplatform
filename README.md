# Raagsan Platform

A scalable digital storytelling platform that transforms static storytelling sites into dynamic platforms capable of hosting multiple projects, datasets, and stories. Built for Raagsan's mission to provide strategic and analytical consulting services across Somalia.

## 🌟 Features

### Core Functionality
- **Multi-Project Management**: Host multiple storytelling projects under one unified platform
- **Dynamic Content Management**: Admin portal for easy content creation and management
- **Rich Storytelling**: Block-based editor supporting text, images, embeds, and multimedia
- **Responsive Design**: Mobile-first design with Raagsan branding
- **Secure Authentication**: NextAuth.js integration for admin access

### Content Management
- **Project Visibility Control**: Show/hide projects with simple toggles
- **Project Ordering**: Drag-and-drop or up/down controls for project arrangement
- **Status Management**: Draft/Published status for content workflow
- **Date Management**: Start and end date tracking for projects
- **Image Optimization**: Automatic Cloudinary integration with WebP conversion

### User Experience
- **Professional Branding**: Consistent Raagsan visual identity
- **Fast Loading**: Optimized images and static generation
- **SEO Ready**: Server-side rendering and meta tags
- **Accessibility**: WCAG compliant design patterns

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TailwindCSS** - Utility-first CSS framework
- **React 19** - Latest React with concurrent features

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication framework

### Database & Storage
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Cloudinary** - Image storage and optimization

### Deployment
- **Vercel** - Serverless deployment platform
- **GitHub** - Version control and CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omar-mohamud/raagsanplatform.git
   cd raagsanplatform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raagsan_platform?retryWrites=true&w=majority
   
   # Authentication
   NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   
   # Admin Credentials
   ADMIN_USER=admin
   ADMIN_PASS=admin123
   
   # Cloudinary (Image Storage)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # API Security
   ADMIN_TOKEN=your-admin-token-here
   ```

4. **Configure MongoDB Atlas**
   - Create a MongoDB Atlas cluster
   - Add your IP address to the whitelist
   - Create a database user with read/write permissions
   - Update the `MONGODB_URI` in your `.env.local`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - **Homepage**: http://localhost:3000
   - **Admin Portal**: http://localhost:3000/admin/login
   - **Login Credentials**: admin / admin123 (change in production)

## 📁 Project Structure

```
raagsanplatform/
├── app/                          # Next.js App Router
│   ├── api/                     # API endpoints
│   │   ├── admin/               # Admin-specific APIs
│   │   ├── auth/                # Authentication APIs
│   │   ├── projects/            # Project management APIs
│   │   └── uploads/             # File upload APIs
│   ├── admin/                   # Admin interface
│   │   ├── login/               # Admin login page
│   │   └── page.js              # Admin dashboard
│   ├── projects/                # Project pages
│   │   └── [slug]/              # Dynamic project routes
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Homepage
├── components/                   # Reusable React components
│   ├── GlobalNav.js             # Navigation component
│   ├── PageBackground.js        # Background component
│   ├── Toast.js                 # Notification component
│   └── CloudinaryUpload.js      # Image upload component
├── lib/                         # Utility libraries
│   ├── authOptions.js           # NextAuth configuration
│   ├── dbConnect.js             # Database connection
│   ├── fallbackData.js          # Fallback data for offline mode
│   └── cloudinary.js            # Cloudinary configuration
├── models/                      # Mongoose data models
│   ├── Project.js               # Project schema
│   └── Story.js                 # Story schema
├── scripts/                     # Database and utility scripts
├── public/                      # Static assets
└── sepow_photos/               # Sample project assets
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Content Management
npm run import:sepow # Import SEPOW photos and create gallery
npm run seed:sepow:real # Add real SEPOW content

# Database
npm run seed:sepow:headings  # Add SEPOW section headings
npm run fix:sepow           # Fix SEPOW story content
```

## 🔧 Admin Portal Features

### Project Management
- **Visibility Control**: Toggle projects on/off
- **Status Management**: Set projects as draft or published
- **Ordering**: Reorder projects with up/down controls
- **Date Tracking**: Set start and end dates
- **Content Viewing**: View full project content

### Content Creation
- **Rich Text Editor**: Block-based editor for stories
- **Image Upload**: Direct Cloudinary integration
- **Media Embedding**: Support for external content
- **SEO Optimization**: Meta tags and descriptions

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

2. **Required Environment Variables for Production**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raagsan_platform?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-production-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ADMIN_USER=admin
   ADMIN_PASS=your-secure-password
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ADMIN_TOKEN=your-secure-admin-token
   ```

3. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Custom domains can be configured in Vercel dashboard
   - Environment variables are managed in Vercel dashboard

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod
```

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored securely
- **Authentication**: NextAuth.js with secure sessions
- **API Protection**: Admin-only endpoints with session validation
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing

## 🎨 Branding & Design

### Raagsan Brand Colors
- **Primary Blue**: #035F87 (Raagsan Blue)
- **Secondary Orange**: #FF6B35 (Raagsan Orange)
- **Accent Red**: #DC2626 (GIZ Red - for specific elements)
- **Text**: #000000 (Black) / #FFFFFF (White)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Fluid Typography**: Uses clamp() for responsive text sizing

## 📊 Performance

- **Static Generation**: Pre-rendered pages for fast loading
- **Image Optimization**: Automatic WebP conversion via Cloudinary
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Strategic caching for API responses
- **CDN**: Global content delivery via Vercel

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style
4. **Test thoroughly**: Ensure all functionality works
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Provide detailed description of changes

### Development Guidelines
- Follow the existing code structure and naming conventions
- Add comments for complex logic
- Test on multiple devices and browsers
- Ensure accessibility compliance
- Update documentation for new features

## 📝 License

© 2024 Raagsan – Strategic and Consulting Social Enterprise. All rights reserved.

## 📞 Contact & Support

### Raagsan Team
- **Email**: [info@raagsan.com](mailto:info@raagsan.com)
- **Website**: [raagsan.com](https://raagsan.com)
- **Main Site**: [raagsan.com](https://raagsan.com)

### Office Locations
- **Nairobi**: Westlands, Nairobi
- **Hargeisa**: Burj Omar 2, Jigjiga Yar Main road, Hargeisa
- **Mogadishu**: Airport Road, Mogadishu

### Technical Support
For technical issues or questions about the platform:
- Create an issue in this repository
- Contact the development team
- Check the documentation above

---

**Built with ❤️ for Raagsan's mission to empower communities through strategic consulting and storytelling.**#   D e p l o y m e n t   t r i g g e r   -   1 0 / 0 8 / 2 0 2 5   0 1 : 0 5 : 2 8  
 
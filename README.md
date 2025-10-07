# Raagsan Storytelling Platform

A dynamic storytelling platform for hosting multiple projects, datasets, and stories under one unified digital ecosystem.

## Features

- **Dynamic Story Management**: Create and manage multiple projects with their own stories
- **Rich Content Editor**: Block-based editor for text, images, and embeds
- **Cloudinary Integration**: Optimized image hosting with auto WebP conversion
- **Authentication**: Secure admin access for content management
- **Responsive Design**: Mobile-friendly with Raagsan branding

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TailwindCSS
- **Backend**: Next.js API routes + Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Vercel account (for deployment)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd raagsan-platform
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local` with:
   ```env
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ADMIN_TOKEN="your-admin-token"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

3. **Whitelist your IP in MongoDB Atlas**
   - Go to MongoDB Atlas Console
   - Security → Network Access
   - Add your current IP address

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Homepage: http://localhost:3000
   - Admin: http://localhost:3000/login

### Content Management

- **Create Projects**: Use the admin interface at `/admin`
- **Add Stories**: Create stories with rich content blocks
- **Upload Images**: Images are automatically uploaded to Cloudinary
- **Manage Content**: Edit projects and stories through the admin panel

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run import:sepow` - Import SEPOW photos and create gallery
- `npm run seed:sepow:real` - Add real SEPOW content

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Add environment variables in Vercel dashboard

2. **Required Environment Variables**
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production domain)
   - `ADMIN_TOKEN`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Custom domain can be configured in Vercel dashboard

## Project Structure

```
raagsan-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── projects/          # Project pages
│   ├── stories/           # Story pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities
├── models/                # Mongoose models
├── scripts/               # Database scripts
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2024 Raagsan. All rights reserved.

## Contact

- Email: info@raagsan.com
- Website: [raagsan.com](https://raagsan.com)
- Locations: Nairobi · Hargeisa · Mogadishu


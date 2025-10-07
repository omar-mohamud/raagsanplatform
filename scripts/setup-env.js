const fs = require('fs');
const path = require('path');

const envContent = `# Database
MONGODB_URI=mongodb+srv://omar_admin:<db_password>@raagsan-platform.wxh6vsy.mongodb.net/?retryWrites=true&w=majority&appName=Raagsan-platform

# Cloudinary
CLOUDINARY_CLOUD_NAME=dxcjrsrna
CLOUDINARY_API_KEY=274957449627149
CLOUDINARY_API_SECRET=4rLD9otXD54pr_q4iIV6PqET9Cs

# Admin Authentication
ADMIN_USER=admin
ADMIN_PASS=admin123
ADMIN_TOKEN=your-secret-token-here

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000
`;

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with default values');
  console.log('📝 Please update the MONGODB_URI with your actual password');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log('\n🔑 Default admin credentials:');
console.log('Username: admin');
console.log('Password: admin123');
console.log('\n🌐 Make sure to update NEXTAUTH_URL if using a different port');

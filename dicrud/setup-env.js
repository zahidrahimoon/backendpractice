import fs from 'fs';

const envContent = `# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/dicrud

# Server Configuration
PORT=3000
NODE_ENV=development

# Sequelize Configuration
SEQUELIZE_LOG=true
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Database configuration:');
  console.log('   - Host: localhost');
  console.log('   - Port: 5432');
  console.log('   - Database: dicrud');
  console.log('   - User: user');
  console.log('   - Password: pass');
  console.log('\n🚀 You can now run: npm run dev');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📋 Please create a .env file manually with the following content:');
  console.log(envContent);
} 
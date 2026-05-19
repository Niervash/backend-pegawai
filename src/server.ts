import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        
        // Menyingkronkan model dengan database (membuat tabel jika belum ada)
        await sequelize.sync();
        console.log('✅ Database models synchronized.');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();


const app = require('./src/app');
const sequelize = require('./src/config/database');
const port = process.env.PORT || 3000;
const { exec } = require('child_process');

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connexion à Postgres établie !');
        exec('npx sequelize-cli db:migrate', (err, stdout, stderr) => {
            if (err) {
                console.error('Erreur migrations:', stderr);
                process.exit(1);
            }
            console.log('Migrations OK:', stdout);
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        });
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

startServer();
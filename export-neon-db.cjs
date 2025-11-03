const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Database connection details from the URL
const DATABASE_URL = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Parse the URL
const url = new URL(DATABASE_URL);
const host = url.hostname;
const port = url.port || 5432;
const database = url.pathname.slice(1); // Remove leading slash
const username = url.username;
const password = url.password;

// Output file
const outputFile = path.join(__dirname, 'neon-database-export.sql');

console.log('Starting database export...');
console.log(`Host: ${host}`);
console.log(`Database: ${database}`);
console.log(`Output file: ${outputFile}`);

// Set PGPASSWORD environment variable
process.env.PGPASSWORD = password;

// pg_dump command
const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --no-password --verbose --clean --if-exists --create --inserts --column-inserts -f "${outputFile}"`;

console.log('\nExecuting pg_dump...');

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error('Error during export:', error);
        
        // Try alternative method with pg_dump options
        console.log('\nTrying alternative export method...');
        const altCommand = `pg_dump "${DATABASE_URL}" --no-password --verbose --clean --if-exists --inserts -f "${outputFile}"`;
        
        exec(altCommand, (altError, altStdout, altStderr) => {
            if (altError) {
                console.error('Alternative method also failed:', altError);
                console.log('\nTrying simple dump...');
                
                // Simplest method
                const simpleCommand = `pg_dump "${DATABASE_URL}" -f "${outputFile}"`;
                exec(simpleCommand, (simpleError, simpleStdout, simpleStderr) => {
                    if (simpleError) {
                        console.error('All methods failed:', simpleError);
                        console.log('\nYou may need to install PostgreSQL client tools (pg_dump)');
                        console.log('Download from: https://www.postgresql.org/download/');
                    } else {
                        console.log('✅ Database exported successfully using simple method!');
                        console.log(`📁 File saved as: ${outputFile}`);
                        checkFileSize();
                    }
                });
            } else {
                console.log('✅ Database exported successfully using alternative method!');
                console.log(`📁 File saved as: ${outputFile}`);
                checkFileSize();
            }
        });
    } else {
        console.log('✅ Database exported successfully!');
        console.log(`📁 File saved as: ${outputFile}`);
        checkFileSize();
    }
    
    if (stderr) {
        console.log('Export details:', stderr);
    }
});

function checkFileSize() {
    try {
        const stats = fs.statSync(outputFile);
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        console.log(`📊 File size: ${fileSizeInMB} MB`);
        
        if (fileSizeInBytes > 0) {
            console.log('✅ Export completed successfully!');
        } else {
            console.log('⚠️ Warning: Export file is empty');
        }
    } catch (err) {
        console.error('Error checking file size:', err);
    }
}
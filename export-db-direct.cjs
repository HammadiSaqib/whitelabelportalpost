const fs = require('fs');
const path = require('path');

// We'll use the pg library if available, otherwise provide instructions
async function exportDatabase() {
    const DATABASE_URL = 'postgresql://neondb_owner:npg_4zWGX7LqDxde@ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
    
    try {
        // Try to require pg
        const { Client } = require('pg');
        
        console.log('Connecting to Neon database...');
        const client = new Client({
            connectionString: DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        await client.connect();
        console.log('✅ Connected successfully!');
        
        // Get all table names
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        const tables = tablesResult.rows.map(row => row.table_name);
        console.log(`Found ${tables.length} tables:`, tables);
        
        let sqlDump = '-- Neon Database Export\n';
        sqlDump += `-- Generated on: ${new Date().toISOString()}\n`;
        sqlDump += `-- Database: neondb\n\n`;
        
        // Export each table
        for (const tableName of tables) {
            console.log(`Exporting table: ${tableName}`);
            
            // Get table structure
            const structureResult = await client.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position;
            `, [tableName]);
            
            sqlDump += `-- Table: ${tableName}\n`;
            sqlDump += `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n`;
            
            // Create table statement (simplified)
            const columns = structureResult.rows.map(col => {
                let colDef = `"${col.column_name}" ${col.data_type}`;
                if (col.is_nullable === 'NO') colDef += ' NOT NULL';
                if (col.column_default) colDef += ` DEFAULT ${col.column_default}`;
                return colDef;
            }).join(',\n  ');
            
            sqlDump += `CREATE TABLE "${tableName}" (\n  ${columns}\n);\n\n`;
            
            // Get data
            const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
            
            if (dataResult.rows.length > 0) {
                const columnNames = structureResult.rows.map(col => `"${col.column_name}"`).join(', ');
                
                for (const row of dataResult.rows) {
                    const values = Object.values(row).map(val => {
                        if (val === null) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (val instanceof Date) return `'${val.toISOString()}'`;
                        return val;
                    }).join(', ');
                    
                    sqlDump += `INSERT INTO "${tableName}" (${columnNames}) VALUES (${values});\n`;
                }
                sqlDump += '\n';
            }
        }
        
        await client.end();
        
        // Write to file
        const outputFile = path.join(__dirname, 'neon-database-export.sql');
        fs.writeFileSync(outputFile, sqlDump);
        
        const stats = fs.statSync(outputFile);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log('✅ Database exported successfully!');
        console.log(`📁 File saved as: ${outputFile}`);
        console.log(`📊 File size: ${fileSizeInMB} MB`);
        console.log(`📋 Exported ${tables.length} tables`);
        
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('❌ PostgreSQL client library (pg) not found.');
            console.log('Installing pg library...');
            
            const { exec } = require('child_process');
            exec('npm install pg', (installError, stdout, stderr) => {
                if (installError) {
                    console.error('Failed to install pg library:', installError);
                    console.log('\n📋 Manual Installation Instructions:');
                    console.log('1. Run: npm install pg');
                    console.log('2. Then run this script again: node export-db-direct.cjs');
                } else {
                    console.log('✅ pg library installed successfully!');
                    console.log('Please run the script again: node export-db-direct.cjs');
                }
            });
        } else {
            console.error('Database connection error:', error);
        }
    }
}

exportDatabase();
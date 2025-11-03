import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Database connection configuration
const dbConfig = {
  host: 'ep-spring-paper-ae4fqe6n.c-2.us-east-2.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_4zWGX7LqDxde',
  ssl: { rejectUnauthorized: false }
};

async function exportDatabase() {
  const client = new Client(dbConfig);
  let sqlOutput = '';
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Add header comment
    sqlOutput += `-- Database Export from ${dbConfig.database}\n`;
    sqlOutput += `-- Generated on: ${new Date().toISOString()}\n`;
    sqlOutput += `-- Host: ${dbConfig.host}\n\n`;
    
    // Get all tables
    console.log('Fetching table list...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables:`, tables);
    
    // Export each table
    for (const tableName of tables) {
      console.log(`Exporting table: ${tableName}`);
      
      // Get table schema
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [tableName]);
      
      // Create table structure
      sqlOutput += `-- Table: ${tableName}\n`;
      sqlOutput += `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n`;
      
      // Get detailed column information
      const detailedSchemaResult = await client.query(`
        SELECT 
          c.column_name,
          c.data_type,
          c.character_maximum_length,
          c.numeric_precision,
          c.numeric_scale,
          c.is_nullable,
          c.column_default,
          c.udt_name
        FROM information_schema.columns c
        WHERE c.table_name = $1 AND c.table_schema = 'public'
        ORDER BY c.ordinal_position;
      `, [tableName]);
      
      // Construct CREATE TABLE manually
      const columns = detailedSchemaResult.rows.map(col => {
        let dataType = col.data_type;
        
        // Handle specific data types
        if (col.data_type === 'character varying' && col.character_maximum_length) {
          dataType = `varchar(${col.character_maximum_length})`;
        } else if (col.data_type === 'character' && col.character_maximum_length) {
          dataType = `char(${col.character_maximum_length})`;
        } else if (col.data_type === 'numeric' && col.numeric_precision) {
          if (col.numeric_scale) {
            dataType = `numeric(${col.numeric_precision},${col.numeric_scale})`;
          } else {
            dataType = `numeric(${col.numeric_precision})`;
          }
        } else if (col.udt_name) {
          // Use the underlying type name for better compatibility
          dataType = col.udt_name;
        }
        
        let colDef = `  "${col.column_name}" ${dataType}`;
        if (col.is_nullable === 'NO') colDef += ' NOT NULL';
        if (col.column_default) colDef += ` DEFAULT ${col.column_default}`;
        return colDef;
      });
      
      sqlOutput += `CREATE TABLE "${tableName}" (\n`;
      sqlOutput += columns.join(',\n');
      sqlOutput += '\n);\n\n';
      
      // Get table data
      const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
      
      if (dataResult.rows.length > 0) {
        sqlOutput += `-- Data for table: ${tableName}\n`;
        
        const columnNames = Object.keys(dataResult.rows[0]);
        const quotedColumns = columnNames.map(name => `"${name}"`).join(', ');
        
        for (const row of dataResult.rows) {
          const values = columnNames.map(col => {
            const value = row[col];
            if (value === null) return 'NULL';
            if (typeof value === 'string') {
              return `'${value.replace(/'/g, "''")}'`;
            }
            if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
            if (value instanceof Date) return `'${value.toISOString()}'`;
            if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            return value;
          });
          
          sqlOutput += `INSERT INTO "${tableName}" (${quotedColumns}) VALUES (${values.join(', ')});\n`;
        }
        sqlOutput += '\n';
      }
    }
    
    // Get sequences
    console.log('Exporting sequences...');
    const sequencesResult = await client.query(`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public';
    `);
    
    for (const seq of sequencesResult.rows) {
      const seqName = seq.sequence_name;
      const seqValueResult = await client.query(`SELECT last_value FROM "${seqName}"`);
      if (seqValueResult.rows.length > 0) {
        sqlOutput += `-- Sequence: ${seqName}\n`;
        sqlOutput += `SELECT setval('"${seqName}"', ${seqValueResult.rows[0].last_value}, true);\n\n`;
      }
    }
    
    // Write to file
    const filename = `database_export_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
    const filepath = path.join(process.cwd(), filename);
    
    fs.writeFileSync(filepath, sqlOutput, 'utf8');
    
    console.log(`\n✅ Database export completed successfully!`);
    console.log(`📁 File saved as: ${filename}`);
    console.log(`📊 Exported ${tables.length} tables`);
    console.log(`📄 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

// Run the export
exportDatabase().catch(console.error);
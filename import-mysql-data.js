import { db } from './server/db.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function importMySQLData() {
  try {
    console.log('Starting MySQL data import...\n');
    
    const sqlFile = fs.readFileSync('attached_assets/whitelabel_pro_mysql (9)_1761060022060.sql', 'utf8');
    
    const insertRegex = /INSERT INTO `([^`]+)` \(([^)]+)\) VALUES\s*([^;]+);/gi;
    const inserts = [];
    let match;
    
    while ((match = insertRegex.exec(sqlFile)) !== null) {
      const tableName = match[1];
      const columns = match[2].replace(/`/g, '"');
      const valuesSection = match[3];
      
      const valueRows = valuesSection.split(/\),\s*\(/).map((row, index, array) => {
        let cleanRow = row.trim();
        if (index === 0) cleanRow = cleanRow.replace(/^\(/, '');
        if (index === array.length - 1) cleanRow = cleanRow.replace(/\)$/, '');
        return `(${cleanRow})`;
      });
      
      for (const row of valueRows) {
        inserts.push({
          table: tableName,
          columns: columns,
          values: row
        });
      }
    }
    
    console.log(`Found ${inserts.length} total INSERT statements\n`);
    
    const skipTables = ['sessions', 'activities'];
    const filteredInserts = inserts.filter(ins => !skipTables.includes(ins.table));
    console.log(`Filtered to ${filteredInserts.length} statements (skipping: ${skipTables.join(', ')})\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = {};
    
    for (const insert of filteredInserts) {
      try {
        const statement = `INSERT INTO "${insert.table}" (${insert.columns}) VALUES ${insert.values}`;
        await db.execute(sql.raw(statement));
        successCount++;
        
        if (successCount % 20 === 0) {
          console.log(`Progress: ${successCount}/${filteredInserts.length} rows imported...`);
        }
      } catch (error) {
        errorCount++;
        const errorMsg = error.message.substring(0, 100);
        errors[insert.table] = (errors[insert.table] || 0) + 1;
        
        if (errorCount <= 5) {
          console.error(`❌ Error in ${insert.table}: ${errorMsg}`);
        }
      }
    }
    
    console.log('\n=== Import Complete ===');
    console.log(`✅ Successfully imported: ${successCount} rows`);
    console.log(`❌ Failed: ${errorCount} rows`);
    
    if (Object.keys(errors).length > 0) {
      console.log('\nErrors by table:');
      Object.entries(errors).forEach(([table, count]) => {
        console.log(`  ${table}: ${count} errors`);
      });
    }
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

importMySQLData();

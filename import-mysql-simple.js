import { db } from './server/db.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function importCriticalData() {
  try {
    console.log('🚀 Starting simplified MySQL data import...\n');
    
    const sqlFile = fs.readFileSync('attached_assets/whitelabel_pro_mysql (9)_1761060022060.sql', 'utf8');
    
    // Extract only INSERT statements with proper regex
    const lines = sqlFile.split('\n');
    const inserts = [];
    let currentInsert = '';
    let inInsert = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('INSERT INTO')) {
        inInsert = true;
        currentInsert = trimmed;
      } else if (inInsert) {
        currentInsert += ' ' + trimmed;
      }
      
      if (inInsert && trimmed.endsWith(';')) {
        inserts.push(currentInsert);
        currentInsert = '';
        inInsert = false;
      }
    }
    
    console.log(`📊 Found ${inserts.length} INSERT statements\n`);
    
    // Skip sessions and activities
    const filteredInserts = inserts.filter(stmt => 
      !stmt.includes('INSERT INTO `sessions`') && 
      !stmt.includes('INSERT INTO `activities`')
    );
    
    console.log(`✅ Filtered to ${filteredInserts.length} statements (skipping sessions and activities)\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const errorsByTable = {};
    
    for (let i = 0; i < filteredInserts.length; i++) {
      const statement = filteredInserts[i].replace(/`/g, '"');
      
      try {
        await db.execute(sql.raw(statement));
        successCount++;
        
        if ((i + 1) % 50 === 0) {
          console.log(`⏳ Progress: ${i + 1}/${filteredInserts.length} (${Math.round((i + 1) / filteredInserts.length * 100)}%)`);
        }
      } catch (error) {
        errorCount++;
        const tableMatch = statement.match(/INSERT INTO "([^"]+)"/);
        const tableName = tableMatch ? tableMatch[1] : 'unknown';
        errorsByTable[tableName] = (errorsByTable[tableName] || 0) + 1;
        
        if (errorCount <= 3) {
          console.error(`❌ Error in ${tableName}: ${error.message.substring(0, 80)}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 IMPORT COMPLETE');
    console.log('='.repeat(50));
    console.log(`✅ Successfully imported: ${successCount} rows`);
    console.log(`❌ Failed: ${errorCount} rows`);
    
    if (Object.keys(errorsByTable).length > 0) {
      console.log('\n📋 Errors by table:');
      Object.entries(errorsByTable)
        .sort((a, b) => b[1] - a[1])
        .forEach(([table, count]) => {
          console.log(`  • ${table}: ${count} errors`);
        });
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

importCriticalData();

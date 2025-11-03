import { db } from './server/db.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

// Convert MySQL boolean values (0/1) to PostgreSQL (FALSE/TRUE)
function convertBooleans(statement) {
  // Match INSERT statements and convert boolean values
  // Common boolean columns: is_active, is_visible, is_public, etc.
  let converted = statement;
  
  // Convert tinyint(1) values in VALUE clauses
  // Look for patterns like ",0,", ",1," in VALUES sections
  converted = converted.replace(/,\s*0\s*,/g, ', FALSE,');
  converted = converted.replace(/,\s*1\s*,/g, ', TRUE,');
  converted = converted.replace(/\(\s*0\s*,/g, '(FALSE,');
  converted = converted.replace(/\(\s*1\s*,/g, '(TRUE,');
  converted = converted.replace(/,\s*0\s*\)/g, ', FALSE)');
  converted = converted.replace(/,\s*1\s*\)/g, ', TRUE)');
  
  return converted;
}

async function importWithConversion() {
  try {
    console.log('🚀 Starting MySQL → PostgreSQL data import with type conversion...\n');
    
    const sqlFile = fs.readFileSync('attached_assets/whitelabel_pro_mysql (9)_1761060022060.sql', 'utf8');
    
    // Parse INSERT statements properly
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
    
    // Filter out problematic tables
    const skipTables = ['sessions', 'activities'];
    const filteredInserts = inserts.filter(stmt => {
      const tableMatch = stmt.match(/INSERT INTO `([^`]+)`/);
      const tableName = tableMatch ? tableMatch[1] : '';
      return !skipTables.includes(tableName);
    });
    
    console.log(`✅ Processing ${filteredInserts.length} statements\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const successByTable = {};
    const errorsByTable = {};
    
    for (let i = 0; i < filteredInserts.length; i++) {
      let statement = filteredInserts[i];
      
      // Extract table name for reporting
      const tableMatch = statement.match(/INSERT INTO `([^`]+)`/);
      const tableName = tableMatch ? tableMatch[1] : 'unknown';
      
      // Convert MySQL syntax to PostgreSQL
      statement = statement.replace(/`/g, '"');  // Backticks to quotes
      statement = convertBooleans(statement);     // Convert 0/1 to FALSE/TRUE
      
      try {
        await db.execute(sql.raw(statement));
        successCount++;
        successByTable[tableName] = (successByTable[tableName] || 0) + 1;
        
        if ((i + 1) % 10 === 0) {
          console.log(`⏳ Progress: ${i + 1}/${filteredInserts.length} (${Math.round((i + 1) / filteredInserts.length * 100)}%)`);
        }
      } catch (error) {
        errorCount++;
        errorsByTable[tableName] = errorsByTable[tableName] || [];
        errorsByTable[tableName].push(error.message.substring(0, 100));
        
        if (errorCount <= 5) {
          console.error(`❌ Error in "${tableName}": ${error.message.substring(0, 100)}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📈 IMPORT COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Successfully imported: ${successCount} rows across ${Object.keys(successByTable).length} tables`);
    console.log(`❌ Failed: ${errorCount} rows`);
    
    if (Object.keys(successByTable).length > 0) {
      console.log('\n✨ Successfully imported data:');
      Object.entries(successByTable)
        .sort((a, b) => b[1] - a[1])
        .forEach(([table, count]) => {
          console.log(`  • ${table}: ${count} rows`);
        });
    }
    
    if (Object.keys(errorsByTable).length > 0) {
      console.log('\n⚠️  Tables with errors:');
      Object.entries(errorsByTable)
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([table, errors]) => {
          console.log(`  • ${table}: ${errors.length} errors`);
          if (errors.length > 0) {
            console.log(`    └─ ${errors[0]}`);
          }
        });
    }
    
    console.log('\n📝 Note: Foreign key errors are expected if referenced rows don\'t exist yet.');
    console.log('Run this script multiple times to resolve dependency issues.\n');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

importWithConversion();

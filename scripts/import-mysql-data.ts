import postgres from 'postgres';
import * as fs from 'fs';

// Build connection string from PG credentials
const connectionString = process.env.PGHOST && process.env.PGUSER
  ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`
  : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database credentials not found');
}

// Create PostgreSQL connection
const sql = postgres(connectionString);

// Read the MySQL dump file
console.log('📖 Reading MySQL dump file...\n');
const sqlContent = fs.readFileSync('whitelabel_pro_mysql.sql', 'utf-8');

// Extract INSERT statements
function extractInserts(sqlContent: string): Map<string, string[]> {
  const tableInserts = new Map<string, string[]>();
  
  // Match INSERT INTO statements (handle multi-line)
  const insertRegex = /INSERT INTO `(\w+)`[^;]+;/gis;
  let match;
  
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    let insertStatement = match[0];
    
    // Convert MySQL syntax to PostgreSQL
    insertStatement = insertStatement.replace(/`/g, '');
    
    if (!tableInserts.has(tableName)) {
      tableInserts.set(tableName, []);
    }
    tableInserts.get(tableName)!.push(insertStatement);
  }
  
  return tableInserts;
}

// Table dependency order
const tableOrder = [
  'users', 'plans', 'white_labels', 'affiliates', 'categories',
  'products', 'user_preferences', 'password_reset_tokens', 'payment_accounts',
  'subscriptions', 'commissions', 'referral_commissions', 'affiliate_payments',
  'purchase_history', 'activities', 'end_user_activities', 'user_sessions',
  'domain_user_sessions', 'referral_tracking', 'affiliate_plan_visibility',
  'integrations', 'integration_logs', 'ai_generated_content',
  'ai_recommendations', 'ai_content_optimizations', 'referral_links',
  'referral_signups', 'referral_clicks', 'plan_products', 'plan_categories',
  'link_meta_images', 'templates', 'themes', 'user_theme_preferences',
  'client_template_customizations', 'platform_settings', 'analytics_events',
  'analytics_metrics', 'announcements', 'announcement_likes',
  'announcement_comments', 'announcement_shares', 'announcement_analytics',
  'landing_pages', 'custom_domains', 'nmi_credentials'
];

async function importData() {
  console.log('🚀 Starting data import from MySQL dump...\n');
  
  const tableInserts = extractInserts(sqlContent);
  console.log(`📊 Found INSERT statements for ${tableInserts.size} tables\n`);
  
  let totalImported = 0;
  
  for (const tableName of tableOrder) {
    const inserts = tableInserts.get(tableName);
    if (!inserts || inserts.length === 0) {
      continue;
    }
    
    console.log(`📥 Importing ${inserts.length} records into ${tableName}...`);
    
    try {
      for (const insertStmt of inserts) {
        await sql.unsafe(insertStmt);
        totalImported++;
      }
      console.log(`✅ ${tableName} completed`);
    } catch (error: any) {
      console.error(`❌ Error in ${tableName}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 Successfully imported ${totalImported} INSERT statements\n`);
  
  // Update sequences
  console.log('🔄 Updating PostgreSQL sequences...\n');
  
  const sequenceTables = tableOrder.filter(t => t !== 'users' && t !== 'sessions');
  
  for (const table of sequenceTables) {
    try {
      await sql.unsafe(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1))`);
      console.log(`✅ ${table}`);
    } catch (error: any) {
      // Ignore tables without sequences
    }
  }
  
  console.log('\n✨ Migration complete! Closing connection...');
  await sql.end();
  process.exit(0);
}

importData().catch((error) => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});

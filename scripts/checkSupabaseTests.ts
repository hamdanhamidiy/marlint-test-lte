import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach((line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/(^"|"$)/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMarlinsTests() {
  const { data: tests, error } = await supabase
    .from('marlint_tests')
    .select('id, test_number, test_name, total_questions, duration, passing_grade')
    .order('test_number', { ascending: true });

  if (error) {
    console.error('Error querying marlint_tests:', error);
    return;
  }

  console.log('Current marlint_tests in Supabase:');
  console.table(tests);

  const { data: attempts } = await supabase
    .from('test_attempts')
    .select('id, test_number, status, total_questions, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('\nRecent test_attempts:');
  console.table(attempts);
}

checkMarlinsTests();

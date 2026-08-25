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

async function updateMarlinsTestsTo60() {
  console.log('Updating all 10 marlint_tests rows in Supabase to total_questions: 60...');
  
  const standardComposition = {
    grammar: 15,
    vocabulary: 15,
    time_and_numbers: 10,
    reading_comprehension: 10,
    listening_comprehension: 10,
  };

  const { data, error } = await supabase
    .from('marlint_tests')
    .update({
      total_questions: 60,
      duration: 60,
      passing_grade: 70,
      question_composition: standardComposition,
    })
    .gte('test_number', 1)
    .select();

  if (error) {
    console.error('Error updating marlint_tests:', error);
  } else {
    console.log('Successfully updated marlint_tests rows to 60 questions:');
    console.table(data.map(d => ({
      test_number: d.test_number,
      test_name: d.test_name,
      total_questions: d.total_questions,
      duration: d.duration
    })));
  }
}

updateMarlinsTestsTo60();

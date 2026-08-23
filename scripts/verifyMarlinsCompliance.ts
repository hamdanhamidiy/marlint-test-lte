import {
  MARLINS_60_STANDARD_QUESTIONS,
  MARLINS_TEST_2_STANDARD_QUESTIONS,
  MARLINS_TEST_3_STANDARD_QUESTIONS,
  MARLINS_TEST_4_STANDARD_QUESTIONS,
  MARLINS_TEST_5_STANDARD_QUESTIONS,
  MARLINS_TEST_6_STANDARD_QUESTIONS,
  MARLINS_TEST_7_STANDARD_QUESTIONS,
  MARLINS_TEST_8_STANDARD_QUESTIONS,
  MARLINS_TEST_9_STANDARD_QUESTIONS,
  MARLINS_TEST_10_STANDARD_QUESTIONS,
} from '../src/lib/marlinsQuestionBank';

const allTestBanks = [
  { name: 'Marlins Test 1 (Cruise & Maritime English)', bank: MARLINS_60_STANDARD_QUESTIONS },
  { name: 'Marlins Test 2 (Deck & Engine Operations)', bank: MARLINS_TEST_2_STANDARD_QUESTIONS },
  { name: 'Marlins Test 3 (Bridge Watchkeeping & COLREGs)', bank: MARLINS_TEST_3_STANDARD_QUESTIONS },
  { name: 'Marlins Test 4 (Tanker & IMDG Operations)', bank: MARLINS_TEST_4_STANDARD_QUESTIONS },
  { name: 'Marlins Test 5 (Offshore & Dynamic Positioning)', bank: MARLINS_TEST_5_STANDARD_QUESTIONS },
  { name: 'Marlins Test 6 (Container, Bulk & Cyber Risk)', bank: MARLINS_TEST_6_STANDARD_QUESTIONS },
  { name: 'Marlins Test 7 (Ro-Ro Passenger & Polar Code)', bank: MARLINS_TEST_7_STANDARD_QUESTIONS },
  { name: 'Marlins Test 8 (Heavy Lift & Salvage Towage)', bank: MARLINS_TEST_8_STANDARD_QUESTIONS },
  { name: 'Marlins Test 9 (Autonomous MASS & S-100/GMDSS)', bank: MARLINS_TEST_9_STANDARD_QUESTIONS },
  { name: 'Marlins Test 10 (Master & Chief Eng Executive)', bank: MARLINS_TEST_10_STANDARD_QUESTIONS },
];

console.log('================================================================');
console.log('       AUDIT KUALITAS & STANDARISASI BANK SOAL MARLINS TEST      ');
console.log('================================================================\n');

let grandTotalQuestions = 0;
const allQuestionIds = new Set<string>();
const allQuestionTexts = new Set<string>();
let optionMismatchErrors = 0;

allTestBanks.forEach((test, idx) => {
  const bank = test.bank;
  console.log(`[PAKET #${idx + 1}] ${test.name}:`);
  console.log(`  - Total Butir Soal: ${bank.length} (Target: 60)`);

  const categoryBreakdown: Record<string, number> = {};
  bank.forEach((q) => {
    categoryBreakdown[q.category] = (categoryBreakdown[q.category] || 0) + 1;

    // Check duplicate ID
    if (allQuestionIds.has(q.id)) {
      console.error(`  ❌ Duplicate Question ID found: ${q.id}`);
    }
    allQuestionIds.add(q.id);

    // Check duplicate text
    const cleanText = q.question_text.trim().toLowerCase();
    if (allQuestionTexts.has(cleanText)) {
      console.error(`  ❌ Duplicate Question Text found: "${q.question_text}"`);
    }
    allQuestionTexts.add(cleanText);

    // Validate options match correct_answer for MC / audio / gap_fill / image_choice
    if (q.question_type === 'image_choice' && q.question_data?.option_labels) {
      const found = q.question_data.option_labels.some((lbl: string) => lbl.trim() === q.correct_answer?.trim());
      if (!found) {
        console.warn(`  ⚠️ Option mismatch for ID ${q.id}: Answer "${q.correct_answer}" not in option_labels.`);
        optionMismatchErrors++;
      }
    } else if (q.options && q.options.length > 0 && q.question_type !== 'paragraph_title_match') {
      const found = q.options.some((opt) => opt.trim() === q.correct_answer?.trim());
      if (!found && q.question_type !== 'multiple_choice_multiple') {
        console.warn(`  ⚠️ Option mismatch for ID ${q.id}: Answer "${q.correct_answer}" not in options.`);
        optionMismatchErrors++;
      }
    }
  });

  console.log(`  - Distribusi Standar Kategori:`);
  console.log(`      * Grammar: ${categoryBreakdown['grammar'] || 0} soal`);
  console.log(`      * Vocabulary: ${categoryBreakdown['vocabulary'] || 0} soal`);
  console.log(`      * Time and Numbers: ${categoryBreakdown['time_and_numbers'] || 0} soal`);
  console.log(`      * Reading Comprehension: ${categoryBreakdown['reading_comprehension'] || 0} soal`);
  console.log(`      * Listening Comprehension: ${categoryBreakdown['listening_comprehension'] || 0} soal`);

  grandTotalQuestions += bank.length;
});

console.log('\n================================================================');
console.log('                    REKAPITULASI HASIL AUDIT                    ');
console.log('================================================================');
console.log(`Total Soal Seluruh Paket : ${grandTotalQuestions} Butir Soal`);
console.log(`Total ID Unik           : ${allQuestionIds.size} (${allQuestionIds.size === 600 ? '✅ 100% UNIK' : '❌ ADA DUPLIKAT'})`);
console.log(`Total Teks Soal Unik     : ${allQuestionTexts.size} (${allQuestionTexts.size === 600 ? '✅ 100% UNIK' : '❌ ADA DUPLIKAT'})`);
console.log(`Option Mismatches        : ${optionMismatchErrors} (${optionMismatchErrors === 0 ? '✅ SEMPURNA' : '⚠️ PERLU PERBAIKAN'})`);
console.log('================================================================');

/**
 * QRIS (Quick Response Code Indonesian Standard) Dynamic Amount Generator
 * Sesuai Standar Bank Indonesia & ASPI (EMVCo QR Code Specification)
 */

/**
 * Menghitung Checksum CRC-16 / CCITT-FALSE (Polynomial 0x1021, Initial 0xFFFF)
 */
export function calculateCRC16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Template QRIS Statis Standar Resmi (Default Marlin Test / LTE Cruise Training Center)
 * Merchant: LTE CRUISE TRAINING CENTER (NMID: ID1024358901234)
 */
export const DEFAULT_STATIC_QRIS =
  '00020101021126670016ID.CO.QRIS.WWW01189360050300000889900215ID10243589012340303UME51440014ID.DANA.WWW01189360091100210088990208123456780303UME5204581253033605802ID5924LTE CRUISE MARLINS TEST6008DENPASAR61058023462070703A016304A1B2';

/**
 * Mengubah string QRIS Statis menjadi QRIS Dinamis dengan Nominal Otomatis
 * @param staticQris String QRIS statis (hasil scan QRIS toko/merchant Anda)
 * @param amount Nominal tagihan (angka bulat dalam Rupiah, misal 49000)
 * @param taxFee Optional biaya layanan / tax (jika ada)
 * @returns String QRIS Dinamis lengkap dengan CRC16 yang valid
 */
export function convertStaticToDynamicQris(
  staticQris: string,
  amount: number,
  taxFee: number = 0
): string {
  if (!staticQris || typeof staticQris !== 'string') {
    staticQris = DEFAULT_STATIC_QRIS;
  }

  let raw = staticQris.trim();

  // 1. Validasi awal panjang dan header QRIS (harus diawali 000201)
  if (!raw.startsWith('000201')) {
    raw = DEFAULT_STATIC_QRIS;
  }

  // 2. Hapus CRC lama (8 karakter terakhir jika berformat 6304XXXX)
  if (raw.includes('6304')) {
    const last63Index = raw.lastIndexOf('6304');
    raw = raw.substring(0, last63Index);
  }

  // 3. Ubah Tag 01 (Point of Initiation Method) dari 11 (Static) menjadi 12 (Dynamic)
  // Format Tag 01: '010211' -> ubah jadi '010212'
  if (raw.includes('010211')) {
    raw = raw.replace('010211', '010212');
  } else if (!raw.includes('010212')) {
    // Jika belum ada Tag 01, sisipkan setelah 000201
    raw = raw.replace('000201', '000201010212');
  }

  // 4. Hapus Tag 54 lama jika sebelumnya sudah ada (54 = Transaction Amount)
  // Regex mencari Tag 54 + 2 digit panjang + digit nominal
  raw = raw.replace(/54\d{2}\d+(\.\d+)?/g, '');

  // 5. Hapus Tag 55/56/57 lama jika ada
  raw = raw.replace(/55\d{2}\d+/g, '');

  // 6. Buat payload Tag 54 baru dengan nominal
  const totalAmount = Math.round(amount + taxFee);
  const amountStr = totalAmount.toString();
  const amountLength = amountStr.length.toString().padStart(2, '0');
  const tag54 = `54${amountLength}${amountStr}`;

  // 7. Sisipkan Tag 54 sebelum Tag 58 (Country Code '5802ID')
  if (raw.includes('5802ID') || raw.includes('5802id')) {
    const splitIndex = raw.toUpperCase().indexOf('5802ID');
    raw = raw.slice(0, splitIndex) + tag54 + raw.slice(splitIndex);
  } else if (raw.includes('5303360')) {
    // Alternatif: setelah Tag 53 (Currency IDR = 360)
    const splitIndex = raw.indexOf('5303360') + 7;
    raw = raw.slice(0, splitIndex) + tag54 + raw.slice(splitIndex);
  } else {
    // Fallback: tambahkan sebelum Tag 63
    raw = raw + tag54;
  }

  // 8. Tambahkan Header Tag 63 (CRC Tag = '6304')
  const payloadForChecksum = raw + '6304';

  // 9. Hitung CRC16 CCITT
  const crc = calculateCRC16(payloadForChecksum);

  // 10. Gabungkan menjadi QRIS Dinamis Final yang Valid
  return payloadForChecksum + crc;
}

/**
 * Ekstrak informasi merchant dari string QRIS
 */
export function parseQrisMerchantInfo(qrisString: string): {
  merchantName: string;
  merchantCity: string;
  postalCode: string;
  isDynamic: boolean;
} {
  try {
    const isDynamic = qrisString.includes('010212');
    
    // Tag 59: Merchant Name
    const tag59Match = qrisString.match(/59(\d{2})([A-Za-z0-9\s\.\,\-\_]+)/);
    let merchantName = 'LTE CRUISE TRAINING CENTER';
    if (tag59Match) {
      const len = parseInt(tag59Match[1], 10);
      merchantName = tag59Match[2].substring(0, len).trim();
    }

    // Tag 60: Merchant City
    const tag60Match = qrisString.match(/60(\d{2})([A-Za-z0-9\s]+)/);
    let merchantCity = 'Denpasar / Surabaya';
    if (tag60Match) {
      const len = parseInt(tag60Match[1], 10);
      merchantCity = tag60Match[2].substring(0, len).trim();
    }

    return {
      merchantName,
      merchantCity,
      postalCode: '80234',
      isDynamic,
    };
  } catch {
    return {
      merchantName: 'LTE CRUISE TRAINING CENTER',
      merchantCity: 'Indonesia',
      postalCode: '80234',
      isDynamic: false,
    };
  }
}

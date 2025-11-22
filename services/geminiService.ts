import { GoogleGenAI } from "@google/genai";

// Initialize AI with API Key from environment
// Note: In a real production app, strict error handling for missing keys is needed.
// For this demo, we ensure the app doesn't crash if the key is missing.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateLeaveAnalysis = async (
  employeeName: string,
  role: string,
  leaveType: string,
  duration: number,
  reason: string,
  historyCount: number
): Promise<string> => {
  if (!ai) {
    return "Fitur AI tidak tersedia (API Key tidak ditemukan).";
  }

  try {
    const model = ai.models;
    const prompt = `
      Sebagai asisten HRD yang profesional, berikan analisis singkat (maksimal 2 kalimat) 
      untuk pengajuan cuti berikut:
      Nama: ${employeeName}
      Jabatan: ${role}
      Jenis Cuti: ${leaveType}
      Durasi: ${duration} hari
      Alasan: ${reason}
      Riwayat Cuti Tahun Ini: ${historyCount} hari digunakan.
      
      Berikan rekomendasi apakah ini wajar atau perlu peninjauan lebih lanjut, dengan nada sopan.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Tidak ada respons dari AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Gagal menganalisis data cuti.";
  }
};

export const generateRejectionMessage = async (
    employeeName: string,
    reason: string
): Promise<string> => {
    if (!ai) return "Maaf, pengajuan cuti Anda belum dapat disetujui saat ini.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Buatkan pesan penolakan cuti yang sopan, empatik, namun tegas untuk karyawan bernama ${employeeName}. Alasan penolakan: ${reason}. Maksimal 30 kata.`
        });
        return response.text || "Maaf, pengajuan Anda ditolak.";
    } catch (e) {
        return "Maaf, pengajuan Anda ditolak.";
    }
}

/**
 * Data Service & Master Item List for Electrical Warehouse System
 * Source: Google Sheets - à¸à¸¥à¸±à¸à¸à¸±à¸ªà¸à¸¸ à¸à¸à¸.à¸à¸à¸ª.à¸à¸.2
 */

const DEMO_IMAGES = {
    "1000110001": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸à¸­à¸,à¸à¸­à¸à¸à¸£à¸µà¸à¸­à¸±à¸à¹à¸£à¸(à¸à¸­à¸£.)à¹à¸à¸à¸ªà¸à¸±à¸à¹à¸£à¸à¸ªà¸¹à¸ 100X100X2,500 à¸¡à¸¡.jpg",
    "1000110003": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸à¸­à¸,à¸à¸­à¸à¸à¸£à¸µà¸à¸­à¸±à¸à¹à¸£à¸ (à¸à¸­à¸£.)à¹à¸à¸à¸ªà¸à¸±à¸ (à¸ªà¸³à¸«à¸£à¸±à¸à¹à¸à¹à¸²à¸à¸¥à¸²à¸¢à¸ªà¸²à¸¢) 120X120X2,000 à¸¡à¸¡..png",
    "1010000100": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¹à¸«à¸¥à¹à¸à¸à¸²à¸ à¸£à¸±à¸à¸ªà¸²à¸¢à¸¥à¹à¸­à¸à¹à¸²à¸à¸²à¸à¹à¸à¹à¸ à¸à¸à¸²à¸ 65x65x6 à¸¡à¸¡. à¸¢à¸²à¸§ 2,250 à¸¡à¸¡. à¹à¸¥à¸° 2,100 à¸¡à¸¡..jpg",
    "1010100000": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸¥à¸§à¸à¹à¸«à¸¥à¹à¸à¸à¸¥à¸¡ à¹à¸ªà¹à¸à¸à¹à¸²à¸à¸¨à¸¹à¸à¸¢à¹à¸à¸¥à¸²à¸ 4.0 à¸¡à¸¡.à¹à¸ªà¹à¸à¹à¸à¸µà¸¢à¸§ à¸¡à¸­à¸.71.png",
    "1010100002": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸¥à¸§à¸à¹à¸«à¸¥à¹à¸à¸à¸µà¹à¸à¸¥à¸µà¸¢à¸§ 25 à¸.à¸¡à¸¡. à¸¡à¸­à¸.404.png",
    "1010110200": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x130 à¸¡à¸¡..jpg",
    "1040030012": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 65 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K.jfif",
    "1040030013": "à¸ à¸²à¸à¸­à¸¸à¸à¸à¸£à¸à¹/à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 100 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K.jpg",
    "1040000002": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%231e293b'/><rect x='75' y='40' width='50' height='120' rx='10' fill='%2310b981' opacity='0.8'/><path d='M65 60 H135 M65 90 H135 M65 120 H135' stroke='%2306b6d4' stroke-width='6'/><text x='100' y='185' font-family='sans-serif' font-size='11' font-weight='bold' fill='%2394a3b8' text-anchor='middle'>LIGHTNING ARRESTER 24kV</text></svg>"
};

const MASTER_ITEMS = [
    { code: "1000110001", name: "à¸à¸­à¸,à¸à¸­à¸à¸à¸£à¸µà¸à¸­à¸±à¸à¹à¸£à¸(à¸à¸­à¸£.)à¹à¸à¸à¸ªà¸à¸±à¸à¹à¸£à¸à¸ªà¸¹à¸ 100X100X2,500 à¸¡à¸¡.", standard: 15, unit: "à¸à¹à¸­à¸", category: "à¹à¸ªà¸²à¹à¸¥à¸°à¸à¸­à¸" },
    { code: "1000110003", name: "à¸à¸­à¸,à¸à¸­à¸à¸à¸£à¸µà¸à¸­à¸±à¸à¹à¸£à¸ (à¸à¸­à¸£.)à¹à¸à¸à¸ªà¸à¸±à¸ (à¸ªà¸³à¸«à¸£à¸±à¸à¹à¸à¹à¸²à¸à¸¥à¸²à¸¢à¸ªà¸²à¸¢) 120X120X2,000 à¸¡à¸¡.", standard: 9, unit: "à¸à¹à¸­à¸", category: "à¹à¸ªà¸²à¹à¸¥à¸°à¸à¸­à¸" },
    { code: "1010000100", name: "à¹à¸«à¸¥à¹à¸à¸à¸²à¸ à¸£à¸±à¸à¸ªà¸²à¸¢à¸¥à¹à¸­à¸à¹à¸²à¸à¸²à¸à¹à¸à¹à¸ à¸à¸à¸²à¸ 65x65x6 à¸¡à¸¡. à¸¢à¸²à¸§ 2,250 à¸¡à¸¡. à¹à¸¥à¸° 2,100 à¸¡à¸¡.", standard: 5, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸«à¸¥à¹à¸à¹à¸¥à¸°à¸¢à¸¶à¸à¸ªà¸²à¸¢" },
    { code: "1010100000", name: "à¸¥à¸§à¸à¹à¸«à¸¥à¹à¸à¸à¸¥à¸¡ à¹à¸ªà¹à¸à¸à¹à¸²à¸à¸¨à¸¹à¸à¸¢à¹à¸à¸¥à¸²à¸ 4.0 à¸¡à¸¡.à¹à¸ªà¹à¸à¹à¸à¸µà¸¢à¸§ à¸¡à¸­à¸.71", standard: 12, unit: "à¸à¸.", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸«à¸¥à¹à¸à¹à¸¥à¸°à¸¢à¸¶à¸à¸ªà¸²à¸¢" },
    { code: "1010100002", name: "à¸¥à¸§à¸à¹à¸«à¸¥à¹à¸à¸à¸µà¹à¸à¸¥à¸µà¸¢à¸§ 25 à¸.à¸¡à¸¡. à¸¡à¸­à¸.404", standard: 20, unit: "à¹à¸¡à¸à¸£", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸«à¸¥à¹à¸à¹à¸¥à¸°à¸¢à¸¶à¸à¸ªà¸²à¸¢" },
    { code: "1010110200", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x130 à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110201", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x170 à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110202", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x200 à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110203", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x250 à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110204", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x300 à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110205", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x350 à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110206", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x400 à¸¡à¸¡.", standard: 15, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010110207", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§ à¹à¸­à¹à¸¡ 16x450 à¸¡à¸¡.", standard: 15, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010120000", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¸à¸¥à¸­à¸ à¹à¸­à¹à¸¡ 16x400 à¸¡à¸¡.", standard: 10, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010120001", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¸à¸¥à¸­à¸ à¹à¸­à¹à¸¡ 16x450 à¸¡à¸¡.", standard: 10, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010120002", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¸à¸¥à¸­à¸ à¹à¸­à¹à¸¡ 16x500 à¸¡à¸¡.", standard: 10, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010130001", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¸«à¹à¸§à¸à¸à¸¥à¸¡ à¹à¸­à¹à¸¡ 16x450 à¸¡à¸¡.", standard: 15, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010130002", name: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¸«à¹à¸§à¸à¸à¸¥à¸¡ à¹à¸­à¹à¸¡ 16x500 à¸¡à¸¡.", standard: 15, unit: "à¸à¸¸à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010180001", name: "à¸à¸±à¸à¸£à¸¹à¸à¸«à¹à¸§à¸ à¹à¸­à¹à¸¡ 16 à¸à¸´à¸ 582", standard: 10, unit: "à¸­à¸±à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010180100", name: "à¹à¸«à¸§à¸à¸£à¸­à¸à¹à¸à¸à¹à¸£à¸µà¸¢à¸ à¸à¸£à¸°à¹à¸ à¸à¸à¸±à¸à¸¸à¸£à¸±à¸ªà¸à¸à¸²à¸à¹à¸«à¸à¹ 52x52x4.5 à¸¡à¸¡.à¸£à¸¹ 18 à¸¡à¸¡.", standard: 30, unit: "à¸­à¸±à¸", category: "à¸ªà¸¥à¸±à¸à¹à¸à¸¥à¸µà¸¢à¸§à¹à¸¥à¸°à¸à¸±à¸" },
    { code: "1010200001", name: "à¹à¸«à¸¥à¹à¸à¸à¸£à¸°à¸à¸±à¸à¹à¸¡à¹à¸à¸­à¸ à¸à¸à¸²à¸ 30x6 à¸¡à¸¡. à¸¢à¸²à¸§ 760 à¸¡à¸¡.", standard: 10, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸«à¸¥à¹à¸à¹à¸¥à¸°à¸¢à¸¶à¸à¸ªà¸²à¸¢" },
    { code: "1010230000", name: "à¸¢à¸¹à¹à¸à¸¥à¹à¸¡à¸à¹ à¸ªà¸¥à¸±à¸ 1 à¸à¸±à¸§ à¹à¸­à¹à¸¡ 8 (à¹à¸§à¸£à¹ à¹à¸£à¹à¸ à¸à¸¥à¸´à¹à¸)", standard: 20, unit: "à¸à¸¸à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1010230012", name: "CLAMP, DOUBLE BOLTS, ST. WIRE 25 SQ.MM.", standard: 20, unit: "à¸à¸¸à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1010230001", name: "à¸¢à¸¹à¹à¸à¸¥à¹à¸¡à¸à¹ à¸ªà¸¥à¸±à¸à¸à¸¹à¹ à¹à¸­à¹à¸¡ 16 (à¹à¸§à¸£à¹ à¹à¸£à¹à¸ à¸à¸¥à¸´à¹à¸)", standard: 20, unit: "à¸à¸¸à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020010007", name: "à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡à¹à¸à¸¥à¸·à¸­à¸¢ 185 à¸.à¸¡à¸¡. à¸¡à¸­à¸.85", standard: 100, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020020002", name: "à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡à¹à¸à¸à¹à¸«à¸¥à¹à¸ 50/8 à¸.à¸¡à¸¡. à¸¡à¸­à¸.86", standard: 100, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020050000", name: "à¹à¸à¹à¸à¸´à¸¥à¸­à¸²à¸à¸²à¸¨ à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 22 à¹à¸à¸§à¸µ 1x50 à¸.à¸¡à¸¡.", standard: 100, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020050004", name: "à¹à¸à¹à¸à¸´à¸¥à¸­à¸²à¸à¸²à¸¨ à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 22 à¹à¸à¸§à¸µ 1x185 à¸.à¸¡à¸¡.", standard: 100, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020070002", name: "à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡à¸à¸µà¹à¸à¸¥à¸µà¸¢à¸§à¸à¸à¸´à¸à¸­à¸±à¸à¹à¸à¹à¸à¸«à¸¸à¹à¸¡à¸à¸à¸§à¸ à¸à¸µà¸§à¸µà¸à¸µ 750V 50 à¸.à¸¡à¸¡.", standard: 100, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020070004", name: "à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡à¸à¸µà¹à¸à¸¥à¸µà¸¢à¸§à¸à¸à¸´à¸à¸­à¸±à¸à¹à¸à¹à¸à¸«à¸¸à¹à¸¡à¸à¸à¸§à¸ à¸à¸µà¸§à¸µà¸à¸µ 750V 95 à¸.à¸¡à¸¡.", standard: 100, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020080501", name: "à¸ªà¸²à¸¢à¸à¸­à¸à¹à¸à¸à¸à¸µà¹à¸à¸¥à¸µà¸¢à¸§à¸«à¸¸à¹à¸¡à¸à¸à¸§à¸ XLPE/PVC 2x10 à¸.à¸¡à¸¡ 600V", standard: 42, unit: "à¹à¸¡à¸à¸£", category: "à¸ªà¸²à¸¢à¹à¸à¸à¹à¸²à¹à¸¥à¸°à¹à¸à¹à¸à¸´à¸¥" },
    { code: "1020180001", name: "à¹à¸à¸à¹à¸à¸à¹à¸² à¸à¸µà¸§à¸µà¸à¸µ à¹à¸à¹à¸ à¸²à¸¢à¸à¸­à¸ 0.18x19x10,000 à¸¡à¸¡. à¸¡à¸­à¸.386", standard: 50, unit: "à¸¡à¹à¸§à¸", category: "à¹à¸à¸à¹à¸¥à¸°à¸à¸à¸§à¸" },
    { code: "1020180008", name: "EPR, HIGH-VOLTAGE INSULATING TAPE", standard: 30, unit: "à¸¡à¹à¸§à¸", category: "à¹à¸à¸à¹à¸¥à¸°à¸à¸à¸§à¸" },
    { code: "1020200000", name: "à¸¥à¸§à¸à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡à¹à¸à¸ 1x10 à¸¡à¸¡.", standard: 20, unit: "à¸à¸.", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020200002", name: "à¸¥à¸§à¸à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡à¸à¸¥à¸¡ 4.0 à¸¡à¸¡.", standard: 20, unit: "à¸à¸.", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020200003", name: "COVERED TIE WIRE AL 4.0 MM.", standard: 20, unit: "à¹à¸¡à¸à¸£", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020210107", name: "à¸à¸£à¸µà¸à¸­à¸£à¹à¸¡à¹à¸¥à¸à¹à¸à¸²à¸£à¹à¸ à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 185 à¸.à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020260202", name: "PREFORMED D/E, SAC 22kV 50sq.mm. 21.80mm", standard: 20, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020260205", name: "PREFORMED D/E, SAC 22kV 185sq.mm. 29.78mm", standard: 20, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020260301", name: "PREFORMED D/E, AW 50 SQ.MM.", standard: 20, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020260302", name: "PREFORMED D/E, AW 95 SQ.MM.", standard: 20, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020300101", name: "à¸à¸µà¸à¸µ. à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹à¸ªà¸¥à¸±à¸à¸à¸¹à¹ à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 16-70 à¸.à¸¡à¸¡.", standard: 100, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020300102", name: "à¸à¸µà¸à¸µ. à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹à¸ªà¸¥à¸±à¸à¸à¸¹à¹ à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 25-95 à¸.à¸¡à¸¡.", standard: 100, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020300103", name: "à¸à¸µà¸à¸µ. à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹ 3 à¸ªà¸¥à¸±à¸ à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 70-185 à¸.à¸¡à¸¡.", standard: 50, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020260303", name: "à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹à¹à¸à¹à¸²à¸à¸¥à¸²à¸¢à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 50-70 à¸.à¸¡à¸¡.", standard: 20, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020260304", name: "à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹à¹à¸à¹à¸²à¸à¸¥à¸²à¸¢à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 95-120 à¸.à¸¡à¸¡.", standard: 20, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020330005", name: "HOTLINE BAIL-CLAMP, MAIN 35-70 SQ.MM.", standard: 30, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020330006", name: "HOTLINE BAIL-CLAMP, MAIN 70-185 SQ.MM.", standard: 30, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020330104", name: "HOTLINE CLAMP, MAIN35-185, TAP50-185SQ.MM.", standard: 30, unit: "à¸à¸¸à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020360000", name: "IPC MAIN 16-95 SQ.MM. TAP 6-35 SQ.MM.", standard: 40, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1020400004", name: "à¸«à¸¥à¸­à¸à¸à¹à¸­à¸ªà¸²à¸¢à¸à¸à¸´à¸à¸à¸µà¸ à¸£à¸±à¸à¹à¸£à¸à¸à¸¶à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 95 à¸.à¸¡à¸¡.", standard: 40, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020400012", name: "SLEEVE, TENSION AL 50 SQ.MM.", standard: 40, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020400017", name: "SLEEVE, TENSION AL 185 SQ.MM.", standard: 40, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020410004", name: "à¸«à¸¥à¸­à¸à¸à¹à¸­à¸ªà¸²à¸¢à¸à¸à¸´à¸à¸à¸µà¸ à¹à¸¡à¹à¸£à¸±à¸à¹à¸£à¸à¸à¸¶à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 95 à¸.à¸¡à¸¡.", standard: 40, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020410014", name: "SLEEVE, TENSIONLESS AL 50 SQ.MM.", standard: 40, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020410017", name: "SLEEVE, TENSIONLESS AL 185 SQ.MM.", standard: 30, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020420102", name: "à¸«à¸²à¸à¸à¸¥à¸² à¹à¸à¸²à¸°à¸£à¸¹à¸¡à¸²à¸à¸£à¸à¸²à¸à¹à¸à¸¡à¹à¸² à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 50 à¸.à¸¡à¸¡.", standard: 30, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020420104", name: "à¸«à¸²à¸à¸à¸¥à¸² à¹à¸à¸²à¸°à¸£à¸¹à¸¡à¸²à¸à¸£à¸à¸²à¸à¹à¸à¸¡à¹à¸² à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 95 à¸.à¸¡à¸¡.", standard: 30, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020420106", name: "à¸«à¸²à¸à¸à¸¥à¸² à¹à¸à¸²à¸°à¸£à¸¹à¸¡à¸²à¸à¸£à¸à¸²à¸à¹à¸à¸¡à¹à¸² à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 185 à¸.à¸¡à¸¡.", standard: 30, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020420400", name: "à¸ªà¸¥à¸±à¸à¸à¹à¸­à¸à¸¥à¸²à¸¢à¸ªà¸²à¸¢à¹à¸à¹à¸²à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸à¸à¹à¸²à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 50 à¸.à¸¡à¸¡.", standard: 20, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020440008", name: "à¹à¸à¹à¸à¸´à¸¥à¸ªà¹à¸à¹à¸à¸­à¸£à¹ à¹à¸à¸¥à¸µà¹à¸­à¸à¸´à¸¥à¸µà¸ à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¹à¸à¹à¸à¸´à¸¥à¸­à¸²à¸à¸²à¸¨ 22-33kV 50-185 à¸.à¸¡à¸¡.", standard: 20, unit: "à¸à¸¸à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¸à¹à¸­à¸ªà¸²à¸¢" },
    { code: "1020440112", name: "à¹à¸«à¸¥à¹à¸à¸à¸­à¸à¹à¸à¹à¸à¸´à¸¥à¸­à¸²à¸à¸²à¸¨à¸à¸²à¸à¹à¸à¹à¸ à¸£à¸°à¸à¸ 22kV à¹à¸¥à¸° 33kV à¹à¸à¸ SA4-015/44007", standard: 5, unit: "à¸­à¸±à¸", category: "à¹à¸ªà¸²à¹à¸¥à¸°à¸à¸­à¸" },
    { code: "1030010002", name: "à¸¥à¸¹à¸à¸à¹à¸§à¸¢à¹à¸¥à¸à¹à¹à¸à¸ªà¸à¹à¹à¸à¸à¹ 22 à¹à¸à¸§à¸µ à¹à¸à¸ 57-2L à¸à¸à¸´à¸à¸à¸à¹à¸à¸²à¹à¸§à¸­à¸£à¹à¸­à¸²à¸£à¹à¸", standard: 50, unit: "à¸à¸¸à¸", category: "à¸¥à¸¹à¸à¸à¹à¸§à¸¢à¹à¸à¸à¹à¸²" },
    { code: "1030020000", name: "à¸¥à¸¹à¸à¸à¹à¸§à¸¢à¹à¸à¸§à¸à¹à¸à¸ à¸(à¹à¸à¸ 52-1) à¸¡à¸­à¸.354", standard: 50, unit: "à¸¥à¸¹à¸", category: "à¸¥à¸¹à¸à¸à¹à¸§à¸¢à¹à¸à¸à¹à¸²" },
    { code: "1030030000", name: "à¸¥à¸¹à¸à¸£à¸­à¸à¹à¸£à¸à¸à¹à¸³à¹à¸à¸ à¸(à¹à¸à¸ 53-2) à¸¡à¸­à¸.227", standard: 40, unit: "à¸¥à¸¹à¸", category: "à¸¥à¸¹à¸à¸à¹à¸§à¸¢à¹à¸à¸à¹à¸²" },
    { code: "1030110000", name: "à¸ªà¹à¸à¸£à¸à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸à¸à¸à¸£à¸à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 35-70 à¸.à¸¡à¸¡. ACSR 35-50 à¸.à¸¡à¸¡.", standard: 10, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1030110004", name: "à¸ªà¹à¸à¸£à¸à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸à¸à¸à¸£à¸à¸ªà¸³à¸«à¸£à¸±à¸à¸ªà¸²à¸¢à¸­à¸¥à¸¹à¸¡à¸´à¹à¸à¸µà¸¢à¸¡ 185 à¸.à¸¡à¸¡.", standard: 10, unit: "à¸­à¸±à¸", category: "à¹à¸à¸¥à¹à¸¡à¸à¹à¹à¸¥à¸°à¸à¸­à¸à¹à¸à¸à¹à¸à¸­à¸£à¹" },
    { code: "1030130000", name: "à¹à¸£à¹à¸ 2x200 à¸¡à¸¡.(2x8) à¹à¸à¸à¸«à¸¥à¸±à¸à¸¢à¸·à¹à¸", standard: 10, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸«à¸¥à¹à¸à¹à¸¥à¸°à¸¢à¸¶à¸à¸ªà¸²à¸¢" },
    { code: "1030130002", name: "à¹à¸£à¹à¸ 4x200 à¸¡à¸¡.(4x8) à¹à¸à¸à¸«à¸¥à¸±à¸à¸¢à¸·à¹à¸", standard: 10, unit: "à¸­à¸±à¸", category: "à¸­à¸¸à¸à¸à¸£à¸à¹à¹à¸«à¸¥à¹à¸à¹à¸¥à¸°à¸¢à¸¶à¸à¸ªà¸²à¸¢" },
    { code: "1040000000", name: "à¸¥à¹à¸­à¸à¹à¸² 21 à¹à¸à¸§à¸µ 5 à¸à¸´à¹à¸¥à¹à¸­à¸¡à¸à¹", standard: 30, unit: "à¸à¸¸à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040000002", name: "à¸¥à¹à¸­à¸à¹à¸² 24 à¹à¸à¸§à¸µ 5 à¸à¸´à¹à¸¥à¹à¸­à¸¡à¸à¹", standard: 15, unit: "à¸à¸¸à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹", specialNotice: "à¸à¸à¸ª.à¸à¸¸à¸¡à¹à¸à¹à¸à¹à¹à¸à¹à¸²à¸à¸±à¹à¸", imageUrl: DEMO_IMAGES["1040000002"] },
    { code: "1040000300", name: "à¸¥à¹à¸­à¸à¹à¸² 250-500 à¹à¸§à¸¥à¸à¹ 2.5-5.0 à¸à¸´à¹à¸¥à¹à¸­à¸¡à¸à¹", standard: 20, unit: "à¸à¸¸à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040010002", name: "à¸à¸£à¸­à¸à¹à¸­à¸²à¸à¹à¸à¸´à¸§à¸ªà¹à¸à¸±à¸à¹à¸­à¸²à¸à¹ 22 à¹à¸à¸§à¸µ 100 à¹à¸­à¸¡à¸à¹ 12 à¹à¸à¹à¸­", standard: 30, unit: "à¸à¸¸à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040010006", name: "à¸à¸£à¸°à¸à¸­à¸à¸à¸´à¸§à¸ªà¹ 22 à¹à¸à¸§à¸µ 100 à¹à¸­à¸¡à¸à¹ 12 à¹à¸à¹à¸­", standard: 20, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020010", name: "H.R.C. FUSE, BLADE CONTACT, 32 A", standard: 15, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020011", name: "H.R.C. FUSE, BLADE CONTACT, 50 A", standard: 70, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020012", name: "H.R.C. FUSE, BLADE CONTACT, 80 A", standard: 70, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020013", name: "H.R.C. FUSE, BLADE CONTACT, 100 A", standard: 70, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020014", name: "H.R.C. FUSE, BLADE CONTACT, 160 A", standard: 70, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020015", name: "H.R.C. FUSE, BLADE CONTACT, 200 A", standard: 70, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020016", name: "H.R.C. FUSE, BLADE CONTACT, 250 A", standard: 40, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020017", name: "H.R.C. FUSE, BLADE CONTACT, 315 A", standard: 20, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020019", name: "H.R.C. FUSE, BLADE CONTACT, 400 A", standard: 15, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020100", name: "à¸à¸´à¸§à¸ªà¹à¸ªà¸§à¸´à¸à¸à¹à¹à¸£à¸à¸à¹à¸³ 1x400 à¹à¸­à¸¡à¸à¹ 500 à¹à¸§à¸¥à¸à¹", standard: 60, unit: "à¸à¸¸à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040020102", name: "à¸ªà¸§à¸´à¸à¸à¹à¹à¸£à¸à¸à¹à¸³à¹à¸à¸à¸«à¸¸à¹à¸¡à¸à¸à¸§à¸ à¸à¸à¸´à¸ 1 à¹à¸à¸ª 1x400A 400V", standard: 30, unit: "à¸à¸¸à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030002", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 3 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030003", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 5-6 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030004", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 8 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030005", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 10 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030006", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 15 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030007", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 20 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030008", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 25 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 70, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030009", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 30 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 50, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030010", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 40 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 50, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030011", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 50 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 30, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030012", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 65 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 30, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030013", name: "à¸à¸´à¸§à¸ªà¹à¸¥à¸´à¸à¸à¹ 22 à¹à¸à¸§à¸µ 100 à¹à¸­à¸¡à¸à¹ EEI-NEMA à¹à¸à¸ K", standard: 10, unit: "à¹à¸ªà¹à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹", specialNotice: "à¸à¸à¸ª.à¸à¹à¸²à¸à¸£à¸°à¸ªà¸³à¸£à¸­à¸à¹à¸à¹à¹à¸à¹à¸²à¸à¸±à¹à¸", imageUrl: DEMO_IMAGES["1040030013"] },
    { code: "1040030203", name: "FUSE LINK 22 KV 40 A FOR SWITCHGEAR", standard: 9, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" },
    { code: "1040030207", name: "FUSE LINK 22 KV 100A FOR SWITCHGEAR", standard: 9, unit: "à¸­à¸±à¸", category: "à¸¥à¹à¸­à¸à¹à¸²à¹à¸¥à¸°à¸à¸´à¸§à¸ªà¹" }
];

const DEFAULT_REQUESTERS_LIST = [
    "à¸­à¸²à¸à¸à¸à¹ à¸§à¸£à¸£à¸à¸­à¸¡à¸£à¸à¸¸à¸¥", "à¸à¸¨à¸à¸£ à¸à¸à¸§à¸±à¸à¸à¸µ", "à¸¤à¸à¸à¸´à¹à¸à¸µà¸¢à¸£à¸à¸´ à¸à¸²à¸à¸¸à¸¥à¸µ", "à¸¡à¸à¸à¸£à¸µ à¸à¸­à¸à¸¨à¸£à¸µ", "à¸­à¸ à¸´à¸à¸²à¸à¸´ à¸¢à¸¸à¸à¸´à¸",
    "à¸à¸£à¸£à¸±à¸ à¸à¸²à¸¥à¸¢à¸­", "à¸à¸¨à¸à¸£ à¸à¸²à¸à¸à¸à¹", "à¸à¸´à¸à¸à¸à¸±à¸¢ à¸à¸¸à¸à¸¢à¹à¸à¹à¸", "à¸à¸²à¸¢à¸à¸¸à¸à¹à¸à¸¢ à¸à¸²à¸¡à¸à¸´à¸¥à¸²", "à¸à¸²à¸¢à¸à¸§à¸£à¸´à¸¨à¸£ à¸¤à¸à¸à¸´à¹à¸à¸±à¸¢",
    "à¸à¸²à¸¢à¸ªà¸¡à¸à¸²à¸£ à¸­à¸¸à¹à¸à¹à¸­à¹à¸¢", "à¸à¸²à¸¢à¸ªà¸¡à¸à¸²à¸¢ à¸à¸²à¹à¸à¸", "à¸à¸²à¸¢à¸§à¸¸à¸à¸´à¸à¸à¸©à¹ à¸¡à¸²à¸ªà¸¸à¹à¸¡", "à¸à¸²à¸¢à¸à¸¸à¸à¸ªà¹à¸ à¸à¸à¸à¸¥à¸µ", "à¸à¸²à¸¢à¸à¸´à¸à¸à¸´à¸ à¸¹à¸¡à¸´ à¸¥à¸µà¸à¸µà¸à¸§à¸",
    "à¸à¸²à¸¢à¸§à¸´à¸à¸² à¸à¸£à¸¡à¸à¸±à¸à¸£", "à¸à¸²à¸¢à¸§à¸´à¸à¸±à¸¢ à¸à¸à¸¨à¸£à¸µ", "à¸à¸²à¸¢à¸­à¸±à¸à¸£à¹à¸à¸ à¸à¸±à¸à¸à¸°à¸à¸±à¸¢", "à¸à¸²à¸¢à¸à¸à¸©à¹à¸ à¸´à¸à¹à¸ à¸à¸§à¸¥à¸¥à¸²à¸à¸à¸²", "à¸à¸²à¸¢à¸à¸¹à¸à¸à¸©à¹ à¸§à¸´à¸§à¸±à¸à¸à¹à¸§à¸à¸à¸£à¸°à¸à¸¹à¸¥",
    "à¸§à¸à¸´à¸£à¸à¸à¸©à¹ à¸à¸²à¹à¸¡à¸·à¸­à¸à¸£à¸±à¸à¸©à¹", "à¸­à¸ à¸´à¸à¸±à¸à¸à¹ à¸à¸µà¸à¸¸à¸à¸¡à¸µ à¸ à¸à¸¸à¸¡à¹à¸", "à¸ à¸¸à¸à¸à¸à¹ à¹à¸à¸à¸£à¸à¸³", "à¸­à¸£à¸£à¸à¸à¸£ à¸ªà¸·à¸à¸ªà¸¸à¸à¸à¸£"
];

function getItemStatus(currentQty, standardQty) {
    const current = Number(currentQty);
    const std = Number(standardQty);
    if (std <= 0) return { key: "full", label: "âï¸ à¹à¸à¹à¸¡ 100% (Full Stock)", pct: 100, badgeClass: "badge-success" };
    
    const pct = Math.round((current / std) * 100);
    if (pct < 50) return { key: "out_of_stock", label: "ð´ à¸à¸±à¸à¸à¸·à¹à¸­/à¸à¸±à¸à¸«à¸² (Min. Stock)", pct, badgeClass: "badge-danger" };
    else if (pct >= 50 && pct <= 60) return { key: "low", label: "ð§ à¹à¸à¸·à¸­à¸ (50-60% Warning)", pct, badgeClass: "badge-orange" };
    else if (pct >= 61 && pct <= 80) return { key: "normal", label: "ð¡ à¸à¸­à¸à¸µ (61-80% Fair)", pct, badgeClass: "badge-lime" };
    else if (pct >= 81 && pct <= 99) return { key: "good", label: "ð¢ à¸à¸µ (81-99% Good)", pct, badgeClass: "badge-lightgreen" };
    else if (pct === 100) return { key: "full", label: "âï¸ à¹à¸à¹à¸¡ 100% (Full Stock)", pct, badgeClass: "badge-success" };
    else return { key: "over", label: "ðµ à¹à¸à¸´à¸ 100% (Over Stock)", pct, badgeClass: "badge-info" };
}

class StockDatabase {
    constructor() {
        this.STORAGE_KEY_ITEMS = "pea_warehouse_items_v4";
        this.STORAGE_KEY_LOGS = "pea_warehouse_logs_v4";
        this.STORAGE_KEY_AUDIT_PERM = "pea_warehouse_audit_perm";
        this.STORAGE_KEY_REQUESTERS = "pea_warehouse_requesters_v4";
        this.STORAGE_KEY_OWNER_PIN = "pea_warehouse_owner_pin";
        this.init();
    }

    zeroAllQuantities() {
        const items = MASTER_ITEMS.map(mItem => ({
            ...mItem,
            currentQty: 0,
            mb52Qty: 0,
            wmsQty: 0,
            kk23Qty: 0,
            imageUrl: DEMO_IMAGES[mItem.code] || null,
            lastUpdated: new Date().toISOString()
        }));
        this.saveItems(items);
        this.saveLogs([]);
        this.pushToCloudflare();
        return items;
    }

    init() {
        try {
            const storedItems = JSON.parse(localStorage.getItem(this.STORAGE_KEY_ITEMS) || "[]");
            const reordered = [];
            MASTER_ITEMS.forEach(mItem => {
                const existing = storedItems.find(s => s.code === mItem.code);
                if (existing) {
                    reordered.push({
                        ...mItem, 
                        currentQty: existing.currentQty !== undefined ? existing.currentQty : 0,
                        mb52Qty: existing.mb52Qty !== undefined ? existing.mb52Qty : 0,
                        wmsQty: existing.wmsQty !== undefined ? existing.wmsQty : 0,
                        kk23Qty: existing.kk23Qty !== undefined ? existing.kk23Qty : 0,
                        specialNotice: mItem.specialNotice || existing.specialNotice || null,
                        imageUrl: existing.imageUrl || DEMO_IMAGES[mItem.code] || null
                    });
                } else {
                    reordered.push({
                        ...mItem, 
                        currentQty: 0, mb52Qty: 0, wmsQty: 0, kk23Qty: 0,
                        imageUrl: DEMO_IMAGES[mItem.code] || null, lastUpdated: new Date().toISOString()
                    });
                }
            });
            localStorage.setItem(this.STORAGE_KEY_ITEMS, JSON.stringify(reordered));
        } catch(e) {}

        if (!localStorage.getItem(this.STORAGE_KEY_LOGS)) {
            localStorage.setItem(this.STORAGE_KEY_LOGS, JSON.stringify([]));
        }

        if (localStorage.getItem(this.STORAGE_KEY_AUDIT_PERM) === null) { localStorage.setItem(this.STORAGE_KEY_AUDIT_PERM, "true"); }
        if (!localStorage.getItem(this.STORAGE_KEY_REQUESTERS)) { localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(DEFAULT_REQUESTERS_LIST)); }
        localStorage.setItem(this.STORAGE_KEY_OWNER_PIN, "Aunkung");
    }

    updateItemImage(code, imageUrl) {
        const items = this.getItems();
        const itemIndex = items.findIndex(i => i.code === code);
        if (itemIndex === -1) throw new Error("à¹à¸¡à¹à¸à¸à¸à¸±à¸ªà¸à¸¸à¸à¸µà¹à¹à¸à¸£à¸°à¸à¸");
        items[itemIndex].imageUrl = imageUrl; items[itemIndex].lastUpdated = new Date().toISOString();
        this.saveItems(items); return items[itemIndex];
    }

    async updateLocationQuantities(code, mb52Qty, wmsQty, kk23Qty) {
        const items = this.getItems();
        const itemIndex = items.findIndex(i => i.code === code);
        if (itemIndex === -1) throw new Error("à¹à¸¡à¹à¸à¸à¸à¸±à¸ªà¸à¸¸à¸à¸µà¹à¹à¸à¸£à¸°à¸à¸");
        const item = items[itemIndex];
        const oldMb = item.mb52Qty || 0;
        const oldWm = item.wmsQty || 0;
        const oldKk = item.kk23Qty || 0;
        
        item.mb52Qty = Number(mb52Qty) || 0; 
        item.wmsQty = Number(wmsQty) || 0; 
        item.kk23Qty = Number(kk23Qty) || 0;
        item.lastUpdated = new Date().toISOString(); 
        this.saveItems(items); 

        // Log import transaction
        const logs = this.getLogs();
        logs.unshift({
            id: "LOG-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
            type: "import",
            code: item.code,
            name: item.name,
            qty: (Number(mb52Qty) || 0) + (Number(wmsQty) || 0) + (Number(kk23Qty) || 0),
            unit: item.unit || "à¸à¸´à¹à¸",
            balanceBefore: oldMb + oldWm + oldKk,
            balanceAfter: (Number(mb52Qty) || 0) + (Number(wmsQty) || 0) + (Number(kk23Qty) || 0),
            requester: "Admin (à¸­à¸±à¸à¹à¸à¸à¸à¸¥à¸±à¸)",
            workOrder: "IMPORT-LOCATIONS",
            note: `à¸­à¸±à¸à¹à¸à¸à¸¢à¸­à¸à¸à¸¥à¸±à¸ (MB52: ${mb52Qty}, WMS: ${wmsQty}, sloc 0023: ${kk23Qty})`
        });
        this.saveLogs(logs);
        await this.pushToCloudflare();

        return items[itemIndex];
    }

    async importLocationQuantitiesBatch(batchData) {
        const items = this.getItems();
        const logs = this.getLogs();
        let updatedCount = 0;
        const nowIso = new Date().toISOString();

        batchData.forEach(row => {
            let item = null;
            if (row.code) item = items.find(i => i.code.trim() === String(row.code).trim());
            if (!item && row.seq) {
                const seqNum = Number(row.seq);
                if (seqNum >= 1 && seqNum <= MASTER_ITEMS.length) {
                    const targetCode = MASTER_ITEMS[seqNum - 1].code;
                    item = items.find(i => i.code === targetCode);
                }
            }
            if (item) {
                const oldQty = item.currentQty || 0;
                if (row.currentQty !== undefined) item.currentQty = Number(row.currentQty) || 0;
                if (row.mb52Qty !== undefined) item.mb52Qty = Number(row.mb52Qty) || 0;
                if (row.wmsQty !== undefined) item.wmsQty = Number(row.wmsQty) || 0;
                if (row.kk23Qty !== undefined) item.kk23Qty = Number(row.kk23Qty) || 0;
                item.lastUpdated = nowIso;
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            logs.unshift({
                id: "LOG-" + Date.now(),
                timestamp: nowIso,
                type: "import",
                code: "BATCH-IMPORT",
                name: `à¸­à¸±à¸à¹à¸à¸à¸¢à¸­à¸à¸ªà¸à¹à¸­à¸à¸à¸±à¸ªà¸à¸¸à¸¢à¸à¸à¸¸à¸à¸à¹à¸²à¸à¹à¸à¸¥à¹ Excel (${updatedCount} à¸£à¸²à¸¢à¸à¸²à¸£)`,
                qty: updatedCount,
                unit: "à¸£à¸²à¸¢à¸à¸²à¸£",
                balanceBefore: 0,
                balanceAfter: updatedCount,
                requester: "Admin (à¸à¸³à¹à¸à¹à¸²à¹à¸à¸¥à¹)",
                workOrder: "IMPORT-BATCH-EXCEL",
                note: `à¸­à¸±à¸à¹à¸à¸à¸¢à¸­à¸à¸à¸±à¸ªà¸à¸¸à¸ªà¸³à¹à¸£à¹à¸ ${updatedCount} à¸£à¸²à¸¢à¸à¸²à¸£`
            });
        }
        this.saveItems(items); 
        this.saveLogs(logs);
        await this.pushToCloudflare();
        return updatedCount;
    }

    getOwnerPin() { return localStorage.getItem(this.STORAGE_KEY_OWNER_PIN) || "Aunkung"; }
    verifyOwnerPin(inputPin) { return inputPin && inputPin.trim() === this.getOwnerPin(); }
    verifyRequestersPin(inputPin) { return inputPin && inputPin.trim() === "AunkungTuy"; }

    getRequesters() {
        const stored = localStorage.getItem(this.STORAGE_KEY_REQUESTERS);
        if (stored) return JSON.parse(stored); return DEFAULT_REQUESTERS_LIST;
    }

    addRequester(name) {
        const list = this.getRequesters(); const cleanName = name.trim();
        if (!cleanName) throw new Error("à¸à¸£à¸¸à¸à¸²à¸à¸£à¸­à¸à¸à¸·à¹à¸­à¸à¸¹à¹à¹à¸à¸´à¸"); if (list.includes(cleanName)) throw new Error("à¸£à¸²à¸¢à¸à¸·à¹à¸­à¸à¸µà¹à¸¡à¸µà¸­à¸¢à¸¹à¹à¹à¸à¸£à¸°à¸à¸à¹à¸¥à¹à¸§");
        list.push(cleanName); localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(list)); return list;
    }

    deleteRequester(name) {
        let list = this.getRequesters(); list = list.filter(n => n !== name);
        localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(list)); return list;
    }

    getAuditPermission() { return localStorage.getItem(this.STORAGE_KEY_AUDIT_PERM) !== "false"; }
    setAuditPermission(enabled) { localStorage.setItem(this.STORAGE_KEY_AUDIT_PERM, enabled ? "true" : "false"); }

    // ð¢ à¸à¸³à¸«à¸à¸ API Base URL à¸ªà¸³à¸«à¸£à¸±à¸ Cloudflare Worker + D1 Database
    getApiBaseUrl() {
        if (window.API_BASE_URL) return window.API_BASE_URL;
        if (window.location.hostname.includes('workers.dev') || window.location.hostname.includes('pages.dev')) {
            return window.location.origin;
        }
        return 'https://kk2warehouse.asualfly1986.workers.dev';
    }

    // ð¢ à¸à¸´à¸à¸à¹à¸à¹à¸­à¸¡à¸¹à¸¥à¸ªà¸à¹à¸­à¸à¹à¸¥à¸°à¸à¸£à¸°à¸§à¸±à¸à¸´à¸à¸²à¸à¸à¸²à¸à¸à¹à¸­à¸¡à¸¹à¸¥à¸«à¸¥à¸±à¸ Cloudflare D1 (Master Truth Sync)
    async syncFromCloudflare() {
        try {
            const baseUrl = this.getApiBaseUrl();
            let hasChanges = false;
            const cacheBust = `t=${Date.now()}`;

            // 1. Sync Inventory Items Stock from Cloudflare D1
            const res = await fetch(`${baseUrl}/api/inventory?${cacheBust}`);
            if (res.ok) {
                const dbItems = await res.json();
                if (dbItems && Array.isArray(dbItems) && dbItems.length > 0) {
                    let localItems = this.getItems();
                    let updated = false;

                    dbItems.forEach(dbItem => {
                        const targetCode = dbItem.id || dbItem.code;
                        const targetStock = dbItem.current_stock !== undefined ? dbItem.current_stock : dbItem.currentQty;
                        const localItem = localItems.find(i => i.code === targetCode);
                        if (localItem) {
                            if (targetStock !== undefined && Number(localItem.currentQty) !== Number(targetStock)) {
                                localItem.currentQty = Number(targetStock);
                                updated = true;
                            }
                            if (dbItem.mb52Qty !== undefined && Number(localItem.mb52Qty) !== Number(dbItem.mb52Qty)) {
                                localItem.mb52Qty = Number(dbItem.mb52Qty);
                                updated = true;
                            }
                            if (dbItem.wmsQty !== undefined && Number(localItem.wmsQty) !== Number(dbItem.wmsQty)) {
                                localItem.wmsQty = Number(dbItem.wmsQty);
                                updated = true;
                            }
                            if (dbItem.kk23Qty !== undefined && Number(localItem.kk23Qty) !== Number(dbItem.kk23Qty)) {
                                localItem.kk23Qty = Number(dbItem.kk23Qty);
                                updated = true;
                            }
                            if (dbItem.imageUrl && localItem.imageUrl !== dbItem.imageUrl) {
                                localItem.imageUrl = dbItem.imageUrl;
                                updated = true;
                            }
                        }
                    });

                    if (updated) {
                        localStorage.setItem(this.STORAGE_KEY_ITEMS, JSON.stringify(localItems));
                        hasChanges = true;
                        console.log("âï¸ Successfully updated local stock from Cloudflare D1!");
                        if (window.app && typeof window.app.renderStockTable === 'function') {
                            window.app.renderStockTable(); 
                            window.app.renderDashboard();
                        }
                        if (window.chartsPage && typeof window.chartsPage.renderAllCharts === 'function') {
                            window.chartsPage.renderKpis();
                            window.chartsPage.renderAllCharts();
                            window.chartsPage.renderStockTable();
                        }
                    }
                }
            }

            // 2. Sync Transaction History Logs directly from Cloudflare D1 Master Database
            const logsRes = await fetch(`${baseUrl}/api/logs?${cacheBust}`);
            if (logsRes.ok) {
                const dbLogs = await logsRes.json();
                if (Array.isArray(dbLogs) && dbLogs.length > 0) {
                    const formattedLogs = dbLogs.map(l => ({
                        id: l.id || ("LOG-" + new Date(l.timestamp || Date.now()).getTime()),
                        timestamp: l.timestamp || new Date().toISOString(),
                        type: l.type || (l.qty < 0 ? 'out' : 'in'),
                        code: l.itemCode || l.code || '',
                        name: l.itemName || l.name || '',
                        qty: Math.abs(Number(l.qty || 0)),
                        unit: l.unit || 'à¸à¸´à¹à¸',
                        balanceBefore: Number(l.balanceBefore || 0),
                        balanceAfter: Number(l.currentStock || l.balanceAfter || 0),
                        requester: l.requester || '-',
                        workOrder: l.workOrder || '-',
                        note: l.note || '-'
                    }));

                    formattedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    const existingLogs = this.getLogs();
                    if (JSON.stringify(formattedLogs) !== JSON.stringify(existingLogs)) {
                        this.saveLogs(formattedLogs);
                        hasChanges = true;
                        console.log("âï¸ Successfully updated master logs from Cloudflare D1 Database!");
                    }
                } else if (this.getLogs().length > 0) {
                    // Auto-push local logs to D1 if D1 is empty
                    console.log("âï¸ D1 logs empty. Auto-pushing local logs to D1...");
                    await this.pushToCloudflare();
                }
            }

            return hasChanges;
        } catch (e) { console.warn("Cloudflare sync notice:", e.message); }
        return false;
    }

    async pushToCloudflare() {
        try {
            const baseUrl = this.getApiBaseUrl();
            const items = this.getItems();
            const logs = this.getLogs();
            await fetch(`${baseUrl}/api/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, logs })
            });
        } catch (e) { console.warn("Cloudflare push notice:", e.message); }
    }

    getItems() { return JSON.parse(localStorage.getItem(this.STORAGE_KEY_ITEMS) || "[]"); }
    saveItems(items) { localStorage.setItem(this.STORAGE_KEY_ITEMS, JSON.stringify(items)); }
    getLogs() { return JSON.parse(localStorage.getItem(this.STORAGE_KEY_LOGS) || "[]"); }
    saveLogs(logs) { localStorage.setItem(this.STORAGE_KEY_LOGS, JSON.stringify(logs)); }
    getItemByCode(code) { const items = this.getItems(); return items.find(i => i.code === code || i.code.trim() === code.trim()); }

    // ð¢ à¸¢à¸´à¸à¸à¸³à¸ªà¸±à¹à¸à¸­à¸±à¸à¹à¸à¸à¸¢à¸­à¸à¸à¸à¹à¸«à¸¥à¸·à¸­à¹à¸à¸à¸µà¹ Cloudflare D1
    async processTransaction(type, code, qty, requester = "-", workOrder = "-", note = "") {
        if (type === "audit" && !this.getAuditPermission()) throw new Error("â ï¸ à¸ªà¸´à¸à¸à¸´à¹à¸à¸´à¸à¹à¸à¹à¸à¸²à¸à¹à¸à¸¢ Admin");

        const items = this.getItems();
        const itemIndex = items.findIndex(i => i.code === code);
        if (itemIndex === -1) throw new Error(`à¹à¸¡à¹à¸à¸à¸£à¸«à¸±à¸ªà¸à¸±à¸ªà¸à¸¸ ${code}`);

        const item = items[itemIndex];
        const oldQty = Number(item.currentQty);
        let newQty = oldQty;
        const changeQty = Number(qty);
        let changeToSend = 0; 

        if (type === "dispense") {
            newQty = oldQty - changeQty; 
            changeToSend = -changeQty; 
        } else if (type === "receive") {
            newQty = oldQty + changeQty; 
            changeToSend = changeQty;  
        } else if (type === "audit") {
            newQty = changeQty; 
            changeToSend = newQty - oldQty; 
        }

        items[itemIndex].currentQty = newQty;
        items[itemIndex].lastUpdated = new Date().toISOString();
        this.saveItems(items);

        const logType = type === 'dispense' ? 'out' : (type === 'receive' ? 'in' : 'audit');
        const logObj = {
            id: "LOG-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
            type: logType,
            code: code,
            name: item.name,
            qty: Math.abs(changeQty),
            unit: item.unit || "à¸à¸´à¹à¸",
            balanceBefore: oldQty,
            balanceAfter: newQty,
            requester: requester,
            workOrder: workOrder,
            note: note
        };

        // Save log locally
        const logs = this.getLogs();
        logs.unshift(logObj);
        this.saveLogs(logs);

        // ð¢ MUST AWAIT NETWORK REQUESTS ON BOTH PC & MOBILE SO POST COMPLETES TO CLOUDFLARE D1
        if (changeToSend !== 0) {
            const baseUrl = this.getApiBaseUrl();
            try {
                await fetch(`${baseUrl}/api/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: code, 
                        code: code,
                        name: item.name, 
                        standard: item.standard, 
                        currentQty: newQty,
                        mb52Qty: item.mb52Qty || 0,
                        wmsQty: item.wmsQty || 0,
                        kk23Qty: item.kk23Qty || 0,
                        change: changeToSend,
                        log: {
                            timestamp: logObj.timestamp,
                            type: logType,
                            itemCode: code,
                            itemName: item.name,
                            qty: logObj.qty,
                            unit: item.unit || "à¸à¸´à¹à¸",
                            balanceBefore: oldQty,
                            currentStock: newQty,
                            requester: requester,
                            workOrder: workOrder,
                            note: note
                        }
                    })
                });
            } catch (e) {
                console.error("D1 Update Error:", e);
            }

            await this.pushToCloudflare();
        }

        const updatedItem = items[itemIndex];
        return {
            item: updatedItem,
            log: logObj,
            code: updatedItem.code,
            name: updatedItem.name,
            currentQty: updatedItem.currentQty,
            unit: updatedItem.unit || "à¸à¸´à¹à¸",
            standard: updatedItem.standard,
            category: updatedItem.category,
            mb52Qty: updatedItem.mb52Qty,
            wmsQty: updatedItem.wmsQty,
            kk23Qty: updatedItem.kk23Qty
        };
    }

    async updateItemImage(code, imageUrl) {
        const items = this.getItems(); 
        const item = items.find(i => i.code === code);
        if (item) { 
            item.imageUrl = imageUrl; 
            this.saveItems(items); 
            await this.pushToCloudflare();
            return item; 
        } 
        return null;
    }
    async resetItemImage(code) {
        const items = this.getItems(); 
        const item = items.find(i => i.code === code);
        if (item) { 
            item.imageUrl = DEMO_IMAGES[code] || null; 
            this.saveItems(items); 
            await this.pushToCloudflare();
            return item; 
        } 
        return null;
    }
    async resetAllItemImages() {
        const items = this.getItems(); 
        items.forEach(item => { item.imageUrl = DEMO_IMAGES[item.code] || null; });
        this.saveItems(items); 
        await this.pushToCloudflare();
        return items;
    }
    resetToDefault() {
        localStorage.removeItem(this.STORAGE_KEY_ITEMS); localStorage.removeItem(this.STORAGE_KEY_LOGS);
        localStorage.removeItem(this.STORAGE_KEY_AUDIT_PERM); localStorage.removeItem(this.STORAGE_KEY_REQUESTERS);
        localStorage.removeItem(this.STORAGE_KEY_OWNER_PIN); localStorage.removeItem("pea_warehouse_zeroed_v1");
        this.zeroAllQuantities();
        this.init();
    }
    getStats() {
        const items = this.getItems(); const totalSKU = items.length;
        let overCount = 0, fullCount = 0, goodCount = 0, normalCount = 0, lowCount = 0, minStockCount = 0;
        items.forEach(i => {
            const status = getItemStatus(i.currentQty, i.standard);
            if (status.key === "out_of_stock") minStockCount++; else if (status.key === "low") lowCount++;
            else if (status.key === "normal") normalCount++; else if (status.key === "good") goodCount++;
            else if (status.key === "full") fullCount++; else if (status.key === "over") overCount++;
        });
        return { totalSKU, overCount, fullCount, goodCount, normalCount, lowCount, outOfStockCount: minStockCount, alertCount: lowCount + minStockCount };
    }
}
window.getItemStatus = getItemStatus;
window.db = new StockDatabase();


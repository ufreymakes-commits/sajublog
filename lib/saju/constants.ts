// 천간 (Heavenly Stems)
export const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];

// 지지 (Earthly Branches)
export const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

// 천간 한자 매핑
export const stemToHanja: Record<string, string> = {
  "갑": "甲", "을": "乙", "병": "丙", "정": "丁", "무": "戊",
  "기": "己", "경": "庚", "신": "辛", "임": "壬", "계": "癸"
};

// 지지 한자 매핑
export const branchToHanja: Record<string, string> = {
  "자": "子", "축": "丑", "인": "寅", "묘": "卯", "진": "辰", "사": "巳",
  "오": "午", "미": "未", "신": "申", "유": "酉", "술": "戌", "해": "亥"
};

// 천간 오행
export const stemElements: Record<string, string> = {
  "갑": "목", "을": "목",
  "병": "화", "정": "화",
  "무": "토", "기": "토",
  "경": "금", "신": "금",
  "임": "수", "계": "수"
};

// 지지 오행
export const branchElements: Record<string, string> = {
  "자": "수", "축": "토", "인": "목", "묘": "목",
  "진": "토", "사": "화", "오": "화", "미": "토",
  "신": "금", "유": "금", "술": "토", "해": "수"
};

// 장간 (지지에 숨겨진 천간)
export const hiddenStems: Record<string, string[]> = {
  "자": ["계"],
  "축": ["기", "계", "신"],
  "인": ["무", "병", "갑"],
  "묘": ["을"],
  "진": ["무", "을", "계"],
  "사": ["무", "경", "병"],
  "오": ["기", "정"],
  "미": ["기", "정", "을"],
  "신": ["무", "임", "경"],
  "유": ["신"],
  "술": ["무", "신", "정"],
  "해": ["무", "갑", "임"]
};

// 시간 매핑
export const hourMap: Record<string, number | null> = {
  "23:00 ~ 00:59": 0, "01:00 ~ 02:59": 1, "03:00 ~ 04:59": 2, "05:00 ~ 06:59": 3,
  "07:00 ~ 08:59": 4, "09:00 ~ 10:59": 5, "11:00 ~ 12:59": 6, "13:00 ~ 14:59": 7,
  "15:00 ~ 16:59": 8, "17:00 ~ 18:59": 9, "19:00 ~ 20:59": 10, "21:00 ~ 22:59": 11,
  "모름": null
};

export const hourBranches = ["자","축","인","묘","진","사","오","미","신","유","술","해"];

// 시주 계산용 (일간별)
export const hourStemTable: Record<string, string[]> = {
  "갑":["갑","을","병","정","무","기","경","신","임","계","갑","을"],
  "을":["병","정","무","기","경","신","임","계","갑","을","병","정"],
  "병":["무","기","경","신","임","계","갑","을","병","정","무","기"],
  "정":["경","신","임","계","갑","을","병","정","무","기","경","신"],
  "무":["임","계","갑","을","병","정","무","기","경","신","임","계"],
  "기":["갑","을","병","정","무","기","경","신","임","계","갑","을"],
  "경":["병","정","무","기","경","신","임","계","갑","을","병","정"],
  "신":["무","기","경","신","임","계","갑","을","병","정","무","기"],
  "임":["경","신","임","계","갑","을","병","정","무","기","경","신"],
  "계":["임","계","갑","을","병","정","무","기","경","신","임","계"]
};

// 월간 계산표
export const monthStemTable = [
  ["병","정","무","기","경","신","임","계","갑","을","병","정"],
  ["병","정","무","기","경","신","임","계","갑","을","병","정"],
  ["무","기","경","신","임","계","갑","을","병","정","무","기"],
  ["무","기","경","신","임","계","갑","을","병","정","무","기"],
  ["경","신","임","계","갑","을","병","정","무","기","경","신"],
  ["경","신","임","계","갑","을","병","정","무","기","경","신"],
  ["임","계","갑","을","병","정","무","기","경","신","임","계"],
  ["임","계","갑","을","병","정","무","기","경","신","임","계"],
  ["갑","을","병","정","무","기","경","신","임","계","갑","을"],
  ["갑","을","병","정","무","기","경","신","임","계","갑","을"]
];

// 60갑자
export const sixtyGanji = [
  "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
  "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
  "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
  "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
  "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
  "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"
];

// 국가별 KST 직접 변환 값
export const countryOffsets: Record<string, number> = {
  "Afghanistan": 4.5, "Albania": 8, "Algeria": 8, "Andorra": 8, "Angola": 8,
  "Antigua and Barbuda": 13, "Argentina": 12, "Armenia": 5,
  "Australia - Perth": 1, "Australia - Eucla": 0.25, "Australia - Darwin": -0.5,
  "Australia - Adelaide": -0.5, "Australia - Sydney": -1, "Australia - Brisbane": -1,
  "Australia - Melbourne": -1, "Australia - Hobart": -1, "Australia - Lord Howe Island": -1.5,
  "Australia - Norfolk Island": -2, "Australia - Cocos (Keeling) Islands": 2.5,
  "Australia - Christmas Island": 2,
  "Austria": 8, "Azerbaijan": 5, "Bahamas": 14, "Bahrain": 6, "Bangladesh": 3,
  "Barbados": 13, "Belarus": 6, "Belgium": 8, "Belize": 15, "Benin": 8, "Bhutan": 3,
  "Bolivia": 13, "Bosnia and Herzegovina": 8, "Botswana": 7,
  "Brazil - Rio Branco": 14, "Brazil - Manaus": 13, "Brazil - Cuiabá": 13,
  "Brazil - Campo Grande": 13, "Brazil - Fortaleza": 12, "Brazil - Recife": 12,
  "Brazil - Salvador": 12, "Brazil - Brasília": 12, "Brazil - São Paulo": 12,
  "Brazil - Porto Alegre": 12, "Brazil - Fernando de Noronha": 11,
  "Brunei": 1, "Bulgaria": 7, "Burkina Faso": 9, "Burundi": 7, "Cabo Verde": 10,
  "Cambodia": 2, "Cameroon": 8,
  "Canada - St. John's": 12.5, "Canada - Halifax": 13, "Canada - Toronto": 14,
  "Canada - Winnipeg": 15, "Canada - Calgary": 16, "Canada - Vancouver": 17,
  "Central African Republic": 8, "Chad": 8,
  "Chile - Easter Island": 15, "Chile - Santiago": 13, "Chile - Punta Arenas": 12,
  "China": 1, "Colombia": 14, "Comoros": 6, "Congo (Congo-Brazzaville)": 8, "Costa Rica": 15,
  "Croatia": 8, "Cuba": 14, "Cyprus": 7, "Czech Republic": 8,
  "Denmark - Copenhagen": 8, "Denmark - Tórshavn (Faroe Islands)": 9, "Denmark - Nuuk (Greenland)": 11,
  "Denmark - Ittoqqortoormiit (Greenland)": 11, "Denmark - Pituffik (Greenland)": 13,
  "Djibouti": 6, "Dominica": 13, "Dominican Republic": 13,
  "DR Congo - Kinshasa": 8, "DR Congo - Goma": 7,
  "Ecuador - Quito": 14, "Ecuador - Puerto Ayora (Galápagos)": 15,
  "Egypt": 7, "El Salvador": 15, "Equatorial Guinea": 8, "Eritrea": 6, "Estonia": 7,
  "Eswatini": 7, "Ethiopia": 6, "Fiji": -3, "Finland": 7,
  "France - Papeete (Society Islands)": 19, "France - Nuku Hiva (Marquesas)": 18.5,
  "France - Gambier Islands": 18, "France - Clipperton Island": 17,
  "France - Pointe-à-Pitre (Guadeloupe)": 13, "France - Cayenne (French Guiana)": 12,
  "France - Paris (Metropolitan France)": 8, "France - Mamoudzou (Mayotte)": 6,
  "France - Saint-Denis (Réunion)": 5, "France - Port-aux-Français (Kerguelen Islands)": 4,
  "France - Nouméa (New Caledonia)": -2, "France - Mata-Utu (Wallis and Futuna)": -3,
  "Gabon": 8, "Gambia": 9, "Georgia": 5, "Germany": 8, "Ghana": 9, "Greece": 7, "Grenada": 13,
  "Guatemala": 15, "Guinea": 9, "Guinea-Bissau": 9, "Guyana": 13, "Haiti": 14, "Honduras": 15,
  "Hungary": 8, "Iceland": 9, "India": 3.5,
  "Indonesia - Jakarta": 2, "Indonesia - Makassar": 1, "Indonesia - Jayapura": 0,
  "Iran": 5.5, "Iraq": 6, "Ireland": 9, "Israel": 7, "Italy": 8, "Jamaica": 14, "Japan": 0,
  "Jordan": 7, "Kazakhstan - Astana": 4,
  "Kiribati - Tarawa (Gilbert Islands)": -3, "Kiribati - Kanton (Phoenix Islands)": -4,
  "Kiribati - Kiritimati (Line Islands)": -5,
  "Kenya": 6, "Kuwait": 6, "Kyrgyzstan": 3, "Laos": 2, "Latvia": 7, "Lebanon": 7, "Lesotho": 7,
  "Liberia": 9, "Libya": 7, "Liechtenstein": 8, "Lithuania": 7, "Luxembourg": 8, "Madagascar": 6,
  "Malawi": 7, "Malaysia": 1, "Maldives": 4, "Mali": 9, "Malta": 8, "Marshall Islands": -3,
  "Mauritania": 9, "Mauritius": 5,
  "Mexico - Tijuana": 17, "Mexico - Chihuahua": 16, "Mexico - Mexico City": 15, "Mexico - Cancún": 14,
  "Micronesia - Chuuk": -1, "Micronesia - Pohnpei": -2, "Micronesia - Kosrae": -2,
  "Moldova": 7, "Monaco": 8, "Mongolia - Hovd": 2, "Mongolia - Ulaanbaatar": 1,
  "Montenegro": 8, "Morocco": 9, "Mozambique": 7, "Myanmar": 2.5, "Namibia": 7, "Nauru": -3,
  "Nepal": 3.25, "Netherlands - Amsterdam": 8, "Netherlands - Willemstad (Curaçao)": 13,
  "New Zealand - Auckland": -3, "New Zealand - Chatham Islands": -3.75, "New Zealand - Tokelau": -4,
  "New Zealand - Rarotonga (Cook Islands)": 19, "New Zealand - Alofi (Niue)": 20,
  "Nicaragua": 15, "Niger": 8, "Nigeria": 8, "North Korea": 0, "North Macedonia": 8, "Norway": 8,
  "Oman": 5, "Pakistan": 4, "Palau": 0, "Palestine": 7, "Panama": 14,
  "Papua New Guinea - Port Moresby": -1, "Papua New Guinea - Buka (Bougainville)": -2,
  "Paraguay": 13, "Peru": 14, "Philippines": 1, "Poland": 8, "Portugal - Lisbon": 9,
  "Portugal - Ponta Delgada (Azores)": 10, "Qatar": 6, "Romania": 7,
  "Russia - Kaliningrad": 7, "Russia - Moscow": 6, "Russia - Samara": 5, "Russia - Yekaterinburg": 4,
  "Russia - Omsk": 3, "Russia - Novosibirsk": 2, "Russia - Irkutsk": 1, "Russia - Yakutsk": 0,
  "Russia - Vladivostok": -1, "Russia - Magadan": -2, "Russia - Petropavlovsk-Kamchatsky": -3,
  "Rwanda": 7, "Saint Kitts and Nevis": 13, "Saint Lucia": 13, "Saint Vincent and the Grenadines": 13,
  "Samoa": -4, "San Marino": 8, "Sao Tome and Principe": 9, "Saudi Arabia": 6, "Senegal": 9,
  "Serbia": 8, "Seychelles": 5, "Sierra Leone": 9, "Singapore": 1, "Slovakia": 8, "Slovenia": 8,
  "Solomon Islands": -2, "Somalia": 6, "South Africa - Johannesburg": 7,
  "South Africa - Prince Edward Islands": 6, "South Korea": 0, "South Sudan": 6, "Spain - Madrid": 8,
  "Spain - Las Palmas (Canary Islands)": 9, "Sri Lanka": 3.5, "Sudan": 7, "Suriname": 12,
  "Sweden": 8, "Switzerland": 8, "Syria": 7, "Taiwan": 1, "Tajikistan": 4, "Tanzania": 6,
  "Thailand": 2, "Timor-Leste": 0, "Togo": 9, "Tonga": -4, "Trinidad and Tobago": 13, "Tunisia": 8,
  "Turkey": 6, "Turkmenistan": 4, "Tuvalu": -3, "Uganda": 6, "Ukraine": 7, "United Arab Emirates": 5,
  "United Kingdom - London": 9, "United Kingdom - Gibraltar": 8, "United Kingdom - Akrotiri (Cyprus base)": 7,
  "United Kingdom - Turks and Caicos Islands": 14, "United Kingdom - Bermuda": 13,
  "United Kingdom - Falkland Islands": 12, "United Kingdom - Cayman Islands": 14,
  "United Kingdom - Pitcairn Islands": 17, "United Kingdom - Saint Helena / Ascension / Tristan da Cunha": 9,
  "United Kingdom - Diego Garcia (BIOT)": 3, "United Kingdom - South Georgia & South Sandwich Islands": 11,
  "United States - New York": 14, "United States - Chicago": 15, "United States - Denver": 16,
  "United States - Los Angeles": 17, "United States - Anchorage": 18, "United States - Honolulu": 19,
  "United States - Pago Pago (American Samoa)": 20, "United States - Baker Island": 21,
  "United States - San Juan (Puerto Rico)": 13, "United States - Guam": -1, "United States - Wake Island": -3,
  "Uruguay": 12, "Uzbekistan": 4, "Vanuatu": -2, "Vatican City": 8, "Venezuela": 13, "Vietnam": 2,
  "Yemen": 6, "Zambia": 7, "Zimbabwe": 7
};

// 십성 계산 테이블
export const tenGodsTable: Record<string, Record<string, string>> = {
  "갑": { "갑": "비견", "을": "겁재", "병": "식신", "정": "상관", "무": "편재", "기": "정재", "경": "편관", "신": "정관", "임": "편인", "계": "정인" },
  "을": { "갑": "겁재", "을": "비견", "병": "상관", "정": "식신", "무": "정재", "기": "편재", "경": "정관", "신": "편관", "임": "정인", "계": "편인" },
  "병": { "병": "비견", "정": "겁재", "무": "식신", "기": "상관", "경": "편재", "신": "정재", "임": "편관", "계": "정관", "갑": "편인", "을": "정인" },
  "정": { "병": "겁재", "정": "비견", "무": "상관", "기": "식신", "경": "정재", "신": "편재", "임": "정관", "계": "편관", "갑": "정인", "을": "편인" },
  "무": { "무": "비견", "기": "겁재", "경": "식신", "신": "상관", "임": "편재", "계": "정재", "갑": "편관", "을": "정관", "병": "편인", "정": "정인" },
  "기": { "무": "겁재", "기": "비견", "경": "상관", "신": "식신", "임": "정재", "계": "편재", "갑": "정관", "을": "편관", "병": "정인", "정": "편인" },
  "경": { "경": "비견", "신": "겁재", "임": "식신", "계": "상관", "갑": "편재", "을": "정재", "병": "편관", "정": "정관", "무": "편인", "기": "정인" },
  "신": { "경": "겁재", "신": "비견", "임": "상관", "계": "식신", "갑": "정재", "을": "편재", "병": "정관", "정": "편관", "무": "정인", "기": "편인" },
  "임": { "임": "비견", "계": "겁재", "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인" },
  "계": { "임": "겁재", "계": "비견", "갑": "상관", "을": "식신", "병": "정재", "정": "편재", "무": "정관", "기": "편관", "경": "정인", "신": "편인" }
};

// 오행 한자 매핑
export const elementToHanja: Record<string, string> = {
  "목": "木", "화": "火", "토": "土", "금": "金", "수": "水"
};

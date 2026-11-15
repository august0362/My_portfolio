// Copy of data/Information/mobius_identity_public.json (approved public identity) with one Lead edit
// (2026-11-15): bio paragraph 4 opens with "Đây là" instead of the project name.
// Do not edit by hand otherwise; re-copy from the raw file. information.test.ts checks they match.
export const identity = {
  schemaVersion: '1.0',
  section: 'information/identity',
  profile: {
    fullName: 'Trần Anh Việt',
    displayName: 'August',
    role: 'IT Student / AI & Software Developer',
    education: {
      institution: 'University of Engineering and Technology (UET) – VNU Hanoi',
      major: 'Information Technology',
    },
    headline: 'Building ideas into reality, and imagination into worlds.',
    bio: {
      language: 'vi',
      paragraphs: [
        'Mình là August, một sinh viên Công nghệ thông tin tại UET, Đại học Quốc gia Hà Nội.',
        'Mình yêu thích việc khám phá những ý tưởng mới và biến chúng thành các sản phẩm thực tế, đặc biệt trong lĩnh vực AI, Software Engineering và Game Development.',
        'Bên cạnh công nghệ, mình cũng quan tâm đến nghệ thuật, tâm lý học và những cách khác nhau để thể hiện thế giới nội tâm.',
        'Đây là không gian cá nhân nơi mình lưu giữ hành trình trưởng thành, những điều đã tạo ra và cả những mảnh ghép nhỏ trong cuộc sống.',
      ],
    },
    professionalFields: [
      'Software Engineering',
      'Artificial Intelligence',
      'Cloud Computing',
      'Game Development',
    ],
    interests: ['Công nghệ', 'Game', 'Visual Art', 'Character Design'],
    goal: 'Trở thành một Engineering Lead có khả năng kết hợp AI, Software và Cloud để xây dựng những hệ thống và sản phẩm sáng tạo có giá trị.',
    personality: ['Hướng nội', 'Tò mò', 'Thích khám phá'],
    motto: null,
  },
  visual: {
    styles: [
      'Ethereal Celestial Fantasy',
      'Anime-inspired',
      'Xianxia-inspired',
      'Dreamy & Luminous',
      'Ornamental Fantasy',
    ],
    portrait: null,
  },
  publicContacts: {
    github: 'https://github.com/august0362',
    facebook: 'https://www.facebook.com/augstm',
    linkedin: null,
    email: 'violypic063@gmail.com',
  },
} as const;

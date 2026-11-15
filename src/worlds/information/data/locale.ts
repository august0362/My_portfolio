import type { Language } from '@shared/settings';
import type { Localized } from '@shared/i18n';
import type { Album, Milestone } from '../types';
import { albums } from './albums';
import { cv } from './cv';
import { identity } from './identity';
import { journeyLede, milestones } from './journey';

/*
 * Site-language versions of the Chronicle (P-17). The approved originals stay untouched in
 * identity.ts, journey.ts, albums.ts and cv.ts; this file only adds faithful translations.
 * Nothing here adds a fact that the originals do not state.
 */

const { profile } = identity;

/** The bio is written in Vietnamese; English is a faithful translation. */
const BIO_EN = [
  'I’m August, an Information Technology student at UET, Vietnam National University, Hanoi.',
  'I love exploring new ideas and turning them into real products, especially in AI, Software Engineering and Game Development.',
  'Beyond technology, I’m also drawn to art, psychology and the many ways of expressing an inner world.',
  'This is my personal space, where I keep my journey of growing up, the things I have made, and the small pieces of my life.',
];

export function localizedProfile(language: Language) {
  const vi = language === 'vi';
  return {
    displayName: profile.displayName,
    fullName: profile.fullName,
    headline: vi ? 'Biến ý tưởng thành hiện thực, và trí tưởng tượng thành những thế giới.' : profile.headline,
    role: vi ? 'Sinh viên CNTT / Lập trình viên AI & Phần mềm' : profile.role,
    institution: vi ? 'Trường Đại học Công nghệ (UET) – ĐHQG Hà Nội' : profile.education.institution,
    major: vi ? 'Công nghệ thông tin' : profile.education.major,
    bio: vi ? [...profile.bio.paragraphs] : BIO_EN,
    personality: vi ? [...profile.personality] : ['Introverted', 'Curious', 'Loves to explore'],
    interests: vi ? [...profile.interests] : ['Technology', 'Games', 'Visual Art', 'Character Design'],
    goal: vi
      ? profile.goal
      : 'To become an Engineering Lead who brings AI, Software and Cloud together to build creative systems and products of real value.',
    fields: vi
      ? ['Kỹ nghệ phần mềm', 'Trí tuệ nhân tạo', 'Điện toán đám mây', 'Phát triển game']
      : [...profile.professionalFields],
  };
}

const MILESTONES_VI: Record<string, { title: string; note?: string; period?: string }> = {
  'new-beginning': { title: 'Một khởi đầu mới' },
  'building-foundations': { title: 'Đặt nền móng', note: 'GPA học tập: 3.35 / 4.0' },
  'exploration-growth': { title: 'Khám phá & Trưởng thành', note: 'GPA học tập: 3.62 / 4.0' },
  'creating-building': { title: 'Sáng tạo & Kiến tạo', period: '2026–Nay' },
};

/** Journey paragraphs are written in Vietnamese; English is a faithful translation. */
const MILESTONES_EN: Record<string, string[]> = {
  'new-beginning': [
    'Closing the chapter of high school and beginning to study Information Technology at UET — Vietnam National University, Hanoi.',
  ],
  'building-foundations': [
    'In my first year, I focused on building foundations in mathematics, programming and problem-solving. Each course was a small step toward understanding the world of technology.',
  ],
  'exploration-growth': [
    'I began exploring the world of AI, from Machine Learning and Deep Learning to Reinforcement Learning. Alongside my studies, I spent time reading, experimenting with training models and gaining experience from real projects.',
    'It was also a time of many difficulties, but those very experiences helped me find my balance again, understand myself better and grow.',
  ],
  'creating-building': [
    'I am focusing on designing, creating and deploying software systems. Beyond learning technology, I want to use what I have gathered to turn ideas into real products.',
    'This chapter is still being written.',
  ],
};

export function localizedJourney(language: Language): { lede: string; milestones: Milestone[] } {
  if (language === 'vi') {
    return {
      lede: 'Mỗi chương đều góp phần tạo nên con người mình đang trở thành.',
      milestones: milestones.map((m) => ({ ...m, ...MILESTONES_VI[m.id], lang: 'vi' })),
    };
  }
  return {
    lede: journeyLede,
    milestones: milestones.map((m) => ({ ...m, description: MILESTONES_EN[m.id] ?? m.description, lang: 'en' })),
  };
}

const ALBUMS_VI: Record<string, { title: string; date?: string; alts: string[] }> = {
  studio: {
    title: 'Ảnh Studio',
    date: '6 tháng 6, 2026',
    alts: [
      'Ngồi trong bộ áo trắng thướt tha bên tấm bình phong, tay cầm một chiếc chén nhỏ',
      'Cầm chiếc quạt xếp màu xanh bên bàn trà thấp có ấm đất và hoa trắng',
      'Rót trà từ ấm đất bên bàn trà gỗ thấp',
      'Ngả người bên bàn trà trong bộ áo trắng, nhìn vào ống kính',
      'Đọc một cuốn sách đóng chỉ dưới chiếc ô giấy',
      'Tựa vào bàn trà, tay chống cằm, phía sau là hoa trắng',
      'Tay chống cằm bên bàn trà, ánh mắt nhìn sang bên',
      'Ngả người cạnh cuốn sách đóng chỉ đang mở bên chiếc ô vẽ hoa văn',
    ],
  },
  cosplay: {
    title: 'Bộ sưu tập Cosplay',
    date: '28 tháng 12, 2025',
    alts: [
      'Chân dung toàn thân trong chiếc áo choàng đen dài giữa công viên',
      'Cận cảnh đeo găng tay đen, cắn một sợi xích bạc',
      'Đưa bàn tay đeo găng quấn xích bạc về phía ống kính',
    ],
  },
  life: {
    title: 'Khoảnh khắc đời thường',
    alts: [
      'Trong bộ vest trắng bên chiếc bánh đen đội vương miện bạc',
      'Ngồi bên bàn nến, một tay che ngang mặt',
      'Nhìn xuống chiếc bánh đội vương miện giữa nến và hoa hồng đỏ',
      'Đứng sau bàn nến với chiếc bánh đội vương miện',
      'Nâng chiếc máy ảnh cổ lên mắt bên bàn nến',
    ],
  },
};

export function localizedAlbums(language: Language): Album[] {
  if (language === 'en') return albums;
  return albums.map((album) => {
    const vi = ALBUMS_VI[album.id];
    if (!vi) return album;
    return {
      ...album,
      title: vi.title,
      date: album.date && { ...album.date, label: vi.date ?? album.date.label },
      photos: album.photos.map((photo, i) => ({ ...photo, alt: vi.alts[i] ?? photo.alt })),
    };
  });
}

/** The CV is written in English; Vietnamese is a faithful translation. */
const CV_VI = {
  focus: 'AI / Kỹ nghệ phần mềm',
  standing: 'Sinh viên đại học ngành Công nghệ thông tin',
  school: 'UET · Đại học Quốc gia Hà Nội',
  contactLabels: { Email: 'Email', GitHub: 'GitHub', Location: 'Địa chỉ' } as Record<string, string>,
  location: 'Hà Nội, Việt Nam',
  education: {
    institution: 'Trường Đại học Công nghệ',
    university: 'Đại học Quốc gia Hà Nội',
    program: 'Công nghệ thông tin',
    expected: 'Dự kiến tốt nghiệp 2028',
  },
  skillGroups: { Programming: 'Lập trình', 'AI / ML': 'AI / ML', Software: 'Phần mềm', Tools: 'Công cụ' } as Record<string, string>,
  courses: {
    'Advanced Programming': 'Lập trình nâng cao',
    'Data Structures & Algo.': 'Cấu trúc dữ liệu & Giải thuật',
    'Object-Oriented Prog.': 'Lập trình hướng đối tượng',
    'Computer Networks': 'Mạng máy tính',
  } as Record<string, string>,
  languages: ['Tiếng Anh: trung cấp (tự đánh giá)'],
  summary:
    'Sinh viên ngành Công nghệ thông tin (dự kiến tốt nghiệp 2028), tập trung vào AI và kỹ nghệ phần mềm. Có kinh nghiệm thiết kế kiến trúc cho các dự án sinh viên, phát triển một agent cờ vua dùng Deep Q-Network, và điều phối các AI coding agent để xây dựng hệ thống phần mềm theo mô-đun.',
  projects: {
    'Chess AI Tournament': {
      role: 'Trưởng nhóm / Lập trình viên Học tăng cường sâu',
      points: [
        'Với vai trò trưởng nhóm, thiết kế và xây dựng kiến trúc ứng dụng cờ vua, giao diện bot dạng mô-đun, quy trình tích hợp và các hệ thống dùng chung.',
        'Phát triển bot cờ vua dùng Học tăng cường sâu (DQN), bao gồm huấn luyện tự đấu (self-play) và đánh giá benchmark.',
        'Điều phối các AI coding agent trong quá trình triển khai; tích hợp chế độ người đấu bot và bot đấu bot, bảng xếp hạng Elo và lịch sử trận đấu.',
      ],
    },
    'AI Asset Studio': {
      role: 'Dự án cá nhân / Đang phát triển',
      points: [
        'Thiết kế kiến trúc và xây dựng ứng dụng tạo tài nguyên game ưu tiên chạy cục bộ, định nghĩa các mô-đun frontend/backend, API và hợp đồng mô hình.',
        'Chỉ đạo nhiều AI coding agent triển khai các quy trình chế độ mô phỏng (mock), kiểm tra dữ liệu, quản lý tác vụ và xem trước PNG / 3D GLB.',
        'Trạng thái hiện tại: đã có các quy trình mô phỏng; tích hợp Kaggle trực tiếp và các mô hình sinh nội dung cho môi trường production chưa hoàn thành.',
      ],
    },
  } as Record<string, { role: string; points: string[] }>,
  recognition: { 'Second Prize': { title: 'Giải Nhì', detail: 'Kỳ thi học sinh giỏi Toán cấp tỉnh (lớp 12)' } } as Record<string, { title: string; detail: string }>,
};

export function localizedCv(language: Language) {
  if (language === 'en') {
    return {
      ...cv,
      contact: cv.contact.map((c) => ({ ...c })),
      skills: cv.skills.map((s) => ({ group: s.group, items: [...s.items] })),
      coursework: cv.coursework.map((c) => ({ ...c })),
      languages: [...cv.languages],
      projects: cv.projects.map((p) => ({ ...p, stack: [...p.stack], points: [...p.points] })),
      recognition: cv.recognition.map((r) => ({ ...r })),
    };
  }
  return {
    ...cv,
    focus: CV_VI.focus,
    standing: CV_VI.standing,
    school: CV_VI.school,
    contact: cv.contact.map((c) => ({
      ...c,
      label: CV_VI.contactLabels[c.label] ?? c.label,
      value: c.label === 'Location' ? CV_VI.location : c.value,
    })),
    education: { ...cv.education, ...CV_VI.education },
    skills: cv.skills.map((s) => ({ group: CV_VI.skillGroups[s.group] ?? s.group, items: [...s.items] })),
    coursework: cv.coursework.map((c) => ({ ...c, course: CV_VI.courses[c.course] ?? c.course })),
    languages: CV_VI.languages,
    summary: CV_VI.summary,
    projects: cv.projects.map((p) => ({ ...p, stack: [...p.stack], ...CV_VI.projects[p.title] })),
    recognition: cv.recognition.map((r) => CV_VI.recognition[r.title] ?? { ...r }),
  };
}

/** Interface copy for the Chronicle. */
export const COPY = {
  navLabel: { en: 'Chronicle sections', vi: 'Các mục của Biên Niên' },
  navIdentity: { en: 'Identity', vi: 'Danh tính' },
  navJourney: { en: 'My Journey', vi: 'Hành trình' },
  navGallery: { en: 'Fragments of Me', vi: 'Mảnh ghép của mình' },
  navSkills: { en: 'Knowledge & Skills', vi: 'Kiến thức & Kỹ năng' },
  navConnect: { en: 'Resume & Connect', vi: 'Hồ sơ & Kết nối' },
  masthead: { en: 'Personal Chronicle', vi: 'Biên niên cá nhân' },
  mastIdentity: { en: '01 · Identity', vi: '01 · Danh tính' },
  portrait: { en: 'Portrait', vi: 'Chân dung' },
  portraitNote: { en: 'Placeholder · to be provided by the creator', vi: 'Ảnh tạm · tác giả sẽ bổ sung' },
  scroll: { en: 'Scroll', vi: 'Cuộn' },
  about: { en: 'About', vi: 'Giới thiệu' },
  education: { en: 'Education', vi: 'Học vấn' },
  major: { en: 'Major', vi: 'Chuyên ngành' },
  role: { en: 'Role', vi: 'Vai trò' },
  personality: { en: 'Personality', vi: 'Tính cách' },
  journeyKicker: { en: 'Chronicle', vi: 'Biên niên' },
  journeyTitle: { en: ['My ', 'Journey'], vi: ['Hành ', 'trình'] },
  journeyPending: { en: 'Milestones below are placeholders until the creator supplies verified entries.', vi: 'Các cột mốc dưới đây là nội dung tạm cho đến khi tác giả cung cấp thông tin đã xác minh.' },
  placeholder: { en: 'Placeholder', vi: 'Tạm thời' },
  now: { en: 'Now', vi: 'Hiện tại' },
  galleryKicker: { en: 'Photographs', vi: 'Nhiếp ảnh' },
  galleryTitle: { en: ['Fragments ', 'of Me'], vi: ['Mảnh ghép ', 'của mình'] },
  albums: { en: 'Albums', vi: 'Album' },
  photosPending: { en: 'Photos pending', vi: 'Ảnh đang chờ' },
  photosPendingNote: { en: 'Photos appear once the image pipeline strips their metadata. Plates show the planned proportions.', vi: 'Ảnh sẽ xuất hiện sau khi quy trình xử lý xóa hết metadata. Các khung đang hiển thị tỉ lệ dự kiến.' },
  openViewer: { en: 'Open in viewer', vi: 'Mở trong trình xem' },
  viewer: { en: 'photo viewer', vi: 'trình xem ảnh' },
  close: { en: 'Close', vi: 'Đóng' },
  previousPhoto: { en: 'Previous photo', vi: 'Ảnh trước' },
  nextPhoto: { en: 'Next photo', vi: 'Ảnh sau' },
  viewerHint: { en: '← → to browse · Esc to close', vi: '← → để xem · Esc để đóng' },
  skillsKicker: { en: 'Fields', vi: 'Lĩnh vực' },
  skillsTitle: { en: ['Knowledge ', '& Skills'], vi: ['Kiến thức ', '& Kỹ năng'] },
  interests: { en: 'Interests', vi: 'Sở thích' },
  direction: { en: 'Direction', vi: 'Định hướng' },
  technologies: { en: 'Technologies', vi: 'Công nghệ' },
  pending: { en: 'Pending', vi: 'Đang chờ' },
  technologiesPending: { en: 'Detailed list awaits the creator’s confirmation.', vi: 'Danh sách chi tiết đang chờ tác giả xác nhận.' },
  connectKicker: { en: 'Closing', vi: 'Khép lại' },
  connectTitle: { en: ['Resume ', '& Connect'], vi: ['Hồ sơ ', '& Kết nối'] },
  newTab: { en: '(opens in a new tab)', vi: '(mở trong thẻ mới)' },
  sign: { en: 'Chronicle', vi: 'Biên Niên' },
  backToTop: { en: 'Back to top', vi: 'Lên đầu trang' },
  cvKicker: { en: 'Curriculum Vitae', vi: 'Sơ yếu lý lịch' },
  cvSummary: { en: 'Profile Summary', vi: 'Tóm tắt' },
  cvProjects: { en: 'Selected Projects', vi: 'Dự án tiêu biểu' },
  cvRecognition: { en: 'Academic Recognition', vi: 'Thành tích học tập' },
  cvContact: { en: 'Contact', vi: 'Liên hệ' },
  cvEducation: { en: 'Education', vi: 'Học vấn' },
  cvGpa: { en: 'Cumulative GPA', vi: 'GPA tích lũy' },
  cvSkills: { en: 'Technical Skills', vi: 'Kỹ năng chuyên môn' },
  cvCoursework: { en: 'Selected Coursework', vi: 'Môn học tiêu biểu' },
  cvLanguages: { en: 'Languages', vi: 'Ngoại ngữ' },
} satisfies Record<string, Localized<unknown>>;

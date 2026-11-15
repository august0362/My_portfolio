import type { Milestone } from '../types';

// Supplied verbatim by the creator (Lead, 2026-11-15). Titles in English, body text in Vietnamese.
// No milestone images yet; the timeline shows numerals until approved photos exist.
export const journeyLede = 'Every chapter shapes the person I’m becoming.';

export const milestones: Milestone[] = [
  {
    id: 'new-beginning',
    period: '2024',
    title: 'A New Beginning',
    lang: 'vi',
    description: [
      'Khép lại chặng đường phổ thông và bắt đầu hành trình học Công nghệ thông tin tại UET — Đại học Quốc gia Hà Nội.',
    ],
  },
  {
    id: 'building-foundations',
    period: '2024–2025',
    title: 'Building Foundations',
    lang: 'vi',
    description: [
      'Năm đầu tiên, mình tập trung xây dựng nền tảng về toán học, lập trình và tư duy giải quyết vấn đề. Từng môn học là một bước nhỏ giúp mình hiểu hơn về thế giới công nghệ.',
    ],
    note: 'Academic GPA: 3.35 / 4.0',
  },
  {
    id: 'exploration-growth',
    period: '2025–2026',
    title: 'Exploration & Growth',
    lang: 'vi',
    description: [
      'Mình bắt đầu khám phá thế giới AI, từ Machine Learning, Deep Learning đến Reinforcement Learning. Bên cạnh việc học, mình dành thời gian đọc sách, thử nghiệm huấn luyện mô hình và tích lũy kinh nghiệm từ những dự án thực tế.',
      'Đây cũng là giai đoạn có nhiều khó khăn, nhưng chính những trải nghiệm đó đã giúp mình tìm lại sự cân bằng, hiểu bản thân hơn và trưởng thành hơn.',
    ],
    note: 'Academic GPA: 3.62 / 4.0',
  },
  {
    id: 'creating-building',
    period: '2026–Present',
    title: 'Creating & Building',
    lang: 'vi',
    description: [
      'Mình đang tập trung vào thiết kế, sáng tạo và triển khai các hệ thống phần mềm. Không chỉ dừng lại ở việc học công nghệ, mình muốn sử dụng những kiến thức đã tích lũy để biến ý tưởng thành sản phẩm thực tế.',
      'Đây là chương đang được viết tiếp.',
    ],
    current: true,
  },
];

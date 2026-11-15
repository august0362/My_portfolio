import type { Localized } from '@shared/i18n';
import type { Language } from '@shared/settings';
import type { Project } from '../types';

/*
 * Vietnamese versions of the project text (P-17). The English entries in projects.ts stay the
 * source of truth; these are faithful translations and add no new facts.
 */
type ProjectText = Partial<Omit<Project, 'gallery' | 'developmentStatus' | 'approaches' | 'contributions'>> & {
  developmentStatus?: Project['developmentStatus'];
  approachDescriptions?: readonly string[];
  contributions?: Project['contributions'];
  gallery?: readonly { title: string; caption: string; alt: string }[];
};

const VI: Record<string, ProjectText> = {
  'chess-ai': {
    subtitle: 'Bốn hướng tiếp cận. Một bàn cờ.',
    description: 'Một đấu trường cờ vua nơi con người và các agent AI được phát triển độc lập gặp nhau, thi đấu và xem lại những ván đã chơi.',
    objective: 'Đưa nhiều hướng tiếp cận AI cờ vua khác nhau vào cùng một môi trường chơi được, với các trận đấu chung, giải đấu và công cụ để xem lại ván cờ.',
    introductionHeading: 'Cuộc hội ngộ của những bộ óc, trên sáu mươi tư ô cờ.',
    featuresHeading: 'Để chơi. Để so tài.',
    platformNote: 'Nút Chơi game mở trang web của game. Kho GitHub mô tả ứng dụng Windows / Pygame. Portfolio này không chạy suy luận cờ vua.',
    category: 'Trí tuệ nhân tạo · Ứng dụng cờ vua',
    developmentStatus: {
      label: 'Dự án cờ vua chơi được',
      detail: 'Các tính năng mô tả ở đây dựa theo kho mã Windows / Pygame. Trang web game do chủ dự án cung cấp được liên kết qua nút Chơi game; bộ tính năng của trang web chưa được kiểm chứng độc lập.',
    },
    features: [
      'Trận Người đấu Bot và Bot đấu Bot',
      'Giải đấu và bảng xếp hạng AI',
      'Lịch sử và xem lại ván cờ',
      'Giao diện đánh giá thế cờ và phân tích ván đấu',
    ],
    approachDescriptions: [
      'Tìm kiếm cây trò chơi kết hợp với hàm đánh giá tuyến tính được học.',
      'Một agent tìm kiếm khác, với hàm đánh giá được tinh chỉnh bằng tiến hóa.',
      'Một agent riêng khám phá thế cờ qua các lần mô phỏng lặp lại.',
      'Agent RL Hybrid đưa học tăng cường sâu vào cùng đấu trường.',
    ],
    contributions: [
      { role: 'Product Owner', description: 'Định hướng sản phẩm và trải nghiệm chơi cũng như so sánh các agent.' },
      { role: 'Trưởng nhóm tích hợp', description: 'Kết nối các agent do các thành viên phát triển độc lập với ứng dụng.' },
      { role: 'Lập trình viên GUI / UX', description: 'Phát triển giao diện và các luồng chơi, giải đấu và xem lại ván cờ.' },
      { role: 'Lập trình viên Deep RL', description: 'Phát triển agent học tăng cường sâu trong dự án chung của nhóm.' },
    ],
    teamContext: 'Một dự án nhóm với bốn hướng tiếp cận AI được phát triển độc lập. Phần việc của mình kết nối sản phẩm, giao diện, tích hợp và phát triển Deep RL.',
    demoNote: 'Chơi bản web, hoặc tìm hiểu ứng dụng desktop trên GitHub.',
    gallery: [
      { title: 'Sảnh cờ thiên hà', caption: 'Ảnh concept do chủ dự án cung cấp cho thế giới portfolio này. Đây không phải ảnh chụp gameplay.', alt: 'Ảnh concept những quân cờ bạc phản chiếu dưới các vành sáng thiên hà trong một sảnh đá obsidian.' },
      { title: 'Nghiên cứu bối cảnh', caption: 'Một bản concept nền sạch khác trong bộ ảnh được cung cấp. Chưa có ảnh chụp gameplay hiện tại.', alt: 'Một bản nghiên cứu concept khác về bàn cờ bạc trong sảnh kim loại mang sắc thiên hà.' },
    ],
  },
};

/** Returns the project in the visitor's language. */
export function localizeProject(project: Project, language: Language): Project {
  const vi = language === 'vi' ? VI[project.slug] : undefined;
  if (!vi) return project;
  const { approachDescriptions, gallery, ...text } = vi;
  return {
    ...project,
    ...text,
    approaches: project.approaches.map((approach, i) => ({ ...approach, description: approachDescriptions?.[i] ?? approach.description })),
    gallery: project.gallery.map((image, i) => ({ ...image, ...gallery?.[i] })),
    coverImage: { ...project.coverImage, alt: gallery?.[0]?.alt ?? project.coverImage.alt },
    scene: { ...project.scene, background: { ...project.scene.background, alt: gallery?.[0]?.alt ?? project.scene.background.alt } },
  };
}

/** Interface copy for The Forge. */
export const COPY = {
  forge: { en: 'The Forge', vi: 'Xưởng Sáng Tạo' },
  world: { en: 'Production world', vi: 'Thế giới Tác Phẩm' },
  explorePage: { en: 'Explore', vi: 'Khám phá' },
  exploreRegion: { en: 'Explore the project world', vi: 'Khám phá thế giới dự án' },
  exploreProject: { en: 'Explore', vi: 'Khám phá' },
  viewProject: { en: 'View project', vi: 'Xem dự án' },
  destinations: { en: 'Destinations', vi: 'Điểm đến' },
  destinationsLabel: { en: 'Project destinations', vi: 'Các điểm đến dự án' },
  focus: { en: 'Focus', vi: 'Tập trung vào' },
  drag: { en: 'Drag to explore', vi: 'Kéo để khám phá' },
  dragHint: { en: 'Scroll to zoom · Arrow keys to pan', vi: 'Cuộn để thu phóng · Phím mũi tên để di chuyển' },
  sceneView: { en: 'Scene view', vi: 'Góc nhìn cảnh' },
  zoomOut: { en: 'Zoom out', vi: 'Thu nhỏ' },
  zoomIn: { en: 'Zoom in', vi: 'Phóng to' },
  zoomLevel: { en: 'Zoom level', vi: 'Mức thu phóng' },
  resetView: { en: 'Reset view', vi: 'Đặt lại góc nhìn' },
  conceptCaption: { en: 'Concept artwork · Not gameplay', vi: 'Ảnh concept · Không phải gameplay' },
  dossierCaption: { en: 'Portfolio concept artwork · Not gameplay', vi: 'Ảnh concept cho portfolio · Không phải gameplay' },
  backToProduction: { en: 'Back to Production', vi: 'Về Tác Phẩm' },
  approaches: { en: 'The approaches', vi: 'Các hướng tiếp cận' },
  approachesLede: { en: 'The ideas behind the experience.', vi: 'Những ý tưởng phía sau trải nghiệm.' },
  toolkit: { en: 'The toolkit', vi: 'Bộ công cụ' },
  closerLook: { en: 'A closer look', vi: 'Nhìn gần hơn' },
  conceptLede: { en: 'Concept art for the portfolio experience.', vi: 'Ảnh concept cho trải nghiệm portfolio.' },
  journalLede: { en: 'A visual journal of the project.', vi: 'Nhật ký hình ảnh của dự án.' },
  myPart: { en: 'My part in the project', vi: 'Phần việc của mình' },
  exploreWork: { en: 'Explore the work.', vi: 'Khám phá sản phẩm.' },
  resources: { en: 'Play the game or read the source code.', vi: 'Chơi game hoặc xem mã nguồn.' },
  returnForge: { en: 'Return to The Forge', vi: 'Về Xưởng Sáng Tạo' },
  play: { en: 'Play Game', vi: 'Chơi game' },
  source: { en: 'View Source on GitHub', vi: 'Xem mã nguồn trên GitHub' },
  newTab: { en: '(opens in a new tab)', vi: '(mở trong thẻ mới)' },
  notFoundPage: { en: 'Project not found', vi: 'Không tìm thấy dự án' },
  notFoundTitle: { en: 'This project isn’t here.', vi: 'Dự án này không có ở đây.' },
  notFoundBody: { en: 'Return to The Forge to explore the available projects.', vi: 'Hãy về Xưởng Sáng Tạo để khám phá các dự án hiện có.' },
  noImages: { en: 'Project images will appear here when supplied.', vi: 'Hình ảnh dự án sẽ xuất hiện ở đây khi được cung cấp.' },
  enlarge: { en: 'Enlarge', vi: 'Phóng to' },
  conceptKind: { en: 'Concept artwork', vi: 'Ảnh concept' },
  gameplayKind: { en: 'Gameplay screenshot', vi: 'Ảnh chụp gameplay' },
  previousImage: { en: 'Previous image', vi: 'Ảnh trước' },
  nextImage: { en: 'Next image', vi: 'Ảnh sau' },
  chooseImage: { en: 'Choose gallery image', vi: 'Chọn ảnh' },
  show: { en: 'Show', vi: 'Xem' },
  artwork: { en: 'Project artwork', vi: 'Ảnh dự án' },
  closeArtwork: { en: 'Close artwork', vi: 'Đóng ảnh' },
  server: { en: 'Server', vi: 'Máy chủ' },
  checking: { en: 'Checking', vi: 'Đang kiểm tra' },
  online: { en: 'Online', vi: 'Trực tuyến' },
  offline: { en: 'Offline', vi: 'Ngoại tuyến' },
  unknown: { en: 'Status unavailable', vi: 'Chưa rõ trạng thái' },
  checkingNote: { en: 'Asking the game server…', vi: 'Đang hỏi máy chủ game…' },
  onlineNote: { en: 'Ready to play', vi: 'Sẵn sàng để chơi' },
  offlineNote: { en: 'The game server is resting right now', vi: 'Máy chủ game đang tạm nghỉ' },
  unknownNote: { en: 'The live status could not be read', vi: 'Không đọc được trạng thái trực tiếp' },
  checkedAt: { en: 'checked at', vi: 'kiểm tra lúc' },
  recheck: { en: 'Check again', vi: 'Kiểm tra lại' },
} satisfies Record<string, Localized>;

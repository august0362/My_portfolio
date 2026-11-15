import type { Localized } from '@shared/i18n';
import type { WorldId } from '@shared/contract';

/** Core-owned copy in both site languages (P-17). Worlds localize their own content. */
export const WORLD_NAMES: Record<WorldId, Localized> = {
  information: { en: 'Chronicle', vi: 'Biên Niên' },
  production: { en: 'Production', vi: 'Tác Phẩm' },
  character: { en: 'Character', vi: 'Nhân Vật' },
  wanderlight: { en: 'Wanderlight', vi: 'Wanderlight' },
  ethereal: { en: 'Ethereal', vi: 'Ethereal' },
};

export const WORLD_LINES: Record<WorldId, Localized> = {
  information: { en: 'The story behind the person.', vi: 'Câu chuyện phía sau một con người.' },
  production: { en: 'Ideas brought into being.', vi: 'Những ý tưởng được hiện thực hóa.' },
  character: { en: 'A collection of other selves.', vi: 'Bộ sưu tập những bản thể khác.' },
  wanderlight: { en: 'Where the light takes you.', vi: 'Nơi ánh sáng dẫn lối.' },
  ethereal: { en: 'Somewhere beyond the tangible.', vi: 'Một nơi vượt ngoài hữu hình.' },
};

export const SHELL_COPY = {
  portal: { en: 'Celestial Portal', vi: 'Cổng Thiên Hà' },
  returnToPortal: { en: 'Return to the Portal', vi: 'Về Cổng Thiên Hà' },
  global: { en: 'Global', vi: 'Điều hướng chung' },
  loading: { en: 'Opening', vi: 'Đang mở' },
  notFoundTitle: { en: 'Page not found', vi: 'Không tìm thấy trang' },
  notFoundBody: { en: 'This page does not exist. Return to the Portal to choose a world.', vi: 'Trang này không tồn tại. Hãy về Cổng Thiên Hà để chọn một thế giới.' },
  errorTitle: { en: 'This world could not open', vi: 'Không thể mở thế giới này' },
  errorBody: { en: 'Try again, or return to the Portal to visit another world.', vi: 'Hãy thử lại, hoặc về Cổng Thiên Hà để ghé một thế giới khác.' },
  retry: { en: 'Retry', vi: 'Thử lại' },
} satisfies Record<string, Localized>;

export const HUB_COPY = {
  wordmark: { en: 'Celestial', vi: 'Thiên Hà' },
  topNote: { en: 'A personal constellation', vi: 'Một chòm sao riêng' },
  kicker: { en: 'A place between worlds', vi: 'Nơi giao giữa các thế giới' },
  titleA: { en: 'Follow your', vi: 'Hãy theo' },
  titleB: { en: 'curiosity.', vi: 'sự tò mò.' },
  intro: { en: 'Five worlds. A different side of the same universe.', vi: 'Năm thế giới. Mỗi nơi là một mặt khác của cùng một vũ trụ.' },
  stage: { en: 'Rotating celestial portal', vi: 'Cổng thiên hà đang xoay' },
  pulse: { en: 'Pulse the universe', vi: 'Gửi nhịp sáng vào vũ trụ' },
  pulseTitle: { en: 'Send a wave of light', vi: 'Gửi một làn sóng ánh sáng' },
  rays: { en: 'Interactive light rays', vi: 'Các tia sáng tương tác' },
  rayHelp: { en: 'Drag a light, or use arrow keys to move it. It drifts back to its orbit after release. Home returns it sooner.', vi: 'Kéo một tia sáng, hoặc dùng phím mũi tên để di chuyển. Thả ra, nó sẽ trôi về quỹ đạo. Phím Home đưa nó về nhanh hơn.' },
  ray: { en: 'Move light ray', vi: 'Di chuyển tia sáng' },
  worlds: { en: 'Worlds', vi: 'Các thế giới' },
  enter: { en: 'Enter', vi: 'Vào' },
  explore: { en: 'Explore', vi: 'Khám phá' },
  caption: { en: 'Every world is a new perspective.', vi: 'Mỗi thế giới là một góc nhìn mới.' },
  controls: { en: 'Orbit controls', vi: 'Điều khiển quỹ đạo' },
  previous: { en: 'Previous world', vi: 'Thế giới trước' },
  next: { en: 'Next world', vi: 'Thế giới sau' },
  pause: { en: 'Pause orbit', vi: 'Tạm dừng quỹ đạo' },
  resume: { en: 'Resume orbit', vi: 'Tiếp tục quỹ đạo' },
  hintAnimated: { en: 'Drag a light · Discover its orbit', vi: 'Kéo một tia sáng · Khám phá quỹ đạo' },
  hintStatic: { en: 'Choose a world to explore', vi: 'Chọn một thế giới để khám phá' },
} satisfies Record<string, Localized>;
